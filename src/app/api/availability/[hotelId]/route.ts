// Public proxy: GET /api/availability/:hotelId?days=N&from=YYYY-MM-DD
// Forwards to BACKEND_URL — keeps backend URL server-only.

import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const params = new URLSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const days = Number(searchParams.get("days") || "0");

  if (from) params.set("from", from);
  if (to) params.set("to", to);
  if (!to && days > 0) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setUTCDate(end.getUTCDate() + days);
    params.set("from", today.toISOString().slice(0, 10));
    params.set("to", end.toISOString().slice(0, 10));
  }

  const qs = params.toString();
  const url = `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/availability${qs ? `?${qs}` : ""}`;
  try {
    const r = await fetch(url, { cache: "no-store" });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ success: false, message: msg }, { status: 502 });
  }
}
