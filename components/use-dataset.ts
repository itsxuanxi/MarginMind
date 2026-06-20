"use client";

import * as React from "react";
import type { ProfitDataset } from "@/lib/dataset";
import { SKUS, TREND } from "@/lib/mock-data";

/**
 * Loads the current account's profit dataset (real uploaded data or sample).
 * Renders sample instantly, then swaps to real data once /api/dataset returns,
 * so dashboards never block on the network. `dataMode` drives the Sample banner.
 */
export function useDataset() {
  const [data, setData] = React.useState<ProfitDataset>({
    dataMode: "sample",
    skus: SKUS,
    trend: TREND,
    rowCount: SKUS.length,
  });
  const [loading, setLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    try {
      const res = await fetch("/api/dataset", { cache: "no-store" });
      if (res.ok) {
        const json = (await res.json()) as ProfitDataset;
        if (json?.skus?.length) setData(json);
      }
    } catch {
      /* keep sample */
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { ...data, loading, refetch };
}
