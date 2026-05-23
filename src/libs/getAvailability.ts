// GET /api/v1/hotels/:hotelId/availability?from=YYYY-MM-DD&to=YYYY-MM-DD
// Returns the per-day room availability for a single hotel.

export interface AvailabilityDay {
  date: string;
  booked: number;
  available: number;
  full: boolean;
}

export interface AvailabilityResponse {
  success: boolean;
  data: {
    hotel: { _id: string; name: string; roomCount: number; pricePerNight: number };
    from: string;
    to: string;
    days: AvailabilityDay[];
  };
  message?: string;
}

export default async function getAvailability(
  hotelId: string,
  from?: string,
  to?: string
): Promise<AvailabilityResponse> {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  const q = params.toString() ? `?${params.toString()}` : "";

  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/availability${q}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return {
      success: false,
      data: { hotel: { _id: hotelId, name: "", roomCount: 0, pricePerNight: 0 }, from: "", to: "", days: [] },
      message: `Failed to fetch availability (${res.status})`,
    };
  }
  return res.json();
}
