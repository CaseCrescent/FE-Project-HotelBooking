"use client";
import { Dayjs } from "dayjs";
import { motion } from "framer-motion";

interface BookingSummaryPanelProps {
  hotelName?: string;
  bookDate: Dayjs | null;
  checkoutDate: Dayjs | null;
  numOfNights: number;
  isOverLimit: boolean;
}

export default function BookingSummaryPanel({
  hotelName,
  bookDate,
  checkoutDate,
  numOfNights,
  isOverLimit,
}: BookingSummaryPanelProps) {
  return (
    <aside className="lg:sticky lg:top-[80px] self-start">
      <div className="glass-card p-6 md:p-7">
        <div className="flex items-center justify-between mb-5">
          <div className="text-[10px] tracking-[0.32em] uppercase text-gold">Booking Summary</div>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-gold" />
        </div>

        {/* Hotel */}
        <Row label="Hotel" value={hotelName || "—"} highlight={!!hotelName} />

        <div className="h-px bg-white/[0.05] my-4" />

        {/* Dates */}
        <Row label="Check-in" value={bookDate ? bookDate.format("DD MMM YYYY") : "—"} highlight={!!bookDate} />
        <Row label="Check-out" value={checkoutDate ? checkoutDate.format("DD MMM YYYY") : "—"} highlight={!!checkoutDate} />

        <div className="h-px bg-white/[0.05] my-4" />

        {/* Nights */}
        <div className="flex items-center justify-between">
          <span className="text-white/45 text-[10px] uppercase tracking-widest">Duration</span>
          <motion.span
            key={`${numOfNights}-${isOverLimit}`}
            initial={{ scale: 0.9, opacity: 0.4 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className={`text-2xl font-bold tracking-tight tabular-nums ${
              isOverLimit ? "text-red-400" : "text-gold"
            }`}
          >
            {numOfNights} {numOfNights === 1 ? "Night" : "Nights"}
          </motion.span>
        </div>

        {/* Visual night indicators */}
        <div className="flex gap-1.5 mt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full transition-all duration-300"
              style={{
                background:
                  i < numOfNights
                    ? isOverLimit
                      ? "#ef4444"
                      : "linear-gradient(90deg, #dcb771, #f5d78e)"
                    : "rgba(255,255,255,0.06)",
                boxShadow: i < numOfNights && !isOverLimit ? "0 0 8px rgba(220,183,113,0.3)" : "none",
              }}
            />
          ))}
        </div>

        {/* Helper */}
        <p className="mt-5 text-white/35 text-[11px] leading-relaxed">
          You can book up to 3 nights. Confirmation is instant once you complete the wizard.
        </p>
      </div>
    </aside>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <span className="text-white/45 text-[10px] uppercase tracking-widest flex-shrink-0">{label}</span>
      <span className={`text-sm text-right truncate ${highlight ? "text-white font-medium" : "text-white/40"}`}>
        {value}
      </span>
    </div>
  );
}
