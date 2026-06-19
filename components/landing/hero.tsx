"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  Lock,
  ShieldCheck,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardMock } from "@/components/landing/dashboard-mock";
import { FloatingMetrics } from "@/components/landing/floating-metrics";
import { FadeUp, Rise, FloatIn, Parallax } from "@/components/landing/motion";

const CHANNELS = ["Shopify", "Amazon", "TikTok Shop", "Walmart"];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-[0.4]" />
      <div className="absolute inset-0 radial-fade" />
      <div className="absolute left-1/2 top-0 -z-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />

      {/* Editorial side-rail labels */}
      <FadeUp delay={0.9} className="pointer-events-none absolute left-5 top-1/2 hidden -translate-y-1/2 xl:block">
        <span className="block text-[11px] font-medium uppercase tracking-[0.35em] text-muted-foreground/50 [writing-mode:vertical-rl]">
          Profit Intelligence
        </span>
      </FadeUp>
      <FadeUp delay={0.9} className="pointer-events-none absolute right-5 top-1/2 hidden -translate-y-1/2 xl:block">
        <span className="block rotate-180 text-[11px] font-medium uppercase tracking-[0.35em] text-muted-foreground/50 [writing-mode:vertical-rl]">
          AI-Native · Cross-Border
        </span>
      </FadeUp>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <FadeUp delay={0.05} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium shadow-sm">
              <span className="size-1.5 rounded-full bg-brand" />
              <span className="text-muted-foreground">Built for cross-border sellers who care about true profit</span>
            </span>
          </FadeUp>

          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            <Rise delay={0.15}>Know Your Real Profit Across Every</Rise>
            <Rise delay={0.28}>
              <span className="bg-gradient-to-r from-brand to-emerald-500 bg-clip-text text-transparent">
                Product, Market, and Channel.
              </span>
            </Rise>
          </h1>

          <FadeUp delay={0.42}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg text-muted-foreground">
              MarginMind is an AI Profit Agent for cross-border e-commerce sellers. It tracks
              true margins, detects profit leaks, and recommends actions that improve profitability.
            </p>
          </FadeUp>

          <FadeUp delay={0.5}>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-[15px] text-foreground/80">
              Explore a <span className="font-semibold text-foreground">live demo with sample ecommerce data</span> —
              no setup, no card. Connect your stores or upload a CSV later when you&apos;re ready.
            </p>
          </FadeUp>

          <FadeUp delay={0.58} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg" className="w-full transition-transform hover:scale-[1.03] sm:w-auto">
              <Link href="/sign-up">Start Free Trial <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full transition-transform hover:scale-[1.03] sm:w-auto">
              <Link href="/dashboard"><PlayCircle className="size-4" /> Try live demo with sample data</Link>
            </Button>
          </FadeUp>

          <FadeUp delay={0.66} className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="size-3.5 text-brand" /> 14-day free trial</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="size-3.5 text-brand" /> No credit card</span>
            <span className="flex items-center gap-1"><Database className="size-3.5 text-brand" /> Upload CSV later when ready</span>
          </FadeUp>

          <FadeUp delay={0.72} className="mt-6">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">Designed for sellers on</p>
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {CHANNELS.map((c) => (
                <span key={c} className="text-sm font-semibold tracking-tight text-muted-foreground/70">{c}</span>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.78} className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5"><Lock className="size-4 text-brand" /> 256-bit encryption</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-4 text-brand" /> Row-level security</span>
            <span className="h-3 w-px bg-border" />
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> GDPR-ready</span>
          </FadeUp>
        </div>

        {/* Dashboard: parallax + cinematic assemble-in + gentle float + floating metrics */}
        <Parallax distance={36} className="relative mx-auto mt-14 max-w-6xl">
          <div className="pointer-events-none absolute -inset-x-8 -top-8 bottom-0 -z-10 rounded-[2rem] bg-gradient-to-b from-brand/10 to-transparent blur-2xl" />
          <FloatingMetrics />
          <FloatIn>
            <div className="animate-float-slow">
              <DashboardMock />
            </div>
          </FloatIn>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Live demo dashboard, populated with realistic sample ecommerce data.
          </p>
        </Parallax>
      </div>
    </section>
  );
}
