import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Consistent section eyebrow → title → subtitle system for the marketing site. */

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-brand/20 bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold tracking-wide text-brand-strong",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-brand" />
      {children}
    </span>
  );
}

export function SectionHead({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export function Stars({ count = 5, className }: { count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
      ))}
    </span>
  );
}

export function AvatarStack({ count = 5 }: { count?: number }) {
  const tones = [
    "from-emerald-400 to-teal-500",
    "from-sky-400 to-blue-500",
    "from-violet-400 to-purple-500",
    "from-amber-400 to-orange-500",
    "from-rose-400 to-pink-500",
  ];
  return (
    <div className="flex -space-x-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "flex size-8 items-center justify-center rounded-full bg-gradient-to-br text-[11px] font-semibold text-white ring-2 ring-background",
            tones[i % tones.length]
          )}
        >
          {String.fromCharCode(65 + i)}
        </span>
      ))}
    </div>
  );
}
