"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, AlertTriangle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Three premium floating metric chips around the hero dashboard mock.
 * Framer entrance (pop-in) + continuous CSS float. Hidden on small screens.
 * Parent must be `relative`.
 */

function Chip({
  className,
  float,
  delay,
  icon: Icon,
  iconClass,
  label,
  value,
  sub,
}: {
  className?: string;
  float: string;
  delay: number;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  label: string;
  value: string;
  sub?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("pointer-events-none absolute z-20 hidden lg:block", className)}
      initial={reduce ? false : { opacity: 0, scale: 0.85, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
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
    </motion.div>
  );
}

export function FloatingMetrics() {
  return (
    <>
      <Chip
        className="-left-6 top-16 xl:-left-12"
        float="animate-float"
        delay={0.95}
        icon={TrendingUp}
        iconClass="bg-[var(--brand-soft)] text-brand-strong"
        label="Net Margin"
        value="22.4%"
        sub="+3.1 pts vs last month"
      />
      <Chip
        className="-right-6 top-32 xl:-right-12"
        float="animate-float-delayed"
        delay={1.1}
        icon={AlertTriangle}
        iconClass="bg-red-50 text-red-600"
        label="Profit Leakage"
        value="$12,922 / mo"
        sub="Detected across 5 SKUs"
      />
      <Chip
        className="-bottom-6 left-10 xl:left-4"
        float="animate-float-slow"
        delay={1.25}
        icon={Sparkles}
        iconClass="bg-violet-50 text-violet-600"
        label="AI Recommendation"
        value="Cut SUM-212 ad spend"
        sub="Est. +$4,400 / mo · 91% confidence"
      />
    </>
  );
}
