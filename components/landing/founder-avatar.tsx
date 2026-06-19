"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Founder photo with a graceful monogram fallback. Renders /founder.jpg
 * when present; otherwise an elegant gradient "XZ" monogram so the
 * section always looks intentional.
 */
export function FounderAvatar({
  src = "/founder.jpg",
  alt = "Xuanxi Zhang",
  monogram = "XZ",
  className,
  monogramClassName,
}: {
  src?: string;
  alt?: string;
  monogram?: string;
  className?: string;
  monogramClassName?: string;
}) {
  const [failed, setFailed] = React.useState(false);
  const ref = React.useRef<HTMLImageElement>(null);

  // Catch images that 404 before React attaches the onError handler
  // (SSR hydration race) so the monogram fallback always shows.
  React.useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-brand to-emerald-500 font-semibold text-white",
          className,
          monogramClassName
        )}
      >
        {monogram}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
