import { NextResponse } from "next/server";
import { getProfitDataset } from "@/lib/dataset";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Returns the current account's profit dataset (real uploaded data or sample). */
export async function GET() {
  const dataset = await getProfitDataset();
  return NextResponse.json(dataset);
}
