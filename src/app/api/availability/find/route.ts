// GET /api/availability/find?nights=&days=&hotel=
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const nights = searchParams.get("nights") || "1";
  const days = searchParams.get("days") || "7";
  const hotel = searchParams.get("hotel");
  const qs = new URLSearchParams({ nights, days });
  if (hotel) qs.set("hotel", hotel);
  try {
    const r = await fetch(`${process.env.BACKEND_URL}/api/v1/availability/find?${qs.toString()}`, {
      cache: "no-store",
    });
    const json = await r.json();
    return NextResponse.json(json, { status: r.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Upstream error";
    return NextResponse.json({ success: false, message: msg, data: [] }, { status: 502 });
  }
}
