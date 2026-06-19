/** Client helper: starts a real Stripe Checkout for a plan and redirects to the hosted page. */
export async function startCheckout(plan: "founding" | "pro"): Promise<void> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json().catch(() => ({}));

  // Needs sign-in first (production with Clerk).
  if (data.redirect) {
    window.location.href = data.redirect;
    return;
  }
  // Stripe-hosted Checkout URL.
  if (data.url) {
    window.location.href = data.url;
    return;
  }
  throw new Error(data.error || "Unable to start checkout. Please try again.");
}

/** Opens the Stripe Customer Portal. Returns false if unavailable so the caller can message. */
export async function openBillingPortal(): Promise<boolean> {
  const res = await fetch("/api/stripe/portal", { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (data.url) {
    window.location.href = data.url;
    return true;
  }
  return false;
}
