"use client";

import * as React from "react";
import {
  UploadCloud,
  FileSpreadsheet,
  ShoppingCart,
  DollarSign,
  Megaphone,
  Ship,
  Globe2,
  Undo2,
  CheckCircle2,
  Clock,
  XCircle,
  Download,
  ArrowRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader, SectionHeading, DemoModeBanner } from "@/components/shared";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const DATASETS = [
  { id: "orders", label: "Orders", icon: ShoppingCart, fields: ["order_id", "date", "sku", "qty", "revenue", "market", "channel"] },
  { id: "costs", label: "Product Costs", icon: DollarSign, fields: ["sku", "unit_cost", "currency"] },
  { id: "ads", label: "Ad Spend", icon: Megaphone, fields: ["date", "sku", "platform", "spend"] },
  { id: "shipping", label: "Shipping Costs", icon: Ship, fields: ["order_id", "carrier", "shipping_cost"] },
  { id: "customs", label: "Customs Fees", icon: Globe2, fields: ["sku", "market", "duty_rate", "customs_fee"] },
  { id: "returns", label: "Returns", icon: Undo2, fields: ["order_id", "sku", "reason", "refund_amount"] },
] as const;

const HISTORY_KEY = "marginmind_uploads";

interface HistoryItem {
  id: string;
  file: string;
  dataset: string;
  rows: number;
  size: string;
  status: "Completed" | "Processing" | "Failed";
  at: string;
}

const INITIAL_HISTORY: HistoryItem[] = [
  { id: "h1", file: "shopify_orders_may.csv", dataset: "Orders", rows: 4821, size: "1.2 MB", status: "Completed", at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "h2", file: "meta_ads_q2.csv", dataset: "Ad Spend", rows: 1203, size: "284 KB", status: "Completed", at: new Date(Date.now() - 26 * 3600000).toISOString() },
  { id: "h3", file: "product_cogs.csv", dataset: "Product Costs", rows: 20, size: "3 KB", status: "Completed", at: new Date(Date.now() - 50 * 3600000).toISOString() },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Preview {
  name: string;
  size: string;
  headers: string[];
  rows: string[][];
  totalRows: number;
}

export default function UploadPage() {
  const [dataset, setDataset] = React.useState<(typeof DATASETS)[number]["id"]>("orders");
  const [drag, setDrag] = React.useState(false);
  const [preview, setPreview] = React.useState<Preview | null>(null);
  const [history, setHistory] = React.useState<HistoryItem[]>(INITIAL_HISTORY);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const activeDataset = DATASETS.find((d) => d.id === dataset)!;

  // Load persisted history on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (items: HistoryItem[]) => {
    setHistory(items);
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  };

  const parseFile = (file: File) => {
    const isCsv = file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv";
    if (!isCsv) {
      toast.error("Invalid file type — please upload a .csv file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "").trim();
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length < 2) {
        toast.error("This CSV appears to be empty — it needs a header row and at least one data row.");
        return;
      }
      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines.slice(1, 6).map((l) => l.split(",").map((c) => c.trim()));
      setPreview({
        name: file.name,
        size: formatBytes(file.size),
        headers,
        rows,
        totalRows: lines.length - 1,
      });
      toast.success(`Parsed ${file.name} — review the mapping below.`);
    };
    reader.onerror = () => toast.error("Could not read that file. Please try again.");
    reader.readAsText(file);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
    e.target.value = ""; // allow re-selecting the same file
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files?.[0];
    if (file) parseFile(file);
  };

  const runImport = () => {
    if (!preview) return;
    const item: HistoryItem = {
      id: `h${Date.now()}`,
      file: preview.name,
      dataset: activeDataset.label,
      rows: preview.totalRows,
      size: preview.size,
      status: "Processing",
      at: new Date().toISOString(),
    };
    persist([item, ...history]);
    setPreview(null);
    toast.success("Import started. We'll process it in the background.");
    setTimeout(() => {
      setHistory((prev) => {
        const next = prev.map((x) => (x.id === item.id ? { ...x, status: "Completed" as const } : x));
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
      toast.success(`${item.file} imported successfully.`);
    }, 1800);
  };

  const sampleCsv = () => {
    const headers = activeDataset.fields.join(",");
    const blob = new Blob([headers + "\n"], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marginmind_${dataset}_template.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Upload Data" description="Import orders, costs, ad spend and more via CSV. Built to plug into live integrations later.">
        <Button variant="outline" size="sm" onClick={sampleCsv}><Download className="size-4" /> Download template</Button>
      </PageHeader>

      <DemoModeBanner />

      {/* Hidden file input — kept OUTSIDE the clickable dropzone so a
          programmatic click doesn't bubble back and cancel the picker. */}
      <input ref={inputRef} type="file" accept=".csv,text/csv" className="sr-only" onChange={onPick} />

      {/* Dataset selector */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {DATASETS.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => { setDataset(d.id); setPreview(null); }}
            className={cn(
              "flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all",
              dataset === d.id ? "border-brand bg-[var(--brand-soft)]/40 shadow-sm" : "border-border bg-card hover:border-muted-foreground/30"
            )}
          >
            <span className={cn("flex size-9 items-center justify-center rounded-lg", dataset === d.id ? "bg-brand text-white" : "bg-secondary text-muted-foreground")}>
              <d.icon className="size-[18px]" />
            </span>
            <span className="text-sm font-medium">{d.label}</span>
          </button>
        ))}
      </div>

      {/* Dropzone */}
      <Card>
        <CardContent className="p-5">
          <div
            role="button"
            tabIndex={0}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inputRef.current?.click(); } }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors focus:outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/30",
              drag ? "border-brand bg-[var(--brand-soft)]/40" : "border-border hover:border-muted-foreground/40"
            )}
          >
            <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-brand-strong">
              <UploadCloud className="size-7" />
            </span>
            <p className="mt-4 font-medium">Drag &amp; drop your {activeDataset.label} CSV here</p>
            <p className="mt-1 text-sm text-muted-foreground">or click to browse — .csv files only</p>
          </div>
        </CardContent>
      </Card>

      {/* Mapping + preview */}
      {preview && (
        <Card>
          <CardHeader className="flex-row items-start justify-between space-y-0">
            <div>
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="size-5 text-brand-strong" />
                <CardTitle>{preview.name}</CardTitle>
                <Badge variant="success"><CheckCircle2 className="size-3" /> Ready to import</Badge>
              </div>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                <span>{preview.size}</span>
                <span>·</span>
                <span>{preview.totalRows.toLocaleString()} rows</span>
                <span>·</span>
                <span>{preview.headers.length} columns</span>
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setPreview(null)}><X className="size-4" /></Button>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <SectionHeading title="Column mapping" description={`Map your CSV columns to MarginMind ${activeDataset.label} fields.`} />
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {activeDataset.fields.map((field, i) => {
                  const guess = preview.headers.find((h) => h.toLowerCase().replace(/[^a-z]/g, "").includes(field.replace(/_/g, "").slice(0, 4))) || preview.headers[i] || "";
                  return (
                    <div key={field} className="rounded-lg border border-border p-2.5">
                      <p className="text-xs font-medium text-muted-foreground">{field}</p>
                      <Select size="sm" defaultValue={guess} className="mt-1.5">
                        <option value="">— Not mapped —</option>
                        {preview.headers.map((h) => <option key={h} value={h}>{h}</option>)}
                      </Select>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <SectionHeading title="Data preview" description="First 5 rows from your file." />
              <div className="mt-3 overflow-hidden rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      {preview.headers.map((h, i) => <TableHead key={`${h}-${i}`}>{h}</TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.rows.map((row, i) => (
                      <TableRow key={i}>
                        {preview.headers.map((_, j) => <TableCell key={j} className="text-sm">{row[j] ?? ""}</TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreview(null)}>Cancel</Button>
              <Button variant="brand" onClick={runImport}>Import {activeDataset.label} <ArrowRight className="size-4" /></Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History */}
      <Card>
        <CardHeader className="pb-2"><CardTitle>Upload History</CardTitle></CardHeader>
        <CardContent className="px-0 pb-2">
          {history.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">No uploads yet. Drop a CSV above to get started.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>File</TableHead>
                  <TableHead>Dataset</TableHead>
                  <TableHead className="text-right">Rows</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Uploaded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="font-medium"><span className="inline-flex items-center gap-2"><FileSpreadsheet className="size-4 text-muted-foreground" />{h.file}</span></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{h.dataset}</TableCell>
                    <TableCell className="tabular text-right">{h.rows.toLocaleString()}</TableCell>
                    <TableCell className="tabular text-right text-muted-foreground">{h.size}</TableCell>
                    <TableCell><ImportStatus status={h.status} /></TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{relativeTime(h.at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ImportStatus({ status }: { status: HistoryItem["status"] }) {
  if (status === "Completed") return <Badge variant="success"><CheckCircle2 className="size-3" /> Completed</Badge>;
  if (status === "Processing") return <Badge variant="info"><Clock className="size-3 animate-pulse" /> Processing</Badge>;
  return <Badge variant="danger"><XCircle className="size-3" /> Failed</Badge>;
}
