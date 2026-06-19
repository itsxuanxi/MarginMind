import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: "sm" | "default";
}

/** Lightweight native select styled to match the design system. */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, size = "default", ...props }, ref) => (
    <div className="relative inline-flex w-full items-center">
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none rounded-lg border border-input bg-card pl-3 pr-9 text-sm font-medium text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
          size === "sm" ? "h-9" : "h-10",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
    </div>
  )
);
Select.displayName = "Select";

export { Select };
