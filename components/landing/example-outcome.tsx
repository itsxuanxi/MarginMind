"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Info } from "lucide-react";
import { CountUp } from "./count-up";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const ROWS = [
  { label: "Net Margin", before: "6.2%", afterTo: 19.4, decimals: 1, suffix: "%" },
  { label: "Monthly Profit", before: "$31k", afterTo: 45.2, decimals: 1, prefix: "$", suffix: "k" },
  { label: "Money-Losing SKUs", before: "9", afterTo: 1, decimals: 0 },
];

export function ExampleOutcome() {
  const reduce = useReducedMotion();
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-strong">Example outcome</span>
        <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          What Acting on Hidden Profit Looks Like
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          A 90-day swing modeled from MarginMind&apos;s sample dataset — repricing, cutting ad waste, and
          sunsetting money-losing SKUs.
        </p>
      </div>

      <div className="mt-14 grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
        {/* BEFORE */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="rounded-3xl border border-border bg-secondary/40 p-8"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Before</p>
          <dl className="mt-6 space-y-6">
            {ROWS.map((r) => (
              <div key={r.label}>
                <dt className="text-sm text-muted-foreground">{r.label}</dt>
                <dd className="tabular mt-1 text-4xl font-semibold tracking-tight text-muted-foreground/70">{r.before}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="flex items-center justify-center">
          <span className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-brand-strong shadow-sm">
            <ArrowRight className="size-5 lg:block" />
          </span>
        </div>

        {/* AFTER */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
          className="rounded-3xl border border-brand/40 bg-gradient-to-br from-[var(--brand-soft)] to-card p-8 shadow-[0_30px_70px_-30px_rgba(15,157,110,0.45)]"
        >
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-strong">After</p>
          <dl className="mt-6 space-y-6">
            {ROWS.map((r) => (
              <div key={r.label}>
                <dt className="text-sm text-muted-foreground">{r.label}</dt>
                <dd className="mt-1 text-4xl font-semibold tracking-tight text-foreground">
                  <CountUp to={r.afterTo} decimals={r.decimals} prefix={r.prefix} suffix={r.suffix} className="tabular" />
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      <p className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <Info className="size-3.5" /> Illustrative figures generated from sample data for demonstration.
      </p>
    </div>
  );
}
