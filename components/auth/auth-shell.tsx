import Link from "next/link";
import { TrendingUp, ShieldCheck, Sparkles } from "lucide-react";
import { Logo } from "@/components/shared";

export function AuthShell({
  children,
  heading,
  sub,
}: {
  children: React.ReactNode;
  heading: string;
  sub: string;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex">
        <div className="absolute inset-0 grid-bg opacity-[0.07]" />
        <div className="absolute inset-0 radial-fade opacity-60" />
        <div className="relative">
          <Logo tone="light" />
        </div>
        <div className="relative space-y-6">
          <blockquote className="text-2xl font-medium leading-snug text-white">
            &ldquo;MarginMind was built because revenue is easy to measure, but true profit is often
            hidden behind shipping, duties, returns and ad spend. We help sellers see what actually
            makes money.&rdquo;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-brand font-semibold text-white">XZ</div>
            <div>
              <p className="text-sm font-medium text-white">Xuanxi Zhang</p>
              <p className="text-sm text-sidebar-muted">Founder &amp; CEO, MarginMind</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 pt-4 text-sm text-sidebar-foreground">
            <span className="flex items-center gap-2"><TrendingUp className="size-4 text-brand" /> True net profit</span>
            <span className="flex items-center gap-2"><Sparkles className="size-4 text-brand" /> AI recommendations</span>
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-brand" /> Bank-grade security</span>
          </div>
        </div>
        <div className="relative text-xs text-sidebar-muted">© {new Date().getFullYear()} MarginMind, Inc.</div>
      </div>

      {/* Form panel */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden"><Logo /></div>
          <h1 className="text-2xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{sub}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By continuing you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
