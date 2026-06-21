import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock, Flame, PlayCircle } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Footer } from "@/components/marketing/footer";
import { FAQ } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { MotionReveal } from "@/components/landing/motion";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { ProblemReveal } from "@/components/landing/problem-reveal";
import { DynamicExperience } from "@/components/landing/dynamic-experience";
import { SectionHead } from "@/components/landing/section";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Announcement bar */}
      <Link
        href="/pricing"
        className="group flex items-center justify-center gap-2 bg-sidebar px-4 py-2.5 text-center text-sm text-sidebar-foreground transition-colors hover:text-white"
      >
        <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-semibold text-white">Founding offer</span>
        <span>Only 50 founding spots — lock in $9.99 CAD/mo for life</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <MarketingNav />

      {/* ============ 1 · HERO ============ */}
      <Hero />

      {/* ============ 2 · THE HIDDEN PROBLEM ============ */}
      <ProblemReveal />

      {/* ============ 3 · DYNAMIC PRODUCT EXPERIENCE ============ */}
      <section id="features">
        <DynamicExperience />
      </section>

      {/* ============ 4 · ROI CALCULATOR ============ */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <MotionReveal>
            <SectionHead
              eyebrow="ROI calculator"
              title="How much profit are you leaving on the table?"
              description="Estimate what surfacing hidden costs could recover."
            />
          </MotionReveal>
          <MotionReveal delay={120} className="mt-12 block">
            <RoiCalculator />
          </MotionReveal>
        </div>
      </section>

      {/* ============ 5 · PRICING ============ */}
      <section id="pricing" className="border-y border-border bg-card py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionReveal>
            <SectionHead
              eyebrow="Pricing"
              title="Lock in founding pricing"
              description="Two simple plans. Start with a 14-day free trial — cancel anytime."
            />
          </MotionReveal>
          <MotionReveal delay={80} className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-semibold text-amber-800">
              <Flame className="size-4" /> Only 50 founding spots available
            </span>
          </MotionReveal>
          <MotionReveal delay={140} className="mt-10 block">
            <PricingPlans />
          </MotionReveal>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> 14-day free trial</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="size-4 text-brand" /> Cancel anytime</span>
            <span className="flex items-center gap-1.5"><Lock className="size-4 text-brand" /> Encrypted &amp; private</span>
          </div>
        </div>
      </section>

      {/* ============ 6 · FAQ ============ */}
      <section id="faq" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <MotionReveal>
            <SectionHead
              eyebrow="FAQ"
              title="Frequently asked questions"
              description="Everything you need to know before you start."
            />
          </MotionReveal>
          <MotionReveal delay={120} className="mt-12 block">
            <FAQ />
          </MotionReveal>
        </div>
      </section>

      {/* ============ 7 · FINAL CTA ============ */}
      <section className="relative overflow-hidden bg-sidebar py-28">
        <div className="absolute inset-0 grid-bg opacity-[0.06]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-aurora absolute left-1/2 top-[-25%] h-[460px] w-[860px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(15,157,110,0.35),transparent)] blur-[110px]" />
          <div className="animate-float-slow absolute right-[6%] top-[35%] h-[220px] w-[220px] rounded-full bg-emerald-400/10 blur-[90px]" />
        </div>
        <MotionReveal className="relative mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Find Hidden Profit Before It Disappears.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-sidebar-foreground">
            See where your margins are leaking and what to do next.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="brand" size="lg" className="w-full transition-transform hover:scale-[1.03] sm:w-auto">
              <Link href="/sign-up">Start Free Trial <ArrowRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
              <Link href="/dashboard"><PlayCircle className="size-4" /> Explore Live Demo</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm text-sidebar-muted">No credit card required · 14-day free trial</p>
        </MotionReveal>
      </section>

      <Footer />
    </div>
  );
}
