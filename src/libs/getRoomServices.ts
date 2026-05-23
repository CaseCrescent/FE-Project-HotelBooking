import { extractError } from "./extractError";

export interface RoomServiceItem {
  _id: string;
  hotel: { _id: string; name?: string } | string;
  name: string;
  description: string;
  price: number;
  dailyCapacity: number | null;
  active: boolean;
}

export default async function getRoomServices(
  hotelId?: string,
  opts?: { includeInactive?: boolean; token?: string }
): Promise<{ success: boolean; count: number; data: RoomServiceItem[] }> {
  const base = hotelId
    ? `${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/roomservices`
    : `${process.env.BACKEND_URL}/api/v1/roomservices`;
  const url = opts?.includeInactive ? `${base}?includeInactive=true` : base;
  const headers: Record<string, string> = {};
  if (opts?.token) headers.authorization = `Bearer ${opts.token}`;
  const res = await fetch(url, { cache: "no-store", headers });
  if (!res.ok) throw new Error(await extractError(res, "Could not load services"));
  return res.json();
}
