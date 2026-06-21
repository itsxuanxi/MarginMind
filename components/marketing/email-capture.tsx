"use client";

import * as React from "react";
import { ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmailCapture({ className, dark = false }: { className?: string; dark?: boolean }) {
  const [email, setEmail] = React.useState("");
  const [done, setDone] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setDone(true);
    toast.success("You're on the list — check your inbox to get started.");
  };

  if (done) {
    return (
      <div className={cn("flex items-center justify-center gap-2 rounded-xl border border-brand/30 bg-[var(--brand-soft)] px-4 py-3 text-sm font-medium text-brand-strong", className)}>
        <Check className="size-4" /> Thanks! We&apos;ll be in touch shortly.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={cn("flex w-full flex-col gap-2 sm:flex-row", className)}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@yourstore.com"
        className={cn(
          "h-11 flex-1 rounded-lg border px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
          dark
            ? "border-white/15 bg-white/10 text-white placeholder:text-white/50"
            : "border-input bg-card placeholder:text-muted-foreground"
        )}
      />
      <Button type="submit" variant="brand" size="lg" className="shrink-0">
        Start Free <ArrowRight className="size-4" />
      </Button>
    </form>
  );
}
