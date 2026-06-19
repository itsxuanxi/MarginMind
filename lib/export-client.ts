import type { ReportData } from "./report";

/* Browser-only export helpers. Imported by the client ExportMenu. */

const money = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
const pct = (n: number) => `${n.toFixed(1)}%`;
const dateStr = (iso: string) => iso.slice(0, 10);

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(v: string | number): string {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function row(cells: (string | number)[]): string {
  return cells.map(csvCell).join(",");
}

export function downloadCsv(report: ReportData) {
  const d = dateStr(report.generatedAt);
  const s = report.summary;
  const lines: string[] = [];

  lines.push(row(["MarginMind Profit Report", d]));
  lines.push("");
  lines.push(row(["Metric", "Value"]));
  lines.push(row(["Revenue", money(s.revenue)]));
  lines.push(row(["Gross Profit", money(s.grossProfit)]));
  lines.push(row(["Net Profit", money(s.netProfit)]));
  lines.push(row(["Contribution Margin", money(s.contributionMargin)]));
  lines.push(row(["Average Margin", pct(s.avgMargin)]));
  lines.push(row(["Ad Spend", money(s.adSpend)]));
  lines.push(row(["Shipping Cost", money(s.shippingCost)]));
  lines.push(row(["Customs Fees", money(s.customsFees)]));
  lines.push(row(["Return Cost", money(s.returnCost)]));
  lines.push(row(["Storage Cost", money(s.storageCost)]));
  lines.push(row(["Profit Leakage", money(s.profitLeakage)]));
  lines.push("");

  lines.push(row(["SKU Analysis"]));
  lines.push(
    row(["SKU", "Product", "Store", "Market", "Channel", "Revenue", "Units", "Ad Spend", "Shipping", "Customs", "Returns", "Net Profit", "Margin %", "Status"])
  );
  for (const k of report.skus) {
    lines.push(
      row([k.sku, k.name, k.store, k.market, k.channel, k.revenue, k.units, k.adSpend, k.shippingCost, k.customsFees, k.returnCost, k.netProfit, k.marginPct.toFixed(1), k.status])
    );
  }
  lines.push("");

  lines.push(row(["Profit Leaks"]));
  lines.push(row(["SKU", "Type", "Severity", "Monthly Loss", "Suggested Action"]));
  for (const l of report.leaks) {
    lines.push(row([l.sku, l.type, l.severity, l.monthlyLoss, l.action]));
  }
  lines.push("");

  lines.push(row(["Market Performance"]));
  lines.push(row(["Market", "Revenue", "Net Profit", "Margin %"]));
  for (const m of report.markets) {
    lines.push(row([m.market, m.revenue, m.netProfit, m.margin.toFixed(1)]));
  }

  const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, `marginmind-report-${d}.csv`);
}

export async function downloadPdf(report: ReportData) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;
  const d = dateStr(report.generatedAt);
  const s = report.summary;

  const INK: [number, number, number] = [16, 19, 25];
  const MUTED: [number, number, number] = [105, 116, 134];
  const BRAND: [number, number, number] = [15, 157, 110];
  const LINE: [number, number, number] = [229, 232, 238];

  // ---- Header ----
  doc.setFillColor(...BRAND);
  doc.roundedRect(M, 44, 26, 26, 6, 6, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("M", M + 8, 63);
  doc.setTextColor(...INK);
  doc.setFontSize(16);
  doc.text("MarginMind", M + 38, 56);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(9.5);
  doc.text("AI Profit Agent for Cross-Border E-commerce", M + 38, 68);
  doc.setFontSize(9.5);
  doc.text(`Generated ${d}`, W - M, 56, { align: "right" });
  doc.text("Confidential", W - M, 68, { align: "right" });

  doc.setDrawColor(...LINE);
  doc.line(M, 84, W - M, 84);

  // ---- Title ----
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Executive Profit Report", M, 118);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(10.5);
  doc.text("Monthly profitability summary across every product, market and channel.", M, 136);

  // ---- KPI grid (2 x 2) ----
  const kpis = [
    { label: "Revenue", value: money(s.revenue) },
    { label: "Net Profit", value: money(s.netProfit) },
    { label: "Average Margin", value: pct(s.avgMargin) },
    { label: "Profit Leakage", value: money(s.profitLeakage), danger: true },
  ];
  const gap = 14;
  const cardW = (W - M * 2 - gap) / 2;
  const cardH = 64;
  let ky = 156;
  kpis.forEach((k, i) => {
    const col = i % 2;
    const rowi = Math.floor(i / 2);
    const x = M + col * (cardW + gap);
    const y = ky + rowi * (cardH + gap);
    doc.setDrawColor(...LINE);
    doc.setFillColor(250, 251, 252);
    doc.roundedRect(x, y, cardW, cardH, 8, 8, "FD");
    doc.setTextColor(...MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(k.label.toUpperCase(), x + 16, y + 24);
    doc.setTextColor(...(k.danger ? ([220, 43, 58] as [number, number, number]) : INK));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(k.value, x + 16, y + 48);
  });

  let y = ky + 2 * cardH + gap + 28;

  // ---- Best / Worst ----
  const sectionTitle = (t: string, yy: number) => {
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text(t, M, yy);
  };
  sectionTitle("Top & Bottom Performers", y);
  y += 18;
  doc.setFontSize(10.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BRAND);
  doc.text(`Best SKU  ·  ${report.best.sku}  ${report.best.name}`, M, y);
  doc.setTextColor(...MUTED);
  doc.text(`${money(report.best.netProfit)}/mo  ·  ${pct(report.best.margin)} margin`, W - M, y, { align: "right" });
  y += 16;
  doc.setTextColor(220, 43, 58);
  doc.text(`Worst SKU  ·  ${report.worst.sku}  ${report.worst.name}`, M, y);
  doc.setTextColor(...MUTED);
  doc.text(`${money(report.worst.netProfit)}/mo  ·  ${pct(report.worst.margin)} margin`, W - M, y, { align: "right" });

  y += 34;
  doc.setDrawColor(...LINE);
  doc.line(M, y - 14, W - M, y - 14);

  // ---- AI Recommendations ----
  sectionTitle("AI Profit Recommendations", y);
  y += 20;
  doc.setFontSize(10);
  report.recommendations.slice(0, 5).forEach((r, i) => {
    doc.setFillColor(...BRAND);
    doc.circle(M + 3, y - 3, 2.2, "F");
    doc.setTextColor(...INK);
    doc.setFont("helvetica", "bold");
    const title = doc.splitTextToSize(`${r.title}`, W - M * 2 - 130)[0];
    doc.text(title, M + 14, y);
    doc.setTextColor(...BRAND);
    doc.setFont("helvetica", "normal");
    doc.text(`+${money(r.monthlyImpact)}/mo · ${r.confidence}%`, W - M, y, { align: "right" });
    y += 20;
    if (y > 770) return;
  });

  // ---- Footer ----
  doc.setDrawColor(...LINE);
  doc.line(M, 800, W - M, 800);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.setFontSize(8.5);
  doc.text("Generated by MarginMind · marginmind.io", M, 814);
  doc.text("Figures based on connected / sample ecommerce data.", W - M, 814, { align: "right" });

  doc.save(`marginmind-executive-report-${d}.pdf`);
}
