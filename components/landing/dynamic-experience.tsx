"use client";

import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import {
  Table2,
  Store,
  Globe2,
  TrendingDown,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const STEPS = [
  { id: "sku", icon: Table2, label: "SKU Profitability", caption: "Which products actually make money — full P&L per SKU." },
  { id: "channel", icon: Store, label: "Channel Profitability", caption: "Shopify, Amazon, TikTok Shop and more — side by side." },
  { id: "market", icon: Globe2, label: "Market Profitability", caption: "True net margin by region, not just revenue." },
  { id: "leak", icon: TrendingDown, label: "Profit Leak Detection", caption: "Hidden shipping, returns and fees — found and ranked." },
  { id: "ai", icon: Sparkles, label: "AI Profit Agent", caption: "Prioritized actions that grow the bottom line." },
] as const;

/* ---------------- per-step screens ---------------- */

const SKU_ROWS = [
  { name: "Glow Vitamin-C Serum", sku: "GLW-301", net: "+$20.3K", margin: "45%", neg: false },
  { name: "Aurora Pour-Over Set", sku: "AUR-101", net: "+$19.3K", margin: "48%", neg: false },
  { name: "TrailLite 45L Pack", sku: "SUM-201", net: "+$8.1K", margin: "21%", neg: false },
  { name: "Ultralight 2P Tent", sku: "SUM-212", net: "−$5.3K", margin: "−12%", neg: true },
];

const CHANNELS = [
  { name: "Shopify", margin: 24, net: "$31.2K" },
  { name: "Amazon", margin: 18, net: "$22.7K" },
  { name: "TikTok Shop", margin: 12, net: "$9.4K" },
  { name: "Walmart", margin: 7, net: "$3.1K" },
];

const MARKETS = [
  { name: "United States", margin: 22, net: "$38.5K", neg: false },
  { name: "Canada", margin: 17, net: "$12.1K", neg: false },
  { name: "United Kingdom", margin: 14, net: "$8.7K", neg: false },
  { name: "Germany", margin: 9, net: "$4.2K", neg: false },
  { name: "Australia", margin: -4, net: "−$1.6K", neg: true },
];

const LEAKS = [
  { name: "Ultralight 2P Tent", sku: "SUM-212", reason: "Ad spend exceeds margin", loss: "−$5,291", sev: "Critical" },
  { name: "Insulated Trail Bottle", sku: "SUM-204", reason: "Shipping 29% of revenue", loss: "−$4,229", sev: "Critical" },
  { name: "Lip Oil Gloss Duo", sku: "GLW-315", reason: "Return rate 24%", loss: "−$1,180", sev: "High" },
];

function Row({ children, i, active, reduce }: { children: React.ReactNode; i: number; active: boolean; reduce: boolean | null }) {
  return (
    <motion.div
      initial={false}
      animate={active ? { opacity: 1, x: 0 } : { opacity: 0, x: reduce ? 0 : -8 }}
      transition={{ duration: 0.5, ease: EASE, delay: active && !reduce ? 0.08 + i * 0.07 : 0 }}
    >
      {children}
    </motion.div>
  );
}

function Bar({ pct, active, i, reduce }: { pct: number; active: boolean; i: number; reduce: boolean | null }) {
  const neg = pct < 0;
  const width = `${Math.min(100, (Math.abs(pct) / 24) * 100)}%`;
  return (
    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
      <motion.div
        initial={false}
        animate={{ width: active || reduce ? width : "0%" }}
        transition={{ duration: 0.7, ease: EASE, delay: active && !reduce ? 0.12 + i * 0.08 : 0 }}
        className={cn("h-full rounded-full", neg ? "bg-red-500" : "bg-gradient-to-r from-brand/70 to-brand")}
      />
    </div>
  );
}

function Screen({ step, active, reduce }: { step: number; active: boolean; reduce: boolean | null }) {
  if (step === 0) {
    return (
      <div className="flex h-full flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">SKU Profit Analysis</p>
        <div className="mt-3 grid grid-cols-[1fr_auto_auto] gap-x-4 px-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/70">
          <span>Product</span><span className="text-right">Net</span><span className="text-right">Margin</span>
        </div>
        <div className="mt-1.5 space-y-1.5">
          {SKU_ROWS.map((r, i) => (
            <Row key={r.sku} i={i} active={active} reduce={reduce}>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 rounded-lg border border-border bg-background/60 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.name}</p>
                  <p className="text-[11px] text-muted-foreground">{r.sku}</p>
                </div>
                <span className={cn("tabular text-right text-sm font-semibold", r.neg ? "text-red-600" : "text-brand-strong")}>{r.net}</span>
                <span className={cn("tabular w-12 text-right text-sm font-medium", r.neg ? "text-red-600" : "text-foreground")}>{r.margin}</span>
              </div>
            </Row>
          ))}
        </div>
      </div>
    );
  }
  if (step === 1 || step === 2) {
    const rows = step === 1 ? CHANNELS : MARKETS;
    const title = step === 1 ? "Profit by Channel" : "Profit by Market";
    return (
      <div className="flex h-full flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <div className="mt-4 space-y-4">
          {rows.map((r, i) => (
            <Row key={r.name} i={i} active={active} reduce={reduce}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{r.name}</span>
                <span className={cn("tabular font-semibold", "neg" in r && r.neg ? "text-red-600" : "text-brand-strong")}>{r.net}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-3">
                <Bar pct={r.margin} active={active} i={i} reduce={reduce} />
                <span className={cn("tabular w-12 text-right text-xs font-medium", r.margin < 0 ? "text-red-600" : "text-muted-foreground")}>{r.margin}%</span>
              </div>
            </Row>
          ))}
        </div>
      </div>
    );
  }
  if (step === 3) {
    return (
      <div className="flex h-full flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profit Leaks · 3 found</p>
        <div className="mt-3 space-y-2.5">
          {LEAKS.map((l, i) => (
            <Row key={l.sku} i={i} active={active} reduce={reduce}>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600"><AlertTriangle className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{l.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{l.sku} · {l.reason}</p>
                </div>
                <span className="tabular shrink-0 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">{l.loss}/mo</span>
              </div>
            </Row>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full flex-col">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI Profit Agent</p>
      <Row i={0} active={active} reduce={reduce}>
        <div className="mt-3 rounded-xl border border-brand/30 bg-[var(--brand-soft)] p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-brand-strong"><Sparkles className="size-4" /> Recommended action</div>
          <p className="mt-2 text-sm text-foreground/80">Cut ad spend on <b>SUM-212</b> by 35% — ROAS no longer covers fulfillment.</p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-brand-strong"><ArrowUpRight className="size-3.5" /> Est. +$4,400/mo · 91% confidence</p>
        </div>
      </Row>
      <div className="mt-2.5 space-y-2">
        {["Raise price on AUR-101 by 7%", "Sunset GLW-315 in Australia"].map((t, i) => (
          <Row key={t} i={i + 1} active={active} reduce={reduce}>
            <div className="flex items-center gap-2.5 rounded-lg border border-border bg-background/60 p-2.5 text-sm">
              <Check className="size-4 shrink-0 text-brand" /> {t}
            </div>
          </Row>
        ))}
      </div>
    </div>
  );
}

/* ---------------- section ---------------- */

export function DynamicExperience() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(STEPS.length - 1, Math.max(0, Math.floor(v * STEPS.length))));
  });

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = window.scrollY + el.getBoundingClientRect().top;
    const band = (el.offsetHeight - window.innerHeight) / STEPS.length;
    window.scrollTo({ top: Math.round(top + band * i + band * 0.5), behavior: "smooth" });
  };

  return (
    <section ref={ref} className="relative h-[260vh] border-y border-border bg-card lg:h-[300vh]">
      <div className="sticky top-0 flex min-h-[100svh] items-center py-16 sm:py-20">
        <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            {/* Narrative + steps */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-strong">Live product</span>
              <h2 className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                From scattered data to true profit.
              </h2>
              <p className="mt-4 max-w-md text-lg text-muted-foreground">
                Your numbers live across Shopify, Amazon, TikTok Shop, Stripe, PayPal, ads,
                shipping and returns. MarginMind turns it into one source of profit truth.
              </p>

              <div className="mt-8 flex gap-4">
                {/* progress rail */}
                <div className="relative mt-1 w-px shrink-0 bg-border">
                  <motion.div style={{ height: fill }} className="absolute left-0 top-0 w-px bg-brand" />
                </div>
                <ol className="flex-1 space-y-1">
                  {STEPS.map((s, i) => {
                    const on = i === active;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => jump(i)}
                          className={cn(
                            "group flex w-full items-start gap-3 rounded-lg px-2 py-2 text-left transition-colors",
                            on ? "bg-[var(--brand-soft)]/50" : "hover:bg-secondary/60"
                          )}
                        >
                          <span className={cn("mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg border transition-colors", on ? "border-brand bg-brand text-white" : "border-border text-muted-foreground")}>
                            <s.icon className="size-3.5" />
                          </span>
                          <span className="min-w-0">
                            <span className={cn("block text-sm font-semibold transition-colors", on ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                            <motion.span
                              initial={false}
                              animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                              transition={{ duration: 0.35, ease: EASE }}
                              className="block overflow-hidden text-sm text-muted-foreground"
                            >
                              <span className="block pt-0.5">{s.caption}</span>
                            </motion.span>
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Dashboard window */}
            <div className="relative">
              <div className="pointer-events-none absolute -inset-x-6 -top-6 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-brand/10 to-transparent blur-2xl" />
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_80px_-24px_rgba(10,12,16,0.35)] ring-1 ring-black/5">
                {/* chrome */}
                <div className="flex items-center gap-2 border-b border-border bg-secondary/70 px-4 py-3">
                  <span className="size-3 rounded-full bg-[#ff5f57]" />
                  <span className="size-3 rounded-full bg-[#febc2e]" />
                  <span className="size-3 rounded-full bg-[#28c840]" />
                  <div className="mx-auto flex items-center gap-1.5 rounded-md bg-card px-3 py-1 text-[11px] text-muted-foreground shadow-sm">
                    app.marginmind.io
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-medium text-brand-strong">
                    <span className="size-1.5 rounded-full bg-brand animate-pulse" /> Live
                  </span>
                </div>
                {/* swapping content */}
                <div className="relative h-[340px] p-5 sm:h-[360px]">
                  {STEPS.map((s, i) => (
                    <motion.div
                      key={s.id}
                      initial={false}
                      animate={{ opacity: i === active ? 1 : 0, scale: i === active ? 1 : 0.98, y: i === active ? 0 : 6 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className={cn("absolute inset-0 p-5", i === active ? "pointer-events-auto" : "pointer-events-none")}
                      aria-hidden={i !== active}
                    >
                      <Screen step={i} active={i === active} reduce={reduce} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
