"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import BookingCard, { type BookedService } from "./BookingCard";
import EmptyState from "@/components/shared/EmptyState";
import { reveal, stagger, VIEW_ONCE } from "@/lib/animations";

export type Booking = {
  _id: string;
  bookingDate: string;
  numOfNights: number;
  hotel: { name: string; address?: string } | string;
  user?: { name?: string } | string;
  status?: string;
  paymentStatus?: string;
  confirmationNumber?: string;
  roomServices?: BookedService[];
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Upcoming" },
  { key: "cancelled", label: "Cancelled" },
  { key: "completed", label: "Completed" },
] as const;

export default function BookingList({
  bookings,
  isAdmin,
}: {
  bookings: Booking[];
  isAdmin?: boolean;
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return bookings;
    return bookings.filter((b) => (b.status || "confirmed") === filter);
  }, [bookings, filter]);

  if (!bookings || bookings.length === 0) {
    return (
      <EmptyState
        icon="✨"
        title={isAdmin ? "No bookings found" : "You have no bookings yet"}
        description={isAdmin ? "Once users book, you'll see them here." : "Pick a hotel and reserve your first stay — it takes under a minute."}
        ctaLabel={isAdmin ? undefined : "Browse hotels"}
        ctaHref={isAdmin ? undefined : "/hotel"}
      />
    );
  }

  return (
    <div className="w-full max-w-[900px]">
      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-[11px] tracking-widest uppercase font-bold transition-all ${
                active
                  ? "gradient-gold text-[#1a1730] shadow-soft"
                  : "border border-white/10 text-white/65 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          );
        })}
        <span className="ml-auto text-white/40 text-xs self-center">
          {filtered.length} of {bookings.length}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="Nothing matches this filter" description="Try another tab." />
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={VIEW_ONCE}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.map((booking) => {
            // typeof null === 'object', so explicitly check for non-null too.
            const hotelObj =
              booking.hotel && typeof booking.hotel === "object" ? booking.hotel : null;
            const userObj =
              booking.user && typeof booking.user === "object" ? booking.user : null;
            const editPath = isAdmin
              ? `/admin/bookings/edit/${booking._id}`
              : `/mybooking/edit/${booking._id}`;
            return (
              <motion.div key={booking._id} variants={reveal}>
                <BookingCard
                  bookingId={booking._id}
                  hotelName={hotelObj?.name || "Unknown Hotel"}
                  hotelAddress={hotelObj?.address}
                  bookingDate={booking.bookingDate}
                  numOfNights={booking.numOfNights}
                  isAdmin={isAdmin}
                  userName={userObj?.name}
                  editPath={editPath}
                  status={booking.status}
                  paymentStatus={booking.paymentStatus}
                  confirmationNumber={booking.confirmationNumber}
                  roomServices={booking.roomServices}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
