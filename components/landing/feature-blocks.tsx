"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Gauge, TrendingDown, Sparkles, ArrowUpRight, AlertTriangle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------- premium visuals per block ---------- */

function ProfitVisual() {
  const tiles = [
    { l: "Net Profit", v: "$65.4K", d: "+6.1%", up: true },
    { l: "Net Margin", v: "22.4%", d: "+3.1 pts", up: true },
    { l: "Profit Leakage", v: "$12.9K", d: "5 SKUs", danger: true },
  ];
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_24px_60px_-30px_rgba(10,12,16,0.35)]">
      <div className="grid grid-cols-3 gap-3">
        {tiles.map((t) => (
          <div key={t.l} className="rounded-xl border border-border p-3">
            <p className="text-[11px] text-muted-foreground">{t.l}</p>
            <p className={cn("tabular mt-1 text-lg font-semibold", t.danger && "text-red-600")}>{t.v}</p>
            <p className={cn("mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium", t.danger ? "text-red-600" : "text-brand-strong")}>
              <ArrowUpRight className={cn("size-3", t.danger && "rotate-90")} /> {t.d}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-3 flex h-24 items-end gap-1.5 rounded-xl border border-border p-3">
        {[40, 55, 48, 70, 62, 84, 78, 96].map((h, i) => (
          <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand/40 to-brand" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function LeakVisual() {
  const leaks = [
    { sku: "SUM-204", name: "Insulated Trail Bottle", loss: "−$4,229", sev: "Critical" },
    { sku: "SUM-212", name: "Ultralight 2-Person Tent", loss: "−$5,291", sev: "Critical" },
    { sku: "GLW-315", name: "Lip Oil Gloss Duo", loss: "−$1,180", sev: "High" },
  ];
  return (
    <div className="space-y-2.5 rounded-2xl border border-border bg-card p-5 shadow-[0_24px_60px_-30px_rgba(10,12,16,0.35)]">
      {leaks.map((l) => (
        <div key={l.sku} className="flex items-center gap-3 rounded-xl border border-border p-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600"><AlertTriangle className="size-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{l.name}</p>
            <p className="text-xs text-muted-foreground">{l.sku} · {l.sev}</p>
          </div>
          <span className="tabular rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">{l.loss}/mo</span>
        </div>
      ))}
    </div>
  );
}

function AgentVisual() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_24px_60px_-30px_rgba(10,12,16,0.35)]">
      <div className="rounded-xl border border-brand/30 bg-[var(--brand-soft)] p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-brand-strong"><Sparkles className="size-4" /> AI Profit Agent</div>
        <p className="mt-2 text-sm text-foreground/80">Cut ad spend on <b>SUM-212</b> by 35% — ROAS no longer covers fulfillment.</p>
        <p className="mt-2 text-xs font-semibold text-brand-strong">Est. +$4,400/mo · 91% confidence</p>
      </div>
      <div className="mt-3 space-y-2">
        {["Raise price on SUM-204 by 7%", "Expand GLW-301 into Canada"].map((t) => (
          <div key={t} className="flex items-center gap-2.5 rounded-lg border border-border p-2.5 text-sm">
            <Check className="size-4 text-brand" /> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

const BLOCKS = [
  {
    eyebrow: "01 — Visibility",
    icon: Gauge,
    title: "True Profit Visibility",
    body: "Net profit, contribution margin and leakage across every product, market and channel — in one calm executive view.",
    Visual: ProfitVisual,
  },
  {
    eyebrow: "02 — Detection",
    icon: TrendingDown,
    title: "Profit Leak Detection",
    body: "MarginMind automatically finds the SKUs quietly losing money — high shipping, returns, customs and ad waste — and quantifies each.",
    Visual: LeakVisual,
  },
  {
    eyebrow: "03 — Action",
    icon: Sparkles,
    title: "AI Profit Agent",
    body: "Prioritized recommendations with confidence scores and dollar impact. Ask it anything; act on what moves the bottom line.",
    Visual: AgentVisual,
  },
];

export function FeatureBlocks() {
  return (
    <div className="mx-auto max-w-6xl space-y-24 px-6 sm:space-y-32 lg:px-8">
      {BLOCKS.map((b, i) => {
        const flip = i % 2 === 1;
        return (
          <div key={b.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal className={cn(flip && "lg:order-2")}>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-strong">{b.eyebrow}</span>
              <h3 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{b.title}</h3>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">{b.body}</p>
            </Reveal>
            <Reveal delay={0.12} className={cn(flip && "lg:order-1")}>
              <b.Visual />
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
