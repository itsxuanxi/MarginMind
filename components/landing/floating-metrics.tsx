"use client";

import { TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Three premium floating metric chips around the hero dashboard mock.
 * Purely decorative; hidden on small screens to avoid clutter.
 * Parent must be `relative`.
 */

function Chip({
  className,
  float,
  icon: Icon,
  iconClass,
  label,
  value,
  sub,
}: {
  className?: string;
  float: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute z-20 hidden lg:block", className)}>
      <div className={cn("rounded-2xl border border-border bg-card/95 p-3 shadow-[0_20px_40px_-20px_rgba(10,12,16,0.35)] backdrop-blur", float)}>
        <div className="flex items-center gap-2.5">
          <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-lg", iconClass)}>
            <Icon className="size-4" />
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="tabular text-sm font-semibold leading-tight">{value}</p>
          </div>
        </div>
        {sub && <p className="mt-1.5 max-w-[150px] text-[11px] leading-snug text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function FloatingMetrics() {
  return (
    <>
      <Chip
        className="-left-6 top-16 xl:-left-12"
        float="animate-float"
        icon={TrendingUp}
        iconClass="bg-[var(--brand-soft)] text-brand-strong"
        label="Net Margin"
        value="22.4%"
        sub="+3.1 pts vs last month"
      />
      <Chip
        className="-right-6 top-32 xl:-right-12"
        float="animate-float-delayed"
        icon={AlertTriangle}
        iconClass="bg-red-50 text-red-600"
        label="Profit Leakage"
        value="$12,922 / mo"
        sub="Detected across 5 SKUs"
      />
      <Chip
        className="-bottom-6 left-10 xl:left-4"
        float="animate-float-slow"
        icon={Sparkles}
        iconClass="bg-violet-50 text-violet-600"
        label="AI Recommendation"
        value="Cut SUM-212 ad spend"
        sub="Est. +$4,400 / mo · 91% confidence"
      />
    </>
  );
}
