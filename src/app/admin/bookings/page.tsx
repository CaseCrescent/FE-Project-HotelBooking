import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import getBookings from "@/libs/getBookings";
import BookingList, { Booking } from "@/components/BookingList";
import { SkeletonBookingGrid } from "@/components/shared/Skeletons";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import SessionExpiredCard from "@/components/shared/SessionExpiredCard";

export const metadata = { title: "Manage Bookings · Admin · Hotel Booking" };

async function AllBookingsInner() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token || session.user.role !== "admin") {
    return <p className="text-white text-lg text-center">Admin access only.</p>;
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
    return <SessionExpiredCard message={loadError} callbackUrl="/admin/bookings" />;
  }

  const counts = bookings.reduce<Record<string, number>>(
    (acc, b) => {
      const s = (b.status || "confirmed").toLowerCase();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    },
    { confirmed: 0, cancelled: 0, completed: 0 }
  );

  return (
    <>
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatTile label="Total" value={bookings.length} accent />
          <StatTile label="Upcoming" value={counts.confirmed || 0} />
          <StatTile label="Cancelled" value={counts.cancelled || 0} />
          <StatTile label="Completed" value={counts.completed || 0} />
        </div>
      </section>
      <BookingList bookings={bookings} isAdmin />
    </>
  );
}

export default function AdminBookingsPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Admin console"
        title="Manage All Bookings"
        description="Filter by status, edit, cancel, or hard-delete from one place."
      />
      <Suspense fallback={<SkeletonBookingGrid count={4} />}>
        <AllBookingsInner />
      </Suspense>
    </PageShell>
  );
}

function StatTile({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border ${accent ? "border-[#dcb771]/30 bg-[rgba(220,183,113,0.06)]" : "border-white/[0.06] bg-white/[0.02]"}`}>
      <div className="text-[10px] uppercase tracking-widest text-white/45">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? "text-gold-light" : "text-white"}`}>{value}</div>
    </div>
  );
}
