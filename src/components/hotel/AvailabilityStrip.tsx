"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { reveal, stagger, VIEW_ONCE } from "@/lib/animations";
import type { AvailabilityDay } from "@/libs/getAvailability";

function fmtShort(d: string) {
  const dt = new Date(d + "T00:00:00Z");
  return dt.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}

export default function AvailabilityStrip({ hotelId }: { hotelId: string }) {
  const [days, setDays] = useState<AvailabilityDay[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`/api/availability/${hotelId}?days=10`);
        const json = await res.json();
        if (cancelled) return;
        if (json?.success) {
          setDays(json.data.days || []);
        } else {
          setError(json?.message || "Could not load availability");
        }
      } catch {
        if (!cancelled) setError("Network error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    // poll every 25s for live updates (no realtime infra)
    const t = setInterval(load, 25_000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [hotelId]);

  if (loading && !days) {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 64, borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-white/40 text-sm">{error}</p>;
  }
  if (!days || days.length === 0) {
    return <p className="text-white/40 text-sm">No availability data.</p>;
  }

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={VIEW_ONCE}
      className="grid grid-cols-5 sm:grid-cols-10 gap-2"
    >
      {days.map((d) => {
        const pct = Math.max(0, Math.min(1, d.available / Math.max(1, d.available + d.booked)));
        return (
          <motion.div
            key={d.date}
            variants={reveal}
            className={`relative rounded-xl p-2 text-center border ${
              d.full
                ? "border-red-500/30 bg-red-500/[0.06]"
                : pct < 0.3
                ? "border-amber-400/30 bg-amber-400/[0.06]"
                : "border-emerald-400/25 bg-emerald-400/[0.05]"
            }`}
            title={`${d.available} of ${d.available + d.booked} rooms available`}
          >
            <div className="text-[10px] uppercase tracking-wider text-white/50">{fmtShort(d.date)}</div>
            <div
              className={`text-lg font-bold mt-1 ${
                d.full ? "text-red-300" : pct < 0.3 ? "text-amber-200" : "text-emerald-200"
              }`}
            >
              {d.full ? "FULL" : d.available}
            </div>
            {!d.full && (
              <div className="mt-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full ${pct < 0.3 ? "bg-amber-300" : "bg-emerald-300"}`}
                  style={{ width: `${Math.max(8, pct * 100)}%` }}
                />
              </div>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
}
