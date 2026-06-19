"use client";

import * as React from "react";
import {
  Sparkles,
  Send,
  TrendingUp,
  Check,
  X,
  Loader2,
  Bot,
  Tag,
  Megaphone,
  Globe2,
  Ship,
  Boxes,
  Percent,
  CircleSlash,
  Gauge,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, StatCard, DemoModeBanner } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, SeverityBadge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/misc";
import { RECOMMENDATIONS, SUGGESTED_QUESTIONS } from "@/lib/ai";
import { formatCurrency } from "@/lib/format";
import type { AiRecommendation } from "@/lib/types";
import { cn } from "@/lib/utils";

const CAT_ICON: Record<AiRecommendation["category"], typeof Tag> = {
  Pricing: Tag,
  "Ad Budget": Megaphone,
  "Market Expansion": Globe2,
  Shipping: Ship,
  Inventory: Boxes,
  Margin: Percent,
  Discontinuation: CircleSlash,
};

export default function AiAgentPage() {
  const totalImpact = RECOMMENDATIONS.reduce((s, r) => s + r.monthlyImpact, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="AI Profit Agent" description="Your always-on analyst. Prioritized actions and answers, grounded in your data." />

      <DemoModeBanner />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Recommendations" value={String(RECOMMENDATIONS.length)} icon={Sparkles} hint="ready to action" tone="positive" />
        <StatCard label="Total Monthly Upside" value={formatCurrency(totalImpact)} icon={TrendingUp} tone="positive" hint="if fully executed" />
        <StatCard label="Avg Confidence" value={`${Math.round(RECOMMENDATIONS.reduce((s, r) => s + r.confidence, 0) / RECOMMENDATIONS.length)}%`} icon={Gauge} hint="model certainty" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <h2 className="text-base font-semibold">Recommendations</h2>
          {RECOMMENDATIONS.map((r) => <RecommendationCard key={r.id} rec={r} />)}
        </div>
        <div className="lg:col-span-2">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: { rec: AiRecommendation }) {
  const [state, setState] = React.useState<"open" | "applied" | "dismissed">("open");
  const Icon = CAT_ICON[rec.category];
  if (state === "dismissed") return null;

  return (
    <Card className={cn("transition-all", state === "applied" && "border-brand/40 bg-[var(--brand-soft)]/30")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Icon className="size-5" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="purple">{rec.category}</Badge>
                <SeverityBadge severity={rec.priority} />
              </div>
              <h3 className="mt-1.5 font-semibold leading-snug">{rec.title}</h3>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs text-muted-foreground">Est. impact</p>
            <p className="tabular text-lg font-semibold text-brand-strong">+{formatCurrency(rec.monthlyImpact)}</p>
            <p className="text-[11px] text-muted-foreground">/ month</p>
          </div>
        </div>

        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{rec.explanation}</p>

        <div className="mt-3 rounded-lg bg-secondary/60 px-3 py-2 text-sm">
          <span className="font-medium">Action: </span>{rec.suggestedAction}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Confidence</span>
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-brand" style={{ width: `${rec.confidence}%` }} />
            </div>
            <span className="tabular text-xs font-medium">{rec.confidence}%</span>
          </div>
          {state === "applied" ? (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-brand-strong"><Check className="size-4" /> Applied</span>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="xs" onClick={() => { setState("dismissed"); toast("Recommendation dismissed"); }}>
                <X className="size-3.5" /> Dismiss
              </Button>
              <Button variant="brand" size="xs" onClick={() => { setState("applied"); toast.success("Marked as applied — we'll track the impact."); }}>
                <Check className="size-3.5" /> Apply
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface Msg { role: "user" | "assistant"; content: string }

function ChatPanel() {
  const [messages, setMessages] = React.useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm your AI Profit Agent. Ask me anything about your margins, products, or where to grow profit. Try one of the suggestions below." },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: q }]);
    setLoading(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.answer || "I couldn't generate a response just now." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Something went wrong reaching the agent. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-20 flex h-[calc(100vh-7rem)] flex-col">
      <CardHeader className="flex-row items-center gap-2 space-y-0 border-b border-border py-3">
        <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-white"><Bot className="size-4" /></span>
        <div>
          <CardTitle className="text-sm">Profit Agent</CardTitle>
          <p className="text-xs text-brand-strong"><span className="mr-1 inline-block size-1.5 rounded-full bg-brand align-middle" />Online</p>
        </div>
      </CardHeader>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}>
            {m.role === "assistant" ? (
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white"><Sparkles className="size-3.5" /></span>
            ) : (
              <Avatar name="You" className="size-7 text-[10px]" />
            )}
            <div className={cn(
              "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
            )}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand text-white"><Sparkles className="size-3.5" /></span>
            <div className="rounded-2xl bg-secondary px-3.5 py-3"><Loader2 className="size-4 animate-spin text-muted-foreground" /></div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-3">
        {messages.length <= 1 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SUGGESTED_QUESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                {s}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your profit…"
            className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
          />
          <Button type="submit" variant="brand" size="icon" disabled={loading || !input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
