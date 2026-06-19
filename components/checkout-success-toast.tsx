"use client";

import * as React from "react";
import { toast } from "sonner";

/** Shows a success toast after returning from Stripe Checkout / demo upgrade. */
export function CheckoutSuccessToast() {
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success" || params.get("upgraded") === "1") {
      toast.success("You're all set — your subscription is active. Premium features unlocked.");
      params.delete("checkout");
      params.delete("upgraded");
      params.delete("plan");
      const qs = params.toString();
      window.history.replaceState({}, "", window.location.pathname + (qs ? `?${qs}` : ""));
    }
  }, []);
  return null;
}
