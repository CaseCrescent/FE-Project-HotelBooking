import { notFound } from "next/navigation";
import dayjs from "dayjs";
import getBookingPublic from "@/libs/getBookingPublic";
import BookingTicketClient from "./BookingTicketClient";

type BookedService = {
  service: string | { _id: string };
  name?: string;
  price?: number;
  quantity?: number;
};

type RawBooking = {
  _id: string;
  bookingDate: string;
  numOfNights: number;
  status: string;
  confirmationNumber: string;
  createdAt: string;
  paymentStatus: string;
  hotel: { _id: string; name: string; address: string; tel: string; checkInTime?: string; checkOutTime?: string };
  roomServices?: BookedService[];
};

export const dynamic = "force-dynamic";

export default async function BookingTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const json = await getBookingPublic(id);
  const booking = json?.data as RawBooking | null;
  if (!booking) return notFound();

  const checkoutDate = dayjs(booking.bookingDate).add(booking.numOfNights, "day").format("YYYY-MM-DD");

  return (
    <BookingTicketClient
      bookingId={booking._id}
      confirmationNumber={booking.confirmationNumber}
      hotel={booking.hotel}
      bookingDate={booking.bookingDate}
      checkoutDate={checkoutDate}
      numOfNights={booking.numOfNights}
      status={booking.status}
      paymentStatus={booking.paymentStatus}
      roomServices={booking.roomServices || []}
    />
  );
}
