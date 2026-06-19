import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { SkuStatus, Severity } from "@/lib/types";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        success: "border-transparent bg-[var(--brand-soft)] text-brand-strong",
        warning: "border-transparent bg-amber-50 text-amber-700",
        danger: "border-transparent bg-red-50 text-red-700",
        info: "border-transparent bg-blue-50 text-blue-700",
        purple: "border-transparent bg-violet-50 text-violet-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

const STATUS_VARIANT: Record<SkuStatus, BadgeProps["variant"]> = {
  Healthy: "success",
  Good: "info",
  "Low Margin": "warning",
  "At Risk": "warning",
  "Losing Money": "danger",
};

const STATUS_DOT: Record<SkuStatus, string> = {
  Healthy: "bg-brand",
  Good: "bg-blue-500",
  "Low Margin": "bg-amber-500",
  "At Risk": "bg-orange-500",
  "Losing Money": "bg-red-500",
};

export function StatusBadge({ status }: { status: SkuStatus }) {
  return (
    <Badge variant={STATUS_VARIANT[status]} className="font-medium">
      <span className={cn("size-1.5 rounded-full", STATUS_DOT[status])} />
      {status}
    </Badge>
  );
}

const SEVERITY_VARIANT: Record<Severity, BadgeProps["variant"]> = {
  Critical: "danger",
  High: "warning",
  Medium: "info",
  Low: "default",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge variant={SEVERITY_VARIANT[severity]}>{severity}</Badge>;
}

export { Badge, badgeVariants };
