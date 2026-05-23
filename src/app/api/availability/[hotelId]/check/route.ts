// GET /api/availability/:hotelId/check?date=YYYY-MM-DD&nights=N
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, ctx: { params: Promise<{ hotelId: string }> }) {
  const { hotelId } = await ctx.params;
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || "";
  const nights = searchParams.get("nights") || "1";
  if (!date) {
    return NextResponse.json({ success: false, message: "`date` is required" }, { status: 400 });
  }
  try {
    const r = await fetch(
      `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/availability/check?date=${date}&nights=${nights}`,
      { cache: "no-store" }
    );
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ success: false, message: msg }, { status: 502 });
  }
}
