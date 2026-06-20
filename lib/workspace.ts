import { cookies } from "next/headers";
import { features } from "./config";

/**
 * Per-account identity & isolation.
 *
 * Every customer maps to a row in `users`:
 *  - With Clerk configured → keyed by `clerk_user_id` (true multi-tenant).
 *  - Without auth yet → an anonymous workspace keyed by an HTTP-only
 *    `mm_workspace` cookie token. This gives per-browser isolation today and
 *    upgrades cleanly to real accounts when Clerk is added.
 *
 * All DB access runs through the service role on the server and is ALWAYS
 * scoped to the resolved `user_id`, so data never leaks across accounts.
 */

const WS_COOKIE = "mm_workspace";
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

async function clerkUserId(): Promise<string | null> {
  if (!features.clerk) return null;
  try {
    const { auth } = await import("@clerk/nextjs/server");
    return (await auth()).userId ?? null;
  } catch {
    return null;
  }
}

/** Read-only resolver — safe in server components. Never creates rows. */
export async function getWorkspaceUserId(): Promise<string | null> {
  if (!features.supabase) return null;
  const { getSupabaseAdmin } = await import("./supabase");
  const supabase = await getSupabaseAdmin();
  if (!supabase) return null;

  const cid = await clerkUserId();
  if (cid) {
    const { data } = await supabase.from("users").select("id").eq("clerk_user_id", cid).maybeSingle();
    return data?.id ?? null;
  }

  const token = (await cookies()).get(WS_COOKIE)?.value;
  if (!token) return null;
  const { data } = await supabase.from("users").select("id").eq("workspace_token", token).maybeSingle();
  return data?.id ?? null;
}

/** Resolve-or-create the workspace user. Call ONLY from route handlers (sets a cookie). */
export async function ensureWorkspaceUserId(): Promise<string | null> {
  if (!features.supabase) return null;
  const { getSupabaseAdmin } = await import("./supabase");
  const supabase = await getSupabaseAdmin();
  if (!supabase) return null;

  const cid = await clerkUserId();
  if (cid) {
    const { data: existing } = await supabase.from("users").select("id").eq("clerk_user_id", cid).maybeSingle();
    if (existing) return existing.id;
    let email = `${cid}@clerk.local`;
    try {
      const { currentUser } = await import("@clerk/nextjs/server");
      email = (await currentUser())?.primaryEmailAddress?.emailAddress || email;
    } catch {
      /* ignore */
    }
    const { data: created } = await supabase.from("users").insert({ clerk_user_id: cid, email }).select("id").single();
    return created?.id ?? null;
  }

  const c = await cookies();
  const existingToken = c.get(WS_COOKIE)?.value;
  if (existingToken) {
    const { data } = await supabase.from("users").select("id").eq("workspace_token", existingToken).maybeSingle();
    if (data) return data.id;
  }

  const token = crypto.randomUUID();
  const { data: created } = await supabase
    .from("users")
    .insert({ workspace_token: token, email: `${token}@workspace.local` })
    .select("id")
    .single();
  if (!created) return null;
  c.set(WS_COOKIE, token, COOKIE_OPTS);
  return created.id;
}
