import { MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Early-access / beta feedback. Intentionally avoids implying real paying
 * customers, revenue figures, or named brands. Quotes are paraphrased
 * feedback from early testers exploring the product with sample data.
 */

const FEEDBACK = [
  {
    quote:
      "I connected our numbers and immediately saw two 'bestsellers' that were actually losing money once returns and fees were counted. That alone justified a closer look.",
    who: "Early-access operator",
    context: "Shopify + Amazon seller",
    tone: "from-emerald-400 to-teal-500",
    initials: "EA",
  },
  {
    quote:
      "The per-market margin view is the thing I've wanted for years. Customs and duties were always a black box for our EU orders.",
    who: "Early tester",
    context: "Cross-border DTC brand",
    tone: "from-sky-400 to-blue-500",
    initials: "ET",
  },
  {
    quote:
      "Exploring the demo, the AI agent flagged the kind of ad-waste I'd normally only catch at month-end. Genuinely useful framing.",
    who: "Beta participant",
    context: "TikTok Shop seller",
    tone: "from-violet-400 to-purple-500",
    initials: "BP",
  },
];

export function Testimonials() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-5 lg:grid-cols-3">
        {FEEDBACK.map((f) => (
          <figure key={f.context} className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
              <MessageSquareQuote className="size-5 text-brand" />
              <blockquote className="mt-3 text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{f.quote}&rdquo;
              </blockquote>
            </div>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              <span className={cn("flex size-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white", f.tone)}>
                {f.initials}
              </span>
              <div>
                <p className="text-sm font-semibold">{f.who}</p>
                <p className="text-xs text-muted-foreground">{f.context}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Paraphrased early-access feedback. MarginMind is onboarding its first founding customers —
        outcomes shown elsewhere on this page are illustrative, based on sample data.
      </p>
    </div>
  );
}
