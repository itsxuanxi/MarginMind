"use client";

import * as React from "react";
import { Flame } from "lucide-react";
import { FOUNDING_PROGRAM } from "@/lib/plans";

function useCountdown(target: number) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export function FoundingBanner() {
  // Deadline: a fixed 6-day window for urgency.
  const target = React.useMemo(() => Date.now() + 6 * 86400000 + 14 * 3600000, []);
  const { d, h, m, s } = useCountdown(target);
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center">
      <span className="tabular rounded-lg bg-foreground px-2.5 py-1.5 text-lg font-semibold text-background">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">{l}</span>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 sm:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            <Flame className="size-3.5" /> Founding Customer Program
          </div>
          <h3 className="mt-3 text-xl font-semibold tracking-tight">
            First 50 customers get <span className="text-brand-strong">40% off — forever</span>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Starter $29 → <b>$17</b> · Growth $99 → <b>$59</b> · Scale $299 → <b>$179</b>.
            Limited to the first 50 customers.
          </p>
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/70 px-3 py-1 text-xs font-medium text-amber-800">
            Open now — limited to the first {FOUNDING_PROGRAM.totalSeats} founding customers
          </p>
        </div>
        <div className="shrink-0">
          <p className="mb-2 text-center text-[10px] uppercase tracking-wide text-muted-foreground">Early-access window</p>
          <div className="flex items-end gap-2.5">
            {cell(d, "Days")}
            {cell(h, "Hrs")}
            {cell(m, "Min")}
            {cell(s, "Sec")}
          </div>
        </div>
      </div>
    </div>
  );
}
