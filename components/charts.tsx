"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { TrendPoint } from "@/lib/types";

const AXIS = { stroke: "transparent", tickLine: false, axisLine: false } as const;
const GRID = "var(--border)";

function money(v: number) {
  return formatCurrency(v, { compact: true });
}

interface TipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  pct?: boolean;
}
function MoneyTooltip({ active, payload, label, pct }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      {label && <div className="mb-1 font-semibold text-foreground">{label}</div>}
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="size-2 rounded-full" style={{ background: p.color || p.fill }} />
              {p.name}
            </span>
            <span className="tabular font-medium text-foreground">
              {pct ? `${Number(p.value).toFixed(1)}%` : formatCurrency(Number(p.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RevenueProfitChart({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="month" {...AXIS} fontSize={11} />
        <YAxis {...AXIS} tickFormatter={money} fontSize={11} width={64} />
        <Tooltip content={<MoneyTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
        <Bar dataKey="revenue" name="Revenue" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={28} fillOpacity={0.85} />
        <Line dataKey="netProfit" name="Net Profit" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} type="monotone" />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export function NetProfitTrend({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="np" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="month" {...AXIS} fontSize={11} />
        <YAxis {...AXIS} tickFormatter={money} fontSize={11} width={64} />
        <Tooltip content={<MoneyTooltip />} />
        <Area dataKey="netProfit" name="Net Profit" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#np)" type="monotone" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MarginTrend({ data }: { data: TrendPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ left: -20, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="mg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-4)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--chart-4)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="month" {...AXIS} fontSize={11} />
        <YAxis {...AXIS} tickFormatter={(v) => `${v}%`} fontSize={11} width={44} domain={["dataMin - 2", "dataMax + 2"]} />
        <Tooltip content={<MoneyTooltip pct />} />
        <Area dataKey="margin" name="Net Margin" stroke="var(--chart-4)" strokeWidth={2.5} fill="url(#mg)" type="monotone" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function CostBreakdownDonut({ data }: { data: { name: string; value: number }[] }) {
  const colors = [
    "var(--chart-2)", "var(--chart-5)", "var(--chart-4)",
    "var(--chart-3)", "var(--chart-6)", "var(--chart-1)", "var(--muted-foreground)",
  ];
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={62} outerRadius={96} paddingAngle={2} strokeWidth={2} stroke="var(--card)">
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<MoneyTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function PerformanceBars({
  data,
  nameKey,
  height = 260,
}: {
  data: any[];
  nameKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
        <CartesianGrid horizontal={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis type="number" {...AXIS} tickFormatter={money} fontSize={11} />
        <YAxis type="category" dataKey={nameKey} {...AXIS} fontSize={11} width={92} />
        <Tooltip content={<MoneyTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
        <Bar dataKey="revenue" name="Revenue" fill="var(--chart-2)" radius={[0, 4, 4, 0]} maxBarSize={18} fillOpacity={0.85} />
        <Bar dataKey="netProfit" name="Net Profit" fill="var(--chart-1)" radius={[0, 4, 4, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function MiniSparkline({ data, color = "var(--chart-1)" }: { data: number[]; color?: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={40}>
      <AreaChart data={d} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
        <defs>
          <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.3} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area dataKey="v" stroke={color} strokeWidth={1.8} fill={`url(#spark-${color})`} type="monotone" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SignupBars({ data }: { data: { week: string; signups: number; paid: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: -18, right: 8, top: 8 }}>
        <CartesianGrid vertical={false} stroke={GRID} strokeDasharray="3 3" />
        <XAxis dataKey="week" {...AXIS} fontSize={11} />
        <YAxis {...AXIS} fontSize={11} width={36} tickFormatter={(v) => formatNumber(v, true)} />
        <Tooltip cursor={{ fill: "var(--muted)", opacity: 0.5 }} />
        <Bar dataKey="signups" name="Signups" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={26} fillOpacity={0.85} />
        <Bar dataKey="paid" name="Paid" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={26} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PlanDonut({ data }: { data: { plan: string; mrr: number; color: string }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="mrr" nameKey="plan" innerRadius={58} outerRadius={92} paddingAngle={2} strokeWidth={2} stroke="var(--card)">
          {data.map((d, i) => (
            <Cell key={i} fill={d.color} />
          ))}
        </Pie>
        <Tooltip content={<MoneyTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
