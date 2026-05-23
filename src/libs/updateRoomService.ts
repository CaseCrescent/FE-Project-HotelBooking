import { extractError } from "./extractError";

export default async function updateRoomService(
  token: string,
  serviceId: string,
  patch: { name?: string; description?: string; price?: number; dailyCapacity?: number | null; active?: boolean }
) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/roomservices/${serviceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not update service"));
  return res.json();
}
