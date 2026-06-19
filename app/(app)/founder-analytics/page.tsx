import { redirect } from "next/navigation";

// Founder Analytics lives at /admin. This alias keeps /founder-analytics working.
export default function FounderAnalyticsAlias() {
  redirect("/admin");
}
