"use client";

import * as React from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export function ContactForm() {
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      toast.success("Thanks! Our team will reach out within one business day.");
    }, 900);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-brand/30 bg-[var(--brand-soft)] p-10 text-center">
        <CheckCircle2 className="size-10 text-brand" />
        <h3 className="mt-4 text-lg font-semibold">Message received</h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          A member of our team will be in touch within one business day to discuss your needs.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" required placeholder="Jane Seller" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required placeholder="jane@brand.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" placeholder="Brand Co." />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="revenue">Monthly revenue</Label>
          <Select id="revenue" defaultValue="">
            <option value="" disabled>Select range</option>
            <option>Under $50k</option>
            <option>$50k – $250k</option>
            <option>$250k – $1M</option>
            <option>Over $1M</option>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea id="message" rows={4} placeholder="Tell us about your stores, channels and goals…" />
      </div>
      <Button type="submit" variant="brand" size="lg" disabled={loading} className="w-full sm:w-auto">
        {loading && <Loader2 className="size-4 animate-spin" />}
        Contact Sales
      </Button>
    </form>
  );
}
