import { extractError } from "./extractError";

export default async function checkinBooking(
  token: string,
  bookingId: string,
  opts?: { force?: boolean }
) {
  const url = opts?.force
    ? `${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}/check-in?force=true`
    : `${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}/check-in`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(await extractError(res, "Could not check in booking"));
  return res.json();
}
