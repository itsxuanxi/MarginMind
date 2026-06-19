import { DEMO_USER, features, isAdmin } from "./config";
import type { SessionUser } from "@/components/layout/app-shell";

/**
 * Resolve the current session user. In demo mode this returns a
 * realistic stub so every authenticated page renders without Clerk.
 */
export async function getSessionUser(): Promise<SessionUser> {
  if (features.clerk) {
    try {
      const { currentUser } = await import("@clerk/nextjs/server");
      const u = await currentUser();
      if (u) {
        const email = u.primaryEmailAddress?.emailAddress ?? "";
        const name =
          [u.firstName, u.lastName].filter(Boolean).join(" ") ||
          u.username ||
          email ||
          "Seller";
        return {
          name,
          email,
          company:
            (u.publicMetadata?.company as string) || DEMO_USER.company,
          plan: (u.publicMetadata?.plan as string) || DEMO_USER.plan,
          isAdmin: isAdmin(email),
        };
      }
    } catch {
      // fall through to demo
    }
  }

  return {
    name: DEMO_USER.name,
    email: DEMO_USER.email,
    company: DEMO_USER.company,
    plan: DEMO_USER.plan,
    isAdmin: isAdmin(null),
  };
}
