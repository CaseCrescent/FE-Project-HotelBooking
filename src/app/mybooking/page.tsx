import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBookings from "@/libs/getBookings";
import BookingList, { Booking } from "@/components/BookingList";
import { SkeletonBookingGrid } from "@/components/shared/Skeletons";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import SessionExpiredCard from "@/components/shared/SessionExpiredCard";

export const metadata = { title: "My Bookings · Hotel Booking" };

async function MyBookingInner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return <SessionExpiredCard message="Sign in to view your bookings" callbackUrl="/mybooking" />;
  }
  let bookings: Booking[] = [];
  let loadError: string | null = null;
  try {
    const bookingsData = await getBookings(session.user.token);
    bookings = bookingsData.data || [];
  } catch (error) {
    loadError = (error as Error).message;
    console.error("Failed to fetch bookings:", error);
  }
  if (loadError) {
    return <SessionExpiredCard message={loadError} callbackUrl="/mybooking" />;
  }
  return <BookingList bookings={bookings} isAdmin={false} />;
}

export default function MyBookingPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Your stays"
        title="My Bookings"
        description="Edit, cancel, or share any booking from one place."
      />
      <Suspense fallback={<SkeletonBookingGrid count={4} />}>
        <MyBookingInner />
      </Suspense>
    </PageShell>
  );
}
