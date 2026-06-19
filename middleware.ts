import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { features } from "@/lib/config";

/**
 * Route protection.
 *
 * When Clerk keys are present, authenticated app routes are guarded.
 * With no keys the app runs in demo mode and the middleware is a no-op,
 * so every page is publicly explorable.
 */

const isProtected = createRouteMatcher([
  "/dashboard(.*)",
  "/sku-analysis(.*)",
  "/profit-leaks(.*)",
  "/ai-agent(.*)",
  "/upload(.*)",
  "/integrations(.*)",
  "/billing(.*)",
  "/settings(.*)",
  "/profile(.*)",
  "/help(.*)",
  "/admin(.*)",
  "/founder-analytics(.*)",
  "/onboarding(.*)",
]);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export default function middleware(req: NextRequest, ev: any) {
  if (!features.clerk) return NextResponse.next();
  return withClerk(req, ev);
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
