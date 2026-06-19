"use client";

import * as React from "react";
import { Download, ChevronDown, FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaywallModal } from "@/components/paywall-modal";
import { downloadCsv, downloadPdf } from "@/lib/export-client";

/**
 * Production export control. The free/paid limit is enforced server-side by
 * /api/export — the client only formats the authoritative report it returns.
 */
export function ExportMenu({
  size = "sm",
  variant = "outline",
  align = "right",
}: {
  size?: "sm" | "default";
  variant?: "outline" | "brand";
  align?: "left" | "right";
}) {
  const [open, setOpen] = React.useState(false);
  const [busy, setBusy] = React.useState<null | "csv" | "pdf">(null);
  const [paywall, setPaywall] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const run = async (format: "csv" | "pdf") => {
    if (busy) return;
    setOpen(false);
    setBusy(format);
    const tid = toast.loading(`Generating ${format.toUpperCase()} report…`);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ format }),
      });

      if (res.status === 402) {
        toast.dismiss(tid);
        setPaywall(true);
        return;
      }
      if (!res.ok) throw new Error("export failed");

      const data = await res.json();
      if (!data.allowed || !data.report) throw new Error("no report");

      if (format === "csv") downloadCsv(data.report);
      else await downloadPdf(data.report);

      toast.success("Report exported successfully.", { id: tid });
    } catch {
      toast.error("Unable to generate report. Please try again.", { id: tid });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <div className="relative" ref={ref}>
        <Button
          variant={variant}
          size={size}
          onClick={() => setOpen((v) => !v)}
          disabled={!!busy}
          aria-haspopup="menu"
          aria-expanded={open}
        >
          {busy ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
          Export
          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        </Button>

        {open && (
          <div
            role="menu"
            className={cn(
              "absolute top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-border bg-popover p-1.5 shadow-xl animate-fade-up",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            <button
              role="menuitem"
              onClick={() => run("csv")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <FileSpreadsheet className="size-4 text-brand-strong" />
              <span>
                <span className="block font-medium">Export CSV</span>
                <span className="block text-xs text-muted-foreground">Full data tables</span>
              </span>
            </button>
            <button
              role="menuitem"
              onClick={() => run("pdf")}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <FileText className="size-4 text-brand-strong" />
              <span>
                <span className="block font-medium">Export PDF</span>
                <span className="block text-xs text-muted-foreground">Executive summary</span>
              </span>
            </button>
          </div>
        )}
      </div>

      <PaywallModal open={paywall} onOpenChange={setPaywall} variant="export" />
    </>
  );
}
