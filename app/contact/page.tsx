import type { Metadata } from "next";
import { Building2, Mail, Clock, ShieldCheck } from "lucide-react";
import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Footer } from "@/components/marketing/footer";
import { ContactForm } from "@/components/marketing/contact-form";

export const metadata: Metadata = {
  title: "Contact Sales",
  description: "Talk to the MarginMind team about Enterprise plans and custom integrations.",
};

const POINTS = [
  { icon: Building2, title: "Built for scale", body: "Unlimited stores, custom data pipelines and white-glove onboarding." },
  { icon: ShieldCheck, title: "Enterprise security", body: "SSO, row-level isolation and custom SLAs for serious operators." },
  { icon: Clock, title: "Fast response", body: "We reply within one business day — usually much faster." },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
            <Mail className="size-4" /> Contact Sales
          </span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">
            Let&apos;s talk about your margins
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Tell us about your business and we&apos;ll show you exactly how MarginMind can
            recover hidden profit across your channels and markets.
          </p>
          <div className="mt-8 space-y-5">
            {POINTS.map((p) => (
              <div key={p.title} className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-soft)] text-brand-strong">
                  <p.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            Prefer email? Reach us at{" "}
            <a href="mailto:sales@marginmind.io" className="font-medium text-brand">
              sales@marginmind.io
            </a>
          </p>
        </div>
        <ContactForm />
      </section>
      <Footer />
    </div>
  );
}
