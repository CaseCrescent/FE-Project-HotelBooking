import { extractError } from "./extractError";

export default async function completeBooking(token: string, bookingId: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}/complete`, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not complete booking"));
  return res.json();
}
