"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, Sparkles, Table2, Globe2 } from "lucide-react";
import { DashboardMock } from "./dashboard-mock";

const EASE = [0.16, 1, 0.3, 1] as const;

const HIGHLIGHTS = [
  { icon: TrendingDown, title: "Profit leaks, surfaced", body: "The exact SKUs draining margin — quantified, ranked, and fixable." },
  { icon: Sparkles, title: "AI recommendations", body: "What to reprice, where to cut ad spend, which products to sunset." },
  { icon: Table2, title: "SKU-level analysis", body: "Full P&L per product, with status badges from healthy to losing money." },
  { icon: Globe2, title: "Market profitability", body: "True net margin by market and channel — not just revenue." },
];

export function DashboardShowcase() {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-strong">The product</span>
        <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          A profit command center, not another revenue chart
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Every number that actually moves your bottom line — in one calm, executive view.
        </p>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 40, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1, ease: EASE }}
        className="relative mx-auto mt-14 max-w-5xl"
      >
        <div className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-brand/10 to-transparent blur-2xl" />
        <div className="animate-float-slow">
          <DashboardMock />
        </div>
      </motion.div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((h, i) => (
          <motion.div
            key={h.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-brand-strong">
              <h.icon className="size-5" />
            </span>
            <h3 className="mt-3 font-semibold tracking-tight">{h.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{h.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
