"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Slider } from "@mui/material";
import dayjs from "dayjs";
import { reveal, stagger, VIEW_ONCE } from "@/lib/animations";
import { SkeletonBlock } from "@/components/shared/Skeletons";
import EmptyState from "@/components/shared/EmptyState";

interface EarliestResult {
  hotel: {
    _id: string;
    name: string;
    address: string;
    picture?: string | null;
    pricePerNight: number;
    rating?: number | null;
  };
  checkIn: string;
  nights: number;
  roomsAvailable: number;
  totalPrice: number;
}

const FALLBACK_IMAGES = ["/img/hotel.jpg", "/img/hotel2.jpg", "/img/hotel3.jpg", "/img/hotel4.jpg"];

export default function FindEarliestClient() {
  const [nights, setNights] = useState(1);
  const [windowDays, setWindowDays] = useState(7);
  const [results, setResults] = useState<EarliestResult[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const r = await fetch(`/api/availability/find?nights=${nights}&days=${windowDays}`);
        const j = await r.json();
        if (cancelled) return;
        setResults(j?.data || []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [nights, windowDays]);

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      {/* Controls */}
      <aside className="glass-card-gold p-6 h-fit lg:sticky lg:top-[80px]">
        <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-5">Filters</div>

        <Field label={`Trip length · ${nights} ${nights === 1 ? "night" : "nights"}`}>
          <Slider
            value={nights}
            onChange={(_, v) => setNights(v as number)}
            min={1}
            max={3}
            step={1}
            marks
            valueLabelDisplay="auto"
            sx={{ color: "#dcb771", "& .MuiSlider-markActive": { backgroundColor: "#fff" } }}
          />
        </Field>

        <Field label={`Search window · next ${windowDays} days`}>
          <Slider
            value={windowDays}
            onChange={(_, v) => setWindowDays(v as number)}
            min={3}
            max={30}
            step={1}
            valueLabelDisplay="auto"
            sx={{ color: "#dcb771" }}
          />
        </Field>

        <p className="text-white/45 text-xs leading-relaxed mt-2">
          Results show the earliest open window per hotel, ranked by check-in date then price.
        </p>
      </aside>

      {/* Results */}
      <div className="min-w-0">
        {loading && !results && (
          <div className="grid sm:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} h={220} />
            ))}
          </div>
        )}

        {!loading && (!results || results.length === 0) && (
          <EmptyState
            title="No rooms found in the search window"
            description="Try increasing the search window or reducing the number of nights."
          />
        )}

        {results && results.length > 0 && (
          <motion.div
            key={`${nights}-${windowDays}`}
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={VIEW_ONCE}
            className="grid sm:grid-cols-2 gap-5"
          >
            {results.map((r, idx) => {
              const img = r.hotel.picture && /^https?:|^\//.test(r.hotel.picture)
                ? r.hotel.picture
                : FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];
              return (
                <motion.div key={`${r.hotel._id}-${r.checkIn}`} variants={reveal} className="glass-card overflow-hidden hover-lift">
                  <div className="relative h-[160px] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={r.hotel.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(22,19,42,0.9) 100%)" }} />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-card-gold text-[10px] tracking-widest uppercase text-gold-light">
                      {r.roomsAvailable} {r.roomsAvailable === 1 ? "room" : "rooms"} left
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-gold text-lg font-bold truncate">{r.hotel.name}</h3>
                    <p className="text-white/50 text-xs truncate mt-1">{r.hotel.address}</p>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <Cell label="Check-in" value={dayjs(r.checkIn).format("DD MMM YYYY")} />
                      <Cell label="Total" value={`฿${r.totalPrice.toLocaleString()}`} accent />
                    </div>

                    <Link
                      href={`/booking?hotel=${r.hotel._id}`}
                      className="block mt-5 w-full text-center px-5 py-3 rounded-full gradient-gold text-[#1a1730] text-xs font-bold tracking-widest uppercase shadow-soft hover:-translate-y-0.5 transition-transform"
                    >
                      Book this slot
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <label className="block text-[11px] tracking-[0.32em] uppercase text-white/55 mb-3">{label}</label>
      <div className="px-1">{children}</div>
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-widest text-white/45">{label}</div>
      <div className={`text-sm font-bold mt-0.5 ${accent ? "text-gold-light" : "text-white"}`}>{value}</div>
    </div>
  );
}
