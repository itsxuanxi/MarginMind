import Link from "next/link";
import { ArrowRight, FlaskConical, TrendingUp, Wallet, Megaphone, PackageX, Info } from "lucide-react";
import { Eyebrow } from "./section";
import { cn } from "@/lib/utils";

/**
 * Illustrative "what good looks like" scenario, modeled on MarginMind's
 * built-in sample dataset. Deliberately not attributed to a real customer.
 */

const OUTCOMES = [
  { icon: TrendingUp, label: "Net margin increase", value: "+13 pts" },
  { icon: Wallet, label: "Monthly profit recovered", value: "+$14k" },
  { icon: Megaphone, label: "Wasted ad spend removed", value: "$9k" },
  { icon: PackageX, label: "Money-losing SKUs eliminated", value: "8 → 1" },
];

const COMPARE = [
  { label: "Net margin", before: "6.2%", after: "19.4%" },
  { label: "Monthly net profit", before: "$31,000", after: "$45,200" },
  { label: "Money-losing SKUs", before: "9", after: "1" },
  { label: "Ad spend / revenue", before: "31%", after: "22%" },
  { label: "Profit visibility", before: "Monthly, manual", after: "Real-time, per SKU" },
];

export function CaseStudy() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <Eyebrow>Example outcomes · sample data</Eyebrow>
        <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          What acting on the data can look like over 90 days
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A modeled scenario for a ~$470k/month cross-border brand, using MarginMind&apos;s built-in
          sample dataset. Illustrative — not based on a specific customer.
        </p>
      </div>

      {/* Outcome stats */}
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OUTCOMES.map((o) => (
          <div key={o.label} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--brand-soft)] text-brand-strong"><o.icon className="size-[18px]" /></span>
            <p className="tabular mt-3 text-2xl font-semibold tracking-tight text-brand-strong">{o.value}</p>
            <p className="mt-0.5 text-sm text-muted-foreground">{o.label}</p>
          </div>
        ))}
      </div>

      {/* Before / After */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ComparePanel variant="before" />
        <ComparePanel variant="after" />
      </div>

      {/* Disclaimer + CTA */}
      <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><FlaskConical className="size-5" /></span>
        <p className="text-[15px] leading-relaxed text-foreground/90">
          This is the kind of swing MarginMind is built to surface — the model reprices a few SKUs,
          pauses negative-margin ad sets, and cuts the products that quietly lose money.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Info className="size-3.5" /> Figures are illustrative, generated from sample data for demonstration.
        </p>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-strong hover:underline">
          Explore this in the live demo <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

function ComparePanel({ variant }: { variant: "before" | "after" }) {
  const after = variant === "after";
  return (
    <div className={cn("rounded-2xl border p-6", after ? "border-brand/40 bg-gradient-to-br from-[var(--brand-soft)] to-card" : "border-border bg-secondary/40")}>
      <div className="flex items-center gap-2">
        <span className={cn("size-2.5 rounded-full", after ? "bg-brand" : "bg-muted-foreground/50")} />
        <h3 className={cn("text-sm font-semibold uppercase tracking-wide", after ? "text-brand-strong" : "text-muted-foreground")}>
          {after ? "After MarginMind" : "Before MarginMind"}
        </h3>
      </div>
      <dl className="mt-4 divide-y divide-border/70">
        {COMPARE.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-2.5">
            <dt className="text-sm text-muted-foreground">{row.label}</dt>
            <dd className={cn("tabular text-sm font-semibold", after ? "text-foreground" : "text-muted-foreground")}>
              {after ? row.after : row.before}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
