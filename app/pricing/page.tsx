import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Footer } from "@/components/marketing/footer";
import { PricingPlans } from "@/components/landing/pricing-plans";
import { FAQ } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for ecommerce brands. 14-day free trial.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-[0.35]" />
        <div className="absolute inset-0 radial-fade" />
        <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Pricing that scales with your margin
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Every plan includes a 14-day free trial. Founding customers lock in their price for life.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <PricingPlans />
      </section>

      <section className="border-t border-border bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-semibold tracking-tight">Pricing questions</h2>
          <div className="mt-10">
            <FAQ />
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
