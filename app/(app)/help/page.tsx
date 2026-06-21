"use client";

import * as React from "react";
import Link from "next/link";
import {
  Search,
  Rocket,
  Upload,
  Sparkles,
  CreditCard,
  Plug,
  TrendingDown,
  MessageCircle,
  BookOpen,
  Mail,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CATEGORIES = [
  { icon: Rocket, title: "Getting Started", count: 8, desc: "Set up your workspace and see your first profit report." },
  { icon: Upload, title: "Importing Data", count: 12, desc: "CSV uploads, column mapping and integrations." },
  { icon: TrendingDown, title: "Profit & Leaks", count: 9, desc: "How we calculate net profit and detect leaks." },
  { icon: Sparkles, title: "AI Profit Agent", count: 6, desc: "Get the most from recommendations and chat." },
  { icon: Plug, title: "Integrations", count: 10, desc: "Connect Shopify, Amazon, TikTok, ad platforms." },
  { icon: CreditCard, title: "Billing & Plans", count: 7, desc: "Plans, upgrades, invoices and the founding program." },
];

const ARTICLES = [
  "How MarginMind calculates true net profit",
  "Mapping your Shopify export to MarginMind fields",
  "Understanding profit leak severity levels",
  "Connecting Meta Ads for SKU-level attribution",
  "What's included in each plan",
  "How the AI Profit Agent generates recommendations",
  "Allocating customs duties across markets",
  "Inviting your team and setting roles",
];

export default function HelpPage() {
  const [q, setQ] = React.useState("");
  const filtered = ARTICLES.filter((a) => a.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Help Center" description="Guides, answers and support — whenever you need them." />

      <Card className="overflow-hidden">
        <div className="relative radial-fade p-8 text-center">
          <h2 className="text-xl font-semibold">How can we help?</h2>
          <div className="relative mx-auto mt-4 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="h-12 pl-11 text-base" />
          </div>
        </div>
      </Card>

      {q ? (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {filtered.length === 0 && <p className="p-6 text-sm text-muted-foreground">No articles found for &ldquo;{q}&rdquo;.</p>}
            {filtered.map((a) => (
              <Link key={a} href="#" className="flex items-center justify-between p-4 hover:bg-accent">
                <span className="flex items-center gap-2.5 text-sm font-medium"><BookOpen className="size-4 text-muted-foreground" /> {a}</span>
                <ArrowRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Card key={c.title} className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-brand-strong"><c.icon className="size-5" /></span>
                  <h3 className="mt-3 font-semibold">{c.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                  <p className="mt-3 text-xs font-medium text-brand-strong">{c.count} articles →</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardContent className="divide-y divide-border p-0">
              <p className="px-5 pt-4 text-sm font-semibold">Popular articles</p>
              {ARTICLES.slice(0, 5).map((a) => (
                <Link key={a} href="#" className="flex items-center justify-between px-5 py-3.5 hover:bg-accent">
                  <span className="flex items-center gap-2.5 text-sm font-medium"><BookOpen className="size-4 text-muted-foreground" /> {a}</span>
                  <ArrowRight className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-gradient-to-br from-[var(--brand-soft)] to-card">
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand text-white"><MessageCircle className="size-5" /></span>
            <div className="flex-1"><p className="font-semibold">Chat with support</p><p className="text-sm text-muted-foreground">Avg. reply in under 2 hours.</p></div>
            <Button variant="brand" size="sm">Start chat</Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-muted-foreground"><Mail className="size-5" /></span>
            <div className="flex-1"><p className="font-semibold">Email us</p><p className="text-sm text-muted-foreground">support@marginmind.io</p></div>
            <Button asChild variant="outline" size="sm"><a href="mailto:support@marginmind.io">Email</a></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
