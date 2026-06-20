import { NextResponse } from "next/server";
import { features } from "@/lib/config";
import { ensureWorkspaceUserId } from "@/lib/workspace";
import { netProfit, grossProfit, contributionMargin, marginPct, classifyStatus } from "@/lib/profit";

export const runtime = "nodejs";

/* ---------- CSV parsing ---------- */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQ) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') inQ = false;
        else cur += ch;
      } else if (ch === '"') inQ = true;
      else if (ch === ",") { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur);
    rows.push(cells.map((c) => c.trim()));
  }
  return rows;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const num = (v: string | undefined) => {
  if (!v) return 0;
  const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

// Canonical field → accepted header aliases (normalized).
const FIELD_ALIASES: Record<string, string[]> = {
  sku: ["sku", "productid", "itemid", "variantsku", "variantid", "id"],
  product_name: ["productname", "product", "name", "title", "item", "description"],
  units: ["units", "unitssold", "quantity", "qty", "unitsold"],
  revenue: ["revenue", "sales", "grosssales", "totalsales", "netsales", "amount", "total", "grossrevenue"],
  product_cost: ["productcost", "cogs", "costofgoods", "unitcost", "cost", "landedcost"],
  shipping_cost: ["shipping", "shippingcost", "shippingcosts", "freight", "fulfillment"],
  customs_fees: ["customs", "customsfees", "duty", "duties", "tariff", "import"],
  ad_spend: ["adspend", "ads", "advertising", "marketing", "spend", "adcost"],
  platform_fees: ["platformfees", "fees", "marketplacefees", "referralfee", "commission", "processingfees"],
  return_cost: ["returncost", "returns", "refunds", "refundamount", "refund"],
  storage_cost: ["storage", "storagecost", "warehousing", "warehouse"],
  market: ["market", "country", "region", "destination", "geo"],
  channel: ["channel", "platform", "saleschannel", "source"],
  store: ["store", "shop", "storename", "brand"],
};

function detectColumns(headers: string[]): Record<string, number> {
  const normed = headers.map(norm);
  const map: Record<string, number> = {};
  for (const [field, aliases] of Object.entries(FIELD_ALIASES)) {
    const idx = normed.findIndex((h) => aliases.includes(h));
    if (idx >= 0) map[field] = idx;
  }
  // looser contains-match fallback for sku / revenue / cost
  for (const field of ["sku", "revenue", "product_cost"]) {
    if (map[field] === undefined) {
      const idx = normed.findIndex((h) => FIELD_ALIASES[field].some((a) => h.includes(a)));
      if (idx >= 0) map[field] = idx;
    }
  }
  return map;
}

export async function POST(req: Request) {
  if (!features.supabase) {
    return NextResponse.json(
      { error: "Connect a Supabase database to import real data." },
      { status: 503 }
    );
  }

  let payload: { dataset?: string; fileName?: string; fileSize?: number; csv?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const csv = (payload.csv || "").trim();
  const dataset = payload.dataset || "products";
  const fileName = payload.fileName || "upload.csv";

  // ---- Validation ----
  if (!csv) return NextResponse.json({ error: "The CSV file is empty." }, { status: 400 });
  const rows = parseCsv(csv);
  if (rows.length < 2) {
    return NextResponse.json({ error: "The CSV needs a header row and at least one data row." }, { status: 400 });
  }
  const headers = rows[0];
  const cols = detectColumns(headers);
  if (cols.sku === undefined || cols.revenue === undefined) {
    return NextResponse.json(
      { error: "Couldn't find required columns. Include at least an SKU/product identifier and a Revenue/Sales column." },
      { status: 422 }
    );
  }

  const userId = await ensureWorkspaceUserId();
  if (!userId) {
    return NextResponse.json({ error: "Could not resolve your workspace." }, { status: 500 });
  }

  const { getSupabaseAdmin } = await import("@/lib/supabase");
  const supabase = await getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database unavailable." }, { status: 503 });

  // ---- Record the upload ----
  const { data: report, error: repErr } = await supabase
    .from("uploaded_reports")
    .insert({
      user_id: userId,
      dataset,
      source: "csv",
      file_name: fileName,
      file_size_bytes: payload.fileSize || csv.length,
      row_count: rows.length - 1,
      status: "processing",
    })
    .select("id")
    .single();
  if (repErr || !report) {
    return NextResponse.json({ error: "Could not start the import. Check your database schema is installed." }, { status: 500 });
  }

  try {
    const get = (row: string[], field: string) => (cols[field] !== undefined ? row[cols[field]] : undefined);
    const records = [];
    for (const row of rows.slice(1)) {
      const sku = (get(row, "sku") || "").trim();
      if (!sku) continue;
      const costs = {
        revenue: num(get(row, "revenue")),
        unitsSold: Math.max(0, Math.round(num(get(row, "units")))),
        productCost: num(get(row, "product_cost")),
        shippingCost: num(get(row, "shipping_cost")),
        customsFees: num(get(row, "customs_fees")),
        adSpend: num(get(row, "ad_spend")),
        platformFees: num(get(row, "platform_fees")),
        returnCost: num(get(row, "return_cost")),
        storageCost: num(get(row, "storage_cost")),
      };
      records.push({
        user_id: userId,
        upload_id: report.id,
        source: "csv",
        sku,
        product_name: (get(row, "product_name") || sku).trim(),
        store: (get(row, "store") || "").trim() || null,
        market: (get(row, "market") || "").trim() || null,
        channel: (get(row, "channel") || "").trim() || null,
        units: costs.unitsSold,
        revenue: costs.revenue,
        product_cost: costs.productCost,
        shipping_cost: costs.shippingCost,
        customs_fees: costs.customsFees,
        ad_spend: costs.adSpend,
        platform_fees: costs.platformFees,
        return_cost: costs.returnCost,
        storage_cost: costs.storageCost,
        gross_profit: grossProfit(costs),
        contribution_margin: contributionMargin(costs),
        net_profit: netProfit(costs),
        margin_pct: Number(marginPct(costs).toFixed(2)),
        status: classifyStatus(costs),
      });
    }

    if (records.length === 0) {
      await supabase.from("uploaded_reports").update({ status: "failed", error: "No valid rows found." }).eq("id", report.id);
      return NextResponse.json({ error: "No valid rows found (every row was missing an SKU)." }, { status: 422 });
    }

    // Replace prior CSV data so the dashboard reflects the latest upload.
    await supabase.from("profit_metrics").delete().eq("user_id", userId).eq("source", "csv");
    const { error: insErr } = await supabase.from("profit_metrics").insert(records);
    if (insErr) throw insErr;

    await supabase.from("uploaded_reports").update({ status: "completed", imported_rows: records.length }).eq("id", report.id);
    await supabase.from("users").update({ data_source: "csv" }).eq("id", userId);

    return NextResponse.json({ ok: true, imported: records.length, dataset, dataMode: "real" });
  } catch (err) {
    console.error("ingestion error:", err);
    await supabase.from("uploaded_reports").update({ status: "failed", error: String(err) }).eq("id", report.id);
    return NextResponse.json({ error: "Import failed while saving rows. Please check the file and try again." }, { status: 500 });
  }
}
