import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  PackageX,
  Ship,
  Globe2,
  Undo2,
  Megaphone,
  Layers,
  Sparkles,
  ShieldCheck,
  Gauge,
  LineChart,
  Plug,
  Brain,
  CheckCircle2,
  PlayCircle,
  Lock,
  Database,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Footer } from "@/components/marketing/footer";
import { EmailCapture } from "@/components/marketing/email-capture";
import { FAQ } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { MotionReveal, Stagger, StaggerItem } from "@/components/landing/motion";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { CaseStudy } from "@/components/landing/case-study";
import { Testimonials } from "@/components/landing/testimonials";
import { FounderStory } from "@/components/landing/founder-story";
import { SectionHead } from "@/components/landing/section";
import { Button } from "@/components/ui/button";

const PAINS = [
  { icon: TrendingUp, title: "Revenue up, profit down", body: "Top-line keeps growing while your bank balance doesn't. MarginMind shows exactly why." },
  { icon: Ship, title: "Hidden shipping costs", body: "Oversized parcels and long zones quietly eat 15–30% of margin on the wrong SKUs." },
  { icon: Globe2, title: "Customs duties ignored", body: "Cross-border duty is rarely allocated per product — until it's silently killing a market." },
  { icon: Undo2, title: "Expensive returns", body: "Refunds plus reverse logistics turn 'bestsellers' into money losers without you noticing." },
  { icon: Megaphone, title: "Unprofitable ad spend", body: "ROAS looks fine on the surface, but blended margin tells a very different story." },
  { icon: Layers, title: "Misleading marketplace analytics", body: "Shopify, Amazon, TikTok and Walmart each report differently. None show true net profit." },
];

const FEATURES = [
  { icon: Gauge, title: "True Profit Dashboard", body: "Net profit, contribution margin and leakage across every product, market and channel — in one executive view." },
  { icon: PackageX, title: "Profit Leak Detection", body: "Automatically surfaces high shipping, return-heavy, customs-heavy and unprofitable-ad SKUs with a fix for each." },
  { icon: Brain, title: "AI Profit Agent", body: "Prioritized recommendations with confidence scores and dollar impact — plus a chat you can ask anything." },
  { icon: LineChart, title: "Margin Trends", body: "See margin erosion before it becomes a crisis, with 12-month trends per channel and market." },
  { icon: Plug, title: "Unified Integrations", body: "Designed to sync Shopify, Amazon, TikTok Shop, Walmart, Meta and Google Ads into a single source of profit truth." },
  { icon: ShieldCheck, title: "Privacy-first by design", body: "Encrypted in transit and at rest, with row-level security so your data stays yours." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Announcement bar */}
      <Link
        href="/pricing"
        className="group flex items-center justify-center gap-2 bg-sidebar px-4 py-2.5 text-center text-sm text-sidebar-foreground transition-colors hover:text-white"
      >
        <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">Launching</span>
        <span>Founding customer program — 40% off for the first 50 sellers</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <MarketingNav />

      {/* ============ HERO + DASHBOARD MOCKUP ============ */}
      <Hero />

      {/* ============ FOUNDER STORY ============ */}
      <section className="border-y border-border bg-card py-20 sm:py-28">
        <FounderStory />
      </section>

      {/* ============ PROBLEM ============ */}
      <section id="product" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="The hidden problem"
            title={<>Your revenue is climbing.<br className="hidden sm:block" /> Your profit is quietly bleeding out.</>}
            description="Every month you scale, the leaks get bigger — and the dashboards you trust are the ones hiding them. Here's where the money actually goes."
          />

          <div className="mt-12 overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-red-50/70 to-card p-8 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-2">
              <div>
                <p className="text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                  &ldquo;We grew 40% last year and made{" "}
                  <span className="text-red-600">less money</span> than the year before.&rdquo;
                </p>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Every cross-border seller eventually says some version of this. By the time the
                  numbers reconcile at month-end, the damage is already done. MarginMind exists so
                  you never have to say it again.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { v: "+40%", l: "Revenue growth" },
                  { v: "−12%", l: "Net profit", bad: true },
                  { v: "3–8%", l: "Revenue lost to hidden costs", bad: true },
                  { v: "0", l: "Dashboards that show it" },
                ].map((s) => (
                  <div key={s.l} className="rounded-xl border border-border bg-card p-4">
                    <p className={`tabular text-2xl font-semibold ${s.bad ? "text-red-600" : "text-foreground"}`}>{s.v}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {PAINS.map((p) => (
              <div key={p.title} className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <span className="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-red-100">
                  <p.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section id="features" className="border-t border-border bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <SectionHead
              eyebrow="The financial OS for e-commerce"
              title="Everything you need to defend your margin"
              description="Ramp-grade clarity meets AI-native decision-making, purpose-built for cross-border sellers."
            />
          </MotionReveal>
          <Stagger className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <StaggerItem key={f.title} className="h-full">
                <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-xl">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-emerald-500 text-white shadow-sm ring-1 ring-inset ring-white/20 transition-transform duration-300 group-hover:scale-105">
                    <f.icon className="size-5" />
                  </span>
                  <h3 className="mt-4 font-semibold tracking-tight">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ============ ROI CALCULATOR ============ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="ROI calculator"
            title="How much profit could you be leaving on the table?"
            description="Drag the slider to estimate what surfacing hidden costs could recover for a business your size. Figures are illustrative."
          />
          <div className="mt-12">
            <RoiCalculator />
          </div>
        </div>
      </section>

      {/* ============ CASE STUDY (illustrative) ============ */}
      <section className="border-y border-border bg-card py-20 sm:py-28">
        <CaseStudy />
      </section>

      {/* ============ EARLY OPERATOR FEEDBACK ============ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="Early operator feedback"
            title="What early testers are saying"
            description="Paraphrased feedback from early-access operators exploring MarginMind with sample data. We're onboarding our first founding customers now."
          />
        </div>
        <div className="mt-14">
          <Testimonials />
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section id="pricing" className="border-t border-border bg-card py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <MotionReveal>
            <SectionHead
              eyebrow="Founding customer pricing"
              title="Simple pricing that pays for itself"
              description="Lock in founding pricing before public launch. Every plan starts with a 14-day free trial — no credit card required."
            />
          </MotionReveal>
          <MotionReveal delay={120} className="mt-12 block">
            <PricingPlans />
          </MotionReveal>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Lock className="size-4 text-brand" /> Encrypted &amp; private</span>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHead
            eyebrow="FAQ"
            title="Frequently asked questions"
            description="Everything you need to know before you start."
          />
          <div className="mt-12">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative overflow-hidden bg-sidebar py-24">
        <div className="absolute inset-0 grid-bg opacity-[0.06]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-aurora absolute left-1/2 top-[-25%] h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(15,157,110,0.35),transparent)] blur-[110px]" />
          <div className="animate-float-slow absolute right-[6%] top-[35%] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-[90px]" />
          <div className="animate-float-delayed absolute left-[8%] bottom-[10%] h-[180px] w-[180px] rounded-full bg-emerald-500/10 blur-[80px]" />
        </div>
        <MotionReveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-sidebar-foreground">
              <Sparkles className="size-3.5 text-brand" /> See your real profit in under 2 minutes
            </span>
          </div>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Stop guessing. Start with the live demo.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-sidebar-foreground">
            Explore MarginMind with realistic sample data, then connect your stores or upload a CSV
            whenever you&apos;re ready. No credit card to start.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg" className="w-full sm:w-auto">
              <Link href="/dashboard"><PlayCircle className="size-4" /> Try live demo with sample data</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
              <Link href="/sign-up">Start free trial <ArrowRight className="size-4" /></Link>
            </Button>
          </div>
          <div className="mx-auto mt-8 max-w-md">
            <EmailCapture dark />
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-sidebar-muted">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><Database className="size-4 text-brand" /> Upload CSV later when ready</span>
            <span>or <Link href="/contact" className="font-medium text-white underline-offset-4 hover:underline">talk to the founder</Link></span>
          </div>
        </MotionReveal>
      </section>

      <Footer />
    </div>
  );
}
