"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "How is MarginMind different from my store analytics?",
    a: "Shopify, Amazon and TikTok analytics show revenue and basic costs. MarginMind reconstructs true net profit per SKU — folding in shipping, returns, platform and payment fees, ad spend, storage and operating costs — then tells you exactly where margin is leaking and what to do about it.",
  },
  {
    q: "Do I need to connect my store to get started?",
    a: "No. You can upload a CSV of orders, costs and ad spend and get a full profit report in under two minutes. Native integrations with Shopify, Amazon, TikTok Shop, Meta Ads and more are available to automate the sync.",
  },
  {
    q: "Which channels and markets are supported?",
    a: "Shopify, Amazon, TikTok Shop and Walmart Marketplace across the US, Canada, UK, Germany and Australia. Selling internationally? Per-market customs and duty modeling is built in — so cross-border costs show up in true profit too.",
  },
  {
    q: "How does the AI Profit Agent work?",
    a: "It analyzes your live margins, ad efficiency and return rates, then generates prioritized recommendations — pricing changes, ad reallocations, market expansion and discontinuation calls — each with a confidence score and estimated monthly impact. You can also chat with it in plain English.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — every plan starts with a 14-day free trial, no credit card required. Founding customers lock in 40% off for life.",
  },
  {
    q: "Is my financial data secure?",
    a: "Data is encrypted in transit and at rest, isolated per workspace with row-level security, and never sold or shared. You can export or delete your data at any time.",
  },
];

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);
  return (
    <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-card">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-medium">{f.q}</span>
              <Plus
                className={cn(
                  "size-5 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-45"
                )}
              />
            </button>
            {isOpen && (
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted-foreground animate-fade-in">
                {f.a}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
