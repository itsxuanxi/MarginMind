"use client";

import * as React from "react";
import { Search, Download, ArrowUpDown } from "lucide-react";
import { PageHeader, DemoModeBanner } from "@/components/shared";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SKUS, STORES, CHANNELS, MARKETS } from "@/lib/mock-data";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import type { Sku, SkuStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

type SortKey = "revenue" | "netProfit" | "marginPct" | "shippingCost" | "adSpend";
const STATUSES: SkuStatus[] = ["Healthy", "Good", "Low Margin", "At Risk", "Losing Money"];

export default function SkuAnalysisPage() {
  const [q, setQ] = React.useState("");
  const [store, setStore] = React.useState("all");
  const [channel, setChannel] = React.useState("all");
  const [market, setMarket] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [sort, setSort] = React.useState<SortKey>("revenue");
  const [dir, setDir] = React.useState<"asc" | "desc">("desc");

  const rows = React.useMemo(() => {
    let r = SKUS.filter((s) => {
      if (store !== "all" && s.storeId !== store) return false;
      if (channel !== "all" && s.channel !== channel) return false;
      if (market !== "all" && s.market !== market) return false;
      if (status !== "all" && s.status !== status) return false;
      if (q && !`${s.productName} ${s.sku}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    r = [...r].sort((a, b) => {
      const d = a[sort] - b[sort];
      return dir === "asc" ? d : -d;
    });
    return r;
  }, [q, store, channel, market, status, sort, dir]);

  const setSorting = (key: SortKey) => {
    if (sort === key) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSort(key); setDir("desc"); }
  };

  const totals = rows.reduce(
    (a, s) => ({ revenue: a.revenue + s.revenue, net: a.net + s.netProfit, units: a.units + s.unitsSold }),
    { revenue: 0, net: 0, units: 0 }
  );

  return (
    <div className="space-y-6">
      <PageHeader title="SKU Analysis" description="Full per-product P&L across every store, channel and market.">
        <Button variant="outline" size="sm"><Download className="size-4" /> Export CSV</Button>
      </PageHeader>

      <DemoModeBanner />

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search product or SKU…" className="pl-9" />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex">
            <Select value={store} onChange={(e) => setStore(e.target.value)} size="sm" className="lg:w-40">
              <option value="all">All stores</option>
              {STORES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
            <Select value={channel} onChange={(e) => setChannel(e.target.value)} size="sm" className="lg:w-36">
              <option value="all">All channels</option>
              {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
            <Select value={market} onChange={(e) => setMarket(e.target.value)} size="sm" className="lg:w-32">
              <option value="all">All markets</option>
              {MARKETS.map((m) => <option key={m} value={m}>{m}</option>)}
            </Select>
            <Select value={status} onChange={(e) => setStatus(e.target.value)} size="sm" className="lg:w-36">
              <option value="all">All statuses</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4"><p className="text-xs text-muted-foreground">SKUs shown</p><p className="tabular mt-1 text-xl font-semibold">{rows.length}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total revenue</p><p className="tabular mt-1 text-xl font-semibold">{formatCurrency(totals.revenue)}</p></Card>
        <Card className="p-4"><p className="text-xs text-muted-foreground">Total net profit</p><p className={cn("tabular mt-1 text-xl font-semibold", totals.net >= 0 ? "text-brand-strong" : "text-red-600")}>{formatCurrency(totals.net)}</p></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table className="min-w-[1280px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="sticky left-0 bg-card">Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Market</TableHead>
                <TableHead>Channel</TableHead>
                <SortHead label="Revenue" active={sort === "revenue"} dir={dir} onClick={() => setSorting("revenue")} />
                <TableHead className="text-right">Units</TableHead>
                <TableHead className="text-right">Product</TableHead>
                <SortHead label="Shipping" active={sort === "shippingCost"} dir={dir} onClick={() => setSorting("shippingCost")} />
                <TableHead className="text-right">Customs</TableHead>
                <SortHead label="Ad Spend" active={sort === "adSpend"} dir={dir} onClick={() => setSorting("adSpend")} />
                <TableHead className="text-right">Fees</TableHead>
                <TableHead className="text-right">Returns</TableHead>
                <TableHead className="text-right">Storage</TableHead>
                <TableHead className="text-right">Gross</TableHead>
                <SortHead label="Net Profit" active={sort === "netProfit"} dir={dir} onClick={() => setSorting("netProfit")} />
                <SortHead label="Margin" active={sort === "marginPct"} dir={dir} onClick={() => setSorting("marginPct")} />
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => <SkuRow key={r.id} r={r} />)}
            </TableBody>
          </Table>
          {rows.length === 0 && (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No SKUs match your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SortHead({ label, active, dir, onClick }: { label: string; active: boolean; dir: "asc" | "desc"; onClick: () => void }) {
  return (
    <TableHead className="text-right">
      <button onClick={onClick} className={cn("inline-flex items-center gap-1 hover:text-foreground", active && "text-foreground")}>
        {label}
        <ArrowUpDown className={cn("size-3", active && (dir === "asc" ? "rotate-180" : ""))} />
      </button>
    </TableHead>
  );
}

function SkuRow({ r }: { r: Sku }) {
  const m = (v: number) => <TableCell className="tabular text-right text-muted-foreground">{formatCurrency(v)}</TableCell>;
  return (
    <TableRow>
      <TableCell className="sticky left-0 bg-card">
        <p className="whitespace-nowrap font-medium">{r.productName}</p>
        <p className="text-xs text-muted-foreground">{r.category}</p>
      </TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{r.sku}</TableCell>
      <TableCell className="whitespace-nowrap text-sm">{r.store}</TableCell>
      <TableCell className="text-sm">{r.market}</TableCell>
      <TableCell className="whitespace-nowrap text-sm">{r.channel}</TableCell>
      <TableCell className="tabular text-right font-medium">{formatCurrency(r.revenue)}</TableCell>
      <TableCell className="tabular text-right text-muted-foreground">{formatNumber(r.unitsSold)}</TableCell>
      {m(r.productCost)}
      {m(r.shippingCost)}
      {m(r.customsFees)}
      {m(r.adSpend)}
      {m(r.platformFees)}
      {m(r.returnCost)}
      {m(r.storageCost)}
      <TableCell className="tabular text-right">{formatCurrency(r.grossProfit)}</TableCell>
      <TableCell className={cn("tabular text-right font-semibold", r.netProfit >= 0 ? "text-brand-strong" : "text-red-600")}>{formatCurrency(r.netProfit)}</TableCell>
      <TableCell className={cn("tabular text-right font-medium", r.marginPct >= 0 ? "text-foreground" : "text-red-600")}>{formatPercent(r.marginPct)}</TableCell>
      <TableCell><StatusBadge status={r.status} /></TableCell>
    </TableRow>
  );
}
