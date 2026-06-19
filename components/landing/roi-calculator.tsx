"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

const INTENSITY = {
  Low: { rate: 0.045, label: "Mostly organic" },
  Medium: { rate: 0.065, label: "Balanced paid + organic" },
  High: { rate: 0.085, label: "Heavy paid acquisition" },
} as const;
type Intensity = keyof typeof INTENSITY;

export function RoiCalculator() {
  const [revenue, setRevenue] = React.useState(120000);
  const [intensity, setIntensity] = React.useState<Intensity>("Medium");

  const rate = INTENSITY[intensity].rate;
  const monthly = Math.round(revenue * rate);
  const annual = monthly * 12;
  const roi = Math.max(1, Math.round(monthly / 99));
  const pct = ((revenue - 10000) / (1000000 - 10000)) * 100;

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="grid lg:grid-cols-2">
        {/* Inputs */}
        <div className="p-8 lg:p-10">
          <div className="space-y-8">
            <div>
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-medium text-muted-foreground">Your monthly revenue</label>
                <span className="tabular text-xl font-semibold">{formatCurrency(revenue, { compact: true })}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={1000000}
                step={5000}
                value={revenue}
                onChange={(e) => setRevenue(Number(e.target.value))}
                aria-label="Monthly revenue"
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full outline-none [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-brand"
                style={{ background: `linear-gradient(to right, var(--brand) ${pct}%, var(--secondary) ${pct}%)` }}
              />
              <div className="mt-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>$10k</span><span>$1M+</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Advertising intensity</label>
              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {(Object.keys(INTENSITY) as Intensity[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setIntensity(k)}
                    className={cn(
                      "rounded-lg border px-3 py-2.5 text-sm font-medium transition-all",
                      intensity === k ? "border-brand bg-[var(--brand-soft)]/50 text-brand-strong" : "border-border hover:border-muted-foreground/40"
                    )}
                  >
                    {k}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{INTENSITY[intensity].label}</p>
            </div>

            <p className="rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
              Based on the median <span className="font-semibold text-foreground">{(rate * 100).toFixed(1)}%</span> of
              revenue cross-border sellers recover in the first 90 days after surfacing hidden
              shipping, customs, return and ad-waste leaks.
            </p>
          </div>
        </div>

        {/* Result */}
        <div className="relative flex flex-col justify-center overflow-hidden bg-sidebar p-8 lg:p-10">
          <div className="absolute inset-0 grid-bg opacity-[0.06]" />
          <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-brand/20 blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand">
              <TrendingUp className="size-3.5" /> Estimated recoverable profit
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="col-span-2 rounded-2xl bg-white/5 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-sidebar-muted">Per year</p>
                <p className="mt-1 bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-5xl font-semibold tracking-tight text-transparent">
                  {formatCurrency(annual, { compact: true })}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-sidebar-muted">Per month</p>
                <p className="tabular mt-1 text-2xl font-semibold text-white">{formatCurrency(monthly, { compact: true })}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-sidebar-muted">ROI multiple</p>
                <p className="tabular mt-1 text-2xl font-semibold text-brand">{roi}×</p>
              </div>
            </div>

            <p className="mt-3 text-center text-xs text-sidebar-muted">on a $99/mo Growth plan</p>

            <Button asChild variant="brand" size="lg" className="mt-5 w-full">
              <Link href="/sign-up">Find my hidden profit <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
