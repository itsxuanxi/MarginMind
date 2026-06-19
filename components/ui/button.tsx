import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Minimal Slot: when `asChild` is used, merge the button's props onto the
 * single child element instead of rendering a <button>. Avoids invalid
 * markup like <button><a/></button> and keeps semantics correct.
 */
const Slot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<any>;
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      className: cn((props as any).className, child.props.className),
      ref,
    });
  }
);
Slot.displayName = "Slot";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.985]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        brand:
          "bg-brand text-white shadow-sm hover:bg-brand-strong",
        outline:
          "border border-border bg-card text-foreground shadow-sm hover:bg-accent",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-foreground hover:bg-accent",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-lg px-3 text-[13px]",
        lg: "h-11 rounded-lg px-6 text-[15px]",
        icon: "h-10 w-10",
        xs: "h-8 rounded-md px-2.5 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
