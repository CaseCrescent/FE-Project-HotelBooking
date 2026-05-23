import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBooking from "@/libs/getBooking";
import getHotels from "@/libs/getHotels";
import BookingForm from "@/components/BookingForm";
import PageShell, { PageHeader } from "@/components/layout/PageShell";

interface BookingResp {
  _id: string;
  bookingDate: string;
  numOfNights: number;
  hotel: { _id: string; name: string } | string;
}

interface HotelLite {
  _id: string;
  name: string;
  address: string;
  pricePerNight?: number;
}

export default async function EditBookingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.token) {
    return (
      <PageShell narrow>
        <PageHeader eyebrow="Booking" title="Please sign in." align="center" />
      </PageShell>
    );
  }

  let booking: BookingResp | null = null;
  let hotels: HotelLite[] = [];
  try {
    const [bookingData, hotelsData] = await Promise.all([getBooking(session.user.token, id), getHotels()]);
    booking = bookingData.data;
    hotels =
      hotelsData.data?.map((h: HotelLite) => ({
        _id: h._id,
        name: h.name,
        address: h.address,
        pricePerNight: h.pricePerNight,
      })) || [];
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }

  if (!booking) {
    return (
      <PageShell narrow>
        <PageHeader eyebrow="Booking" title="Booking not found." align="center" />
      </PageShell>
    );
  }

  const hotelId = typeof booking.hotel === "object" ? booking.hotel._id : booking.hotel;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Edit booking"
        title="Reschedule your stay"
        description="Live availability is re-checked when you change date or nights."
      />
      <BookingForm
        mode="edit"
        hotels={hotels}
        initialHotelId={hotelId}
        initialData={{
          bookingId: booking._id,
          bookingDate: booking.bookingDate,
          numOfNights: booking.numOfNights,
        }}
      />
    </PageShell>
  );
}
