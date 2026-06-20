import { features } from "./config";
import { getWorkspaceUserId } from "./workspace";
import { deriveSku } from "./profit";
import { SKUS as SAMPLE_SKUS, TREND as SAMPLE_TREND } from "./mock-data";
import type { Sku, TrendPoint, Market, Channel } from "./types";

/**
 * The single source of truth for dashboard data.
 * Returns the customer's REAL uploaded data when it exists, otherwise the
 * labeled sample dataset. `dataMode` drives the Sample-Mode banner so users
 * never confuse sample numbers with their own.
 */
export interface ProfitDataset {
  dataMode: "sample" | "real";
  skus: Sku[];
  trend: TrendPoint[];
  rowCount: number;
}

function mapRowToSku(r: any): Sku {
  return deriveSku({
    id: r.id,
    productName: r.product_name || r.sku,
    sku: r.sku,
    category: r.category || "—",
    storeId: r.upload_id || "",
    store: r.store || "—",
    market: (r.market || "US") as Market,
    channel: (r.channel || "Shopify") as Channel,
    revenue: Number(r.revenue) || 0,
    unitsSold: Number(r.units) || 0,
    productCost: Number(r.product_cost) || 0,
    shippingCost: Number(r.shipping_cost) || 0,
    customsFees: Number(r.customs_fees) || 0,
    adSpend: Number(r.ad_spend) || 0,
    platformFees: Number(r.platform_fees) || 0,
    returnCost: Number(r.return_cost) || 0,
    storageCost: Number(r.storage_cost) || 0,
    returns: 0,
    returnRate: 0,
  });
}

export async function getProfitDataset(): Promise<ProfitDataset> {
  if (features.supabase) {
    try {
      const userId = await getWorkspaceUserId();
      if (userId) {
        const { getSupabaseAdmin } = await import("./supabase");
        const supabase = await getSupabaseAdmin();
        if (supabase) {
          const { data } = await supabase
            .from("profit_metrics")
            .select("*")
            .eq("user_id", userId)
            .limit(5000);
          if (data && data.length > 0) {
            return {
              dataMode: "real",
              skus: data.map(mapRowToSku),
              trend: [], // historical trend builds up as more periods are uploaded
              rowCount: data.length,
            };
          }
        }
      }
    } catch {
      /* fall back to sample */
    }
  }

  return {
    dataMode: "sample",
    skus: SAMPLE_SKUS,
    trend: SAMPLE_TREND,
    rowCount: SAMPLE_SKUS.length,
  };
}
