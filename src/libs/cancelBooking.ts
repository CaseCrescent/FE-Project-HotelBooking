// PATCH /api/v1/bookings/:id/cancel — soft cancel (status='cancelled', preserves the row).

export default async function cancelBooking(token: string, bookingId: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(json?.message || `Failed to cancel booking (${res.status})`);
  }
  return json;
}
