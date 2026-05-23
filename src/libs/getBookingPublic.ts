// GET /api/v1/bookings/:id/public — shareable confirmation page, no auth needed.

export default async function getBookingPublic(bookingId: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}/public`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return { success: false, data: null, message: `Booking not found (${res.status})` };
  }
  return res.json();
}
