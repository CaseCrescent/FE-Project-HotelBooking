"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import StatusPill from "@/components/shared/StatusPill";
import { payBookingAction } from "@/app/actions";
import { HOUSE_EASE } from "@/lib/animations";
import dayjs from "dayjs";

type Hotel = { _id: string; name: string; address: string; tel: string; checkInTime?: string; checkOutTime?: string };

type BookedService = {
  service: string | { _id: string };
  name?: string;
  price?: number;
  quantity?: number;
};

export default function BookingTicketClient({
  bookingId,
  confirmationNumber,
  hotel,
  bookingDate,
  checkoutDate,
  numOfNights,
  status,
  paymentStatus,
  roomServices = [],
}: {
  bookingId: string;
  confirmationNumber: string;
  hotel: Hotel;
  bookingDate: string;
  checkoutDate: string;
  numOfNights: number;
  status: string;
  paymentStatus: string;
  roomServices?: BookedService[];
}) {
  const [shareUrl, setShareUrl] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined") setShareUrl(window.location.href);
  }, []);

  const copy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl).then(
      () => toast.success("Receipt link copied"),
      () => toast.error("Could not copy")
    );
  };

  const handlePay = async () => {
    setIsPaying(true);
    try {
      const res = await payBookingAction(bookingId);
      if (res.success) {
        toast.success("Payment successful!");
      } else {
        toast.error(res.message || "Payment failed");
      }
    } catch {
      toast.error("Payment failed");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] pt-10 md:pt-16 pb-20 md:pb-28 px-6 flex justify-center">
      <div className="w-full max-w-[820px]">
        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: HOUSE_EASE }}
          className="text-center mb-10"
        >
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Booking confirmed</div>
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight">
            See you at {hotel.name}.
          </h1>
          <p className="text-white/55 mt-3 text-sm md:text-base">
            Save this page or share the link below — it's all you need at check-in.
          </p>
        </motion.div>

        {/* Ticket card with perforated stub */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: HOUSE_EASE, delay: 0.1 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl gradient-gold shadow-elegant">
            <div className="shimmer-overlay" />
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-[11px] tracking-[0.32em] uppercase text-[#1a1730]/70 mb-2">Confirmation</div>
                  <div className="text-[#1a1730] text-2xl md:text-3xl font-bold tracking-widest">{confirmationNumber}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusPill status={status} />
                  {paymentStatus === "paid" ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-200">Paid</span>
                  ) : paymentStatus === "pending" ? (
                    <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-200">Payment Pending</span>
                  ) : null}
                </div>
              </div>

              {paymentStatus === "pending" && status !== "cancelled" && (
                <div className="mb-6 rounded-xl bg-amber-500/10 border border-amber-500/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[#1a1730] text-sm">
                    <strong>Action Required:</strong> Please complete your payment to finalize this booking.
                  </div>
                  <button
                    onClick={handlePay}
                    disabled={isPaying}
                    className="px-6 py-2.5 rounded-full bg-[#1a1730] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#0c0a14] whitespace-nowrap transition-colors"
                  >
                    {isPaying ? "Processing..." : "Pay Now (Mock)"}
                  </button>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-5 mb-6">
                <Cell label="Check-in" value={dayjs(bookingDate).format("DD MMM YYYY")} sub={hotel.checkInTime ? `from ${hotel.checkInTime}` : undefined} dark />
                <Cell label="Check-out" value={dayjs(checkoutDate).format("DD MMM YYYY")} sub={hotel.checkOutTime ? `before ${hotel.checkOutTime}` : undefined} dark />
                <Cell label="Nights" value={`${numOfNights}`} sub={numOfNights === 1 ? "Night" : "Nights"} dark />
              </div>

              {roomServices.length > 0 && (
                <div className="mb-6 rounded-xl bg-[rgba(26,23,48,0.12)] border border-[rgba(26,23,48,0.18)] p-4">
                  <div className="text-[10px] uppercase tracking-widest text-[#1a1730]/65 mb-2">Add-ons</div>
                  <ul className="flex flex-col gap-1">
                    {roomServices.map((s, i) => {
                      const name = s.name || "Service";
                      const qty = s.quantity ?? 1;
                      const price = s.price ?? 0;
                      return (
                        <li key={i} className="flex justify-between text-sm">
                          <span className="text-[#1a1730] font-semibold">{name} × {qty}</span>
                          <span className="text-[#1a1730]/85 tabular-nums">
                            {price === 0 ? "Included" : `฿${(price * qty).toLocaleString()}`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copy}
                  className="px-5 py-2.5 rounded-full bg-[#1a1730] text-white text-xs uppercase tracking-widest font-bold hover:bg-[#0c0a14]"
                >
                  Copy receipt link
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-full border-2 border-[#1a1730] text-[#1a1730] text-xs uppercase tracking-widest font-bold hover:bg-[#1a1730] hover:text-white transition-colors"
                >
                  Print
                </button>
              </div>
            </div>

            {/* Perforated separator */}
            <div className="relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0c0a14]" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0c0a14]" />
              <div
                className="h-[2px] mx-8"
                style={{
                  background: "repeating-linear-gradient(to right, rgba(26,23,48,0.45) 0 6px, transparent 6px 12px)",
                }}
              />
            </div>

            <div className="relative z-10 p-8 md:p-10 bg-[#1a1730]/95 backdrop-blur-md">
              <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Where to go</div>
              <div className="text-white text-xl font-bold">{hotel.name}</div>
              <div className="text-white/70 text-sm mt-1">{hotel.address}</div>
              {hotel.tel && (
                <a href={`tel:${hotel.tel}`} className="inline-flex items-center gap-2 mt-3 text-gold hover:text-[#f5d78e] text-sm">
                  <span aria-hidden>☎</span> {hotel.tel}
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Footer actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/mybooking"
            className="px-5 py-2.5 rounded-full border border-white/15 text-white/85 text-xs tracking-widest uppercase font-semibold hover:bg-white/[0.04]"
          >
            All my bookings
          </Link>
          <Link
            href={`/hotel/${hotel._id}`}
            className="px-5 py-2.5 rounded-full gradient-gold text-[#1a1730] text-xs tracking-widest uppercase font-bold shadow-soft"
          >
            View hotel
          </Link>
        </div>

        <p className="text-white/30 text-[11px] text-center mt-6 tracking-widest uppercase">
          Booking ID · {bookingId}
        </p>
      </div>
    </main>
  );
}

function Cell({ label, value, sub, dark }: { label: string; value: string; sub?: string; dark?: boolean }) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: dark ? "rgba(26,23,48,0.12)" : "rgba(255,255,255,0.04)",
        border: dark ? "1px solid rgba(26,23,48,0.18)" : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="text-[10px] uppercase tracking-widest text-[#1a1730]/65">{label}</div>
      <div className="text-[#1a1730] text-xl font-bold mt-1">{value}</div>
      {sub && <div className="text-[#1a1730]/65 text-xs mt-0.5">{sub}</div>}
    </div>
  );
}
