/** Formatting helpers used across the app for consistent financial display. */

export function formatCurrency(
  value: number,
  opts: { compact?: boolean; cents?: boolean; signed?: boolean } = {}
): string {
  const { compact = false, cents = false, signed = false } = opts;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: compact ? "compact" : "standard",
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : compact ? 1 : 0,
  });
  const out = formatter.format(value);
  if (signed && value > 0) return `+${out}`;
  return out;
}

export function formatNumber(value: number, compact = false): string {
  return new Intl.NumberFormat("en-US", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1): string {
  return `${value >= 0 ? "" : ""}${value.toFixed(digits)}%`;
}

export function formatDate(date: string | Date, style: "short" | "long" = "short"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}

export function relativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(d);
}

/** Initials for avatars. */
export function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
