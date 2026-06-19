import { MarketingNav } from "@/components/marketing/marketing-nav";
import { Footer } from "@/components/marketing/footer";

export function LegalPage({
  title,
  updated,
  sections,
}: {
  title: string;
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated {updated}</p>
        <div className="mt-10 space-y-10">
          {sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-semibold tracking-tight">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p, j) => (
                  <p key={j} className="text-[15px] leading-relaxed text-muted-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        <p className="mt-12 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          This document is a template provided for an MVP demonstration and does not constitute
          legal advice. Replace with counsel-reviewed terms before commercial launch.
        </p>
      </article>
      <Footer />
    </div>
  );
}
