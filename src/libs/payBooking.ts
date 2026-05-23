export default async function payBooking(token: string, bookingId: string) {
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/bookings/${bookingId}/pay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to process payment");
  }

  return await response.json();
}
