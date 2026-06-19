import { Eyebrow } from "./section";
import { FounderAvatar } from "./founder-avatar";

export function FounderStory() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        {/* Portrait / profile card */}
        <div className="lg:col-span-4">
          <div className="mx-auto max-w-xs overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="relative aspect-[4/5] bg-sidebar">
              <div className="absolute inset-0 grid-bg opacity-[0.06]" />
              <FounderAvatar className="size-full" />
            </div>
            <div className="p-5">
              <p className="text-base font-semibold tracking-tight">Xuanxi Zhang</p>
              <p className="text-sm text-muted-foreground">Founder &amp; CEO, MarginMind</p>
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="flex size-5 items-center justify-center rounded bg-brand text-[10px] font-bold text-white">M</span>
                Building the financial OS for cross-border commerce
              </div>
            </div>
          </div>
        </div>

        {/* Letter */}
        <div className="lg:col-span-8">
          <Eyebrow>A note from our founder</Eyebrow>
          <blockquote className="mt-5 space-y-4 text-lg leading-relaxed text-foreground/90">
            <p>
              &ldquo;I spent years studying how businesses grow — but one thing kept surprising me:
              most companies couldn&apos;t answer a deceptively simple question.{" "}
              <span className="font-semibold text-foreground">Which products actually make money?</span>
            </p>
            <p>
              Founders obsess over revenue because it&apos;s the number everyone celebrates. But
              revenue is vanity. After shipping, customs, returns, platform fees and ad spend, the
              product that looks like a hero is often the one quietly draining the bank account —
              and no dashboard tells you until the quarter is already over.
            </p>
            <p>
              Existing analytics show what sold. They don&apos;t show what was{" "}
              <span className="font-semibold text-foreground">profitable</span>. For cross-border
              sellers — juggling duties across five markets and fees across four channels — that gap
              is where the business silently bleeds.
            </p>
            <p>
              We built MarginMind to close it: true profit on every SKU, the leaks called out
              automatically, and an AI agent that tells you exactly what to do next. So no founder
              ever again has to fly blind on the one number that actually matters.&rdquo;
            </p>
          </blockquote>
          <div className="mt-7 flex items-center gap-4">
            <FounderAvatar className="size-12 rounded-full" monogramClassName="text-sm" />
            <div>
              <p className="text-sm font-semibold">Xuanxi Zhang</p>
              <p className="text-sm text-muted-foreground">Founder &amp; CEO, MarginMind</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
