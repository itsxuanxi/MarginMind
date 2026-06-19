import { features } from "./config";

/**
 * Supabase client factory.
 *
 * Returns `null` when Supabase isn't configured so callers can fall back
 * to the bundled mock dataset. This keeps the entire app runnable with
 * zero environment configuration.
 */
export async function getSupabase() {
  if (!features.supabase) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

/** Service-role client for trusted server operations (webhooks, admin). */
export async function getSupabaseAdmin() {
  if (!features.supabase || !process.env.SUPABASE_SERVICE_ROLE_KEY) return null;
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
