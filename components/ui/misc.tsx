import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

export function Separator({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
    />
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} />;
}

export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}>
      <div
        className={cn("h-full rounded-full bg-brand transition-all", indicatorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function Avatar({
  name,
  src,
  className,
}: {
  name: string;
  src?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-xs font-semibold text-primary-foreground",
        className
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  );
}

export function Switch({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange?: (v: boolean) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
        checked ? "bg-brand" : "bg-secondary",
        className
      )}
    >
      <span
        className={cn(
          "inline-block size-5 transform rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}
