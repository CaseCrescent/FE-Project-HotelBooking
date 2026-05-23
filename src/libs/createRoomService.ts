import { extractError } from "./extractError";

export default async function createRoomService(
  token: string,
  hotelId: string,
  payload: { name: string; description?: string; price?: number; dailyCapacity?: number | null; active?: boolean }
) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/hotels/${hotelId}/roomservices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not create service"));
  return res.json();
}
