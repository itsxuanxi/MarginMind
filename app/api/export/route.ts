import { NextResponse } from "next/server";
import { buildReport } from "@/lib/report";
import {
  getEntitlements,
  recordExport,
  canExport,
  FREE_EXPORT_LIMIT,
} from "@/lib/entitlements";

export const runtime = "nodejs";

/** Current export entitlement (for the UI to reflect remaining free exports). */
export async function GET() {
  const e = await getEntitlements();
  return NextResponse.json({
    isPaid: e.isPaid,
    plan: e.plan,
    exportCount: e.exportCount,
    limit: FREE_EXPORT_LIMIT,
    canExport: canExport(e),
  });
}

/** Gated export. The limit is enforced server-side; the client only formats. */
export async function POST(req: Request) {
  let format = "csv";
  try {
    const body = await req.json();
    if (body?.format === "pdf") format = "pdf";
  } catch {
    /* default csv */
  }

  const e = await getEntitlements();

  if (!canExport(e)) {
    return NextResponse.json(
      {
        allowed: false,
        reason: "limit",
        isPaid: false,
        exportCount: e.exportCount,
        limit: FREE_EXPORT_LIMIT,
      },
      { status: 402 }
    );
  }

  const updated = await recordExport();
  const report = buildReport();

  return NextResponse.json({
    allowed: true,
    format,
    report,
    isPaid: updated.isPaid,
    exportCount: updated.exportCount,
    limit: FREE_EXPORT_LIMIT,
  });
}
