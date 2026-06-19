import * as React from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Sample-data notice shown whenever the app is in Sample Mode (no real store
 * data connected). Keeps users from confusing sample numbers with their own.
 */
export function DemoModeBanner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800",
        className
      )}
    >
      <span className="inline-flex items-center gap-2">
        <Info className="size-4 shrink-0" />
        <span className="rounded-md bg-amber-200/70 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide">
          Sample Mode
        </span>
      </span>
      <span>You&apos;re viewing sample ecommerce data.</span>
      <Link href="/upload" className="font-semibold underline underline-offset-2 hover:text-amber-900">
        Upload your store data to unlock personalized profit analysis →
      </Link>
    </div>
  );
}

export function Logo({
  className,
  withText = true,
  tone = "auto",
}: {
  className?: string;
  withText?: boolean;
  tone?: "auto" | "light" | "dark";
}) {
  const text =
    tone === "light"
      ? "text-white"
      : tone === "dark"
        ? "text-foreground"
        : "text-foreground";
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="relative flex size-8 items-center justify-center rounded-lg bg-brand shadow-sm">
        <span className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/25 to-transparent" />
        <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 18 L9 11 L13 14 L20 5" />
          <path d="M15 5 H20 V10" />
        </svg>
      </span>
      {withText && (
        <span className={cn("text-[17px] font-semibold tracking-tight", text)}>
          MarginMind
        </span>
      )}
    </Link>
  );
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel,
  icon: Icon,
  tone = "default",
  hint,
  className,
}: {
  label: string;
  value: string;
  delta?: number;
  deltaLabel?: string;
  icon?: LucideIcon;
  tone?: "default" | "positive" | "negative";
  hint?: string;
  className?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-0.5">
          <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        </div>
        {Icon && (
          <span
            className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              tone === "positive"
                ? "bg-[var(--brand-soft)] text-brand-strong"
                : tone === "negative"
                  ? "bg-red-50 text-red-600"
                  : "bg-secondary text-muted-foreground"
            )}
          >
            <Icon className="size-[18px]" />
          </span>
        )}
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="tabular text-[26px] font-semibold leading-none tracking-tight text-foreground">
          {value}
        </span>
      </div>
      {(delta !== undefined || hint) && (
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          {delta !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium tabular",
                up ? "bg-[var(--brand-soft)] text-brand-strong" : "bg-red-50 text-red-600"
              )}
            >
              {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta)}%
            </span>
          )}
          <span className="text-muted-foreground">{deltaLabel || hint}</span>
        </div>
      )}
    </Card>
  );
}

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function MoneyDelta({ value, className }: { value: number; className?: string }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "tabular font-medium",
        positive ? "text-brand-strong" : "text-red-600",
        className
      )}
    >
      {positive ? "" : "−"}
      {Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(Math.abs(value))}
    </span>
  );
}
