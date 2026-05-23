import { extractError } from "./extractError";

// Soft delete by default (flips active=false). Pass hard:true for permanent deletion.
export default async function deleteRoomService(
  token: string,
  serviceId: string,
  hard = false
) {
  const url = hard
    ? `${process.env.BACKEND_URL}/api/v1/roomservices/${serviceId}?hard=true`
    : `${process.env.BACKEND_URL}/api/v1/roomservices/${serviceId}`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not delete service"));
  return res.json();
}
