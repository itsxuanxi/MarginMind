"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Store,
  Layers,
  Globe2,
  Upload,
  LineChart,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CHANNELS, MARKETS, SKUS } from "@/lib/mock-data";
import { summarize } from "@/lib/profit";
import { RECOMMENDATIONS } from "@/lib/ai";
import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const STEPS = [
  { icon: Store, title: "Create your store", sub: "Tell us about your business" },
  { icon: Layers, title: "Sales channels", sub: "Where you sell" },
  { icon: Globe2, title: "Markets", sub: "Where you ship" },
  { icon: Upload, title: "Sample data", sub: "Load data to explore" },
  { icon: LineChart, title: "Profit report", sub: "Your first insight" },
  { icon: Sparkles, title: "AI insight", sub: "Your first recommendation" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(0);
  const [storeName, setStoreName] = React.useState("");
  const [channels, setChannels] = React.useState<string[]>(["Shopify"]);
  const [markets, setMarkets] = React.useState<string[]>(["US"]);
  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const summary = summarize(SKUS);
  const rec = RECOMMENDATIONS[0];

  const toggle = (arr: string[], set: (v: string[]) => void, val: string) =>
    set(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const canNext = () => {
    if (step === 0) return storeName.trim().length > 1;
    if (step === 1) return channels.length > 0;
    if (step === 2) return markets.length > 0;
    if (step === 3) return loaded;
    return true;
  };

  const loadSample = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setLoaded(true); }, 1100);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
    else router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Sidebar progress */}
      <aside className="flex flex-col gap-1 border-b border-border bg-sidebar p-6 lg:w-80 lg:border-b-0 lg:border-r lg:p-8">
        <Logo tone="light" />
        <p className="mt-8 hidden text-sm text-sidebar-muted lg:block">
          Get to your first profit insight in under two minutes.
        </p>
        <div className="mt-6 hidden space-y-1 lg:block">
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            return (
              <div key={i} className={cn("flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors", active && "bg-sidebar-accent")}>
                <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold", done ? "bg-brand text-white" : active ? "bg-white text-sidebar" : "bg-sidebar-accent text-sidebar-muted")}>
                  {done ? <Check className="size-4" /> : i + 1}
                </span>
                <div>
                  <p className={cn("text-sm font-medium", active || done ? "text-white" : "text-sidebar-muted")}>{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex gap-1.5 lg:hidden">
          {STEPS.map((_, i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= step ? "bg-brand" : "bg-sidebar-accent")} />
          ))}
        </div>
      </aside>

      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-xl">
          <div className="mb-6 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-brand-strong">
              {React.createElement(STEPS[step].icon, { className: "size-5" })}
            </span>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
              <h1 className="text-xl font-semibold tracking-tight">{STEPS[step].title}</h1>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            {step === 0 && (
              <div className="space-y-4">
                <div className="space-y-1.5"><Label>Store name</Label><Input value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g. Northwind Goods" autoFocus /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label>Primary platform</Label><Select defaultValue="Shopify">{CHANNELS.map((c) => <option key={c}>{c}</option>)}</Select></div>
                  <div className="space-y-1.5"><Label>Base currency</Label><Select defaultValue="USD"><option>USD</option><option>EUR</option><option>GBP</option><option>CAD</option><option>AUD</option></Select></div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Select every channel you sell on. You can change this later.</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {CHANNELS.map((c) => (
                    <button key={c} onClick={() => toggle(channels, setChannels, c)} className={cn("flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-all", channels.includes(c) ? "border-brand bg-[var(--brand-soft)]/40" : "border-border hover:border-muted-foreground/40")}>
                      {c}
                      <span className={cn("flex size-5 items-center justify-center rounded-full border", channels.includes(c) ? "border-brand bg-brand text-white" : "border-border")}>
                        {channels.includes(c) && <Check className="size-3" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Which markets do you ship to? We&apos;ll model customs & duties per market.</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                  {MARKETS.map((m) => (
                    <button key={m} onClick={() => toggle(markets, setMarkets, m)} className={cn("flex items-center justify-between rounded-lg border p-3 text-sm font-medium transition-all", markets.includes(m) ? "border-brand bg-[var(--brand-soft)]/40" : "border-border hover:border-muted-foreground/40")}>
                      {m}
                      <span className={cn("flex size-5 items-center justify-center rounded-full border", markets.includes(m) ? "border-brand bg-brand text-white" : "border-border")}>
                        {markets.includes(m) && <Check className="size-3" />}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-center">
                {!loaded ? (
                  <>
                    <p className="text-sm text-muted-foreground">Load a realistic sample dataset (3 stores, 20 products, 100 orders) so you can explore MarginMind immediately. You can replace it with your own data anytime.</p>
                    <Button variant="brand" size="lg" onClick={loadSample} disabled={loading} className="mx-auto">
                      {loading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                      {loading ? "Loading sample data…" : "Load sample data"}
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <CheckCircle2 className="size-10 text-brand" />
                    <p className="mt-3 font-medium">Sample data loaded</p>
                    <p className="text-sm text-muted-foreground">20 products across 5 markets and 4 channels.</p>
                  </div>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">Here&apos;s your first profit report, computed from your data:</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { l: "Revenue", v: formatCurrency(summary.revenue) },
                    { l: "Net Profit", v: formatCurrency(summary.netProfit) },
                    { l: "Avg Margin", v: formatPercent(summary.avgMargin) },
                    { l: "Profit Leakage", v: formatCurrency(summary.profitLeakage), bad: true },
                  ].map((x) => (
                    <div key={x.l} className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground">{x.l}</p>
                      <p className={cn("tabular mt-1 text-lg font-semibold", x.bad && "text-red-600")}>{x.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">And your first AI recommendation:</p>
                <div className="rounded-xl border border-brand/30 bg-[var(--brand-soft)]/40 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-brand-strong">{rec.category}</span>
                    <span className="text-sm font-semibold text-brand-strong">+{formatCurrency(rec.monthlyImpact)}/mo</span>
                  </div>
                  <p className="mt-2 font-semibold">{rec.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{rec.explanation}</p>
                </div>
                <p className="text-center text-sm text-muted-foreground">You&apos;re all set. Let&apos;s open your dashboard.</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button variant="brand" onClick={next} disabled={!canNext()}>
              {step === STEPS.length - 1 ? "Go to dashboard" : "Continue"}
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
