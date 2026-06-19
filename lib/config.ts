/**
 * Central feature-flag + environment detection.
 *
 * MarginMind is designed to run end-to-end with ZERO third-party keys.
 * Every integration degrades gracefully into a high-fidelity demo mode.
 * These flags let the UI and server code branch without scattering
 * `process.env.X` checks everywhere.
 */

const has = (v?: string | null) => typeof v === "string" && v.trim().length > 0;

export const features = {
  clerk: has(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
  supabase:
    has(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    has(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  openai: has(process.env.OPENAI_API_KEY),
  stripe: has(process.env.STRIPE_SECRET_KEY),
} as const;

/** True when the entire stack is in demo (mock) mode. */
export const isDemoMode = !features.clerk && !features.supabase;

export const appUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const adminEmails = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdmin(identifier?: string | null): boolean {
  if (!identifier) return isDemoMode; // demo mode: admin is open for exploration
  return adminEmails.includes(identifier.toLowerCase());
}

export const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";

export const DEMO_USER = {
  id: "demo-user",
  name: "Alex Rivera",
  email: "zhang2543723434@gmail.com",
  company: "Northwind Goods Co.",
  role: "Founder",
  plan: "growth" as const,
};
