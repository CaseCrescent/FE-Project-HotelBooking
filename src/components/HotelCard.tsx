"use client";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAppSelector } from "@/redux/store";
import { getHotelMeta } from "@/redux/features/bookSlice";
import { isValidImageUrl } from "@/libs/isValidImageUrl";
import { HOVER_LIFT } from "@/lib/animations";
import CardShine from "@/components/motion/CardShine";

const DEFAULT_IMAGES = [
  "/img/hotel.jpg",
  "/img/hotel2.jpg",
  "/img/hotel3.jpg",
  "/img/hotel4.jpg",
  "/img/hotel5.jpg",
  "/img/hotel6.jpg",
];

// Deterministic fallback price if the DB row pre-dates the schema migration.
function fallbackPrice(hotelId: string) {
  const hash = hotelId.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  // 1200 / 1500 / 1800 / 2200 — varies per hotel so the page doesn't look flat
  const tiers = [1200, 1500, 1800, 2200];
  return tiers[hash % tiers.length];
}

export default function HotelCard({
  hotelId,
  hotelName,
  imgSrc,
  hotelRating,
  hotelDescription,
  pricePerNight,
  index = 0,
}: {
  hotelId: string;
  hotelName: string;
  imgSrc?: string;
  hotelRating?: number | null;
  hotelDescription?: string | null;
  pricePerNight?: number;
  index?: number;
}) {
  const reduce = useReducedMotion();
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);
  const meta = getHotelMeta(hotelMetaStore, hotelId, hotelName);

  // Start "loaded" when reduced-motion is on so we skip the blur-up entirely.
  // `useReducedMotion()` returns null on first render (media query unresolved). Treat
  // null as "possibly reduced" — only run the blur-up when we have explicit `false`.
  // This prevents a 700ms blur flash on reduced-motion users during the hydration window.
  const [imgLoaded, setImgLoaded] = useState<boolean>(reduce !== false);

  const rawImage = imgSrc || meta.picture;
  const displayImage = isValidImageUrl(rawImage)
    ? rawImage!
    : DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];

  // Always show *something* so every card has the same visual weight.
  const displayRating = hotelRating ?? meta.rating ?? 4;
  const displayDescription = hotelDescription ?? meta.description ?? "Boutique stay";
  // Price chain: explicit prop → admin-set override in Redux → deterministic fallback.
  const displayPrice = pricePerNight ?? meta.price ?? fallbackPrice(hotelId);

  return (
    <CardShine className="h-full" intensity={0.22}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={HOVER_LIFT}
        className="group relative w-full overflow-hidden cursor-pointer h-full flex flex-col"
        style={{
          backgroundColor: "#16132a",
          border: "1px solid rgba(220, 183, 113, 0.08)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Image */}
        <div className="relative w-full h-[220px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayImage}
            alt={hotelName}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                DEFAULT_IMAGES[index % DEFAULT_IMAGES.length];
              // Even if the fallback also fails to fire onLoad we don't want to be stuck blurred.
              setImgLoaded(true);
            }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.4s] group-hover:scale-110"
            style={{
              filter: imgLoaded ? "blur(0px) saturate(1)" : "blur(14px) saturate(1.15)",
              transform: imgLoaded ? "scale(1)" : "scale(1.04)",
              transition:
                "filter 700ms cubic-bezier(0.22, 0.9, 0.32, 1), transform 700ms cubic-bezier(0.22, 0.9, 0.32, 1)",
            }}
          />

          {/* Top gradient veil so chips stay readable on bright photos */}
          <div
            className="absolute inset-x-0 top-0 h-24 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, rgba(12,10,22,0.55) 0%, transparent 100%)",
            }}
          />

          {/* Rating chip — top-left */}
          <div
            className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
            style={{
              background: "rgba(12, 10, 22, 0.78)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(220, 183, 113, 0.3)",
              color: "#f5d78e",
            }}
          >
            <span aria-hidden>★</span>
            <span className="tabular-nums">{displayRating.toFixed(1)}</span>
          </div>

          {/* Price chip — top-right */}
          <div
            className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider"
            style={{
              background: "linear-gradient(135deg, rgba(245,215,142,0.95), rgba(220,183,113,0.95))",
              color: "#1a1730",
            }}
          >
            ฿{displayPrice.toLocaleString()} / night
          </div>

          {/* Bottom fade */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(180deg, transparent 55%, rgba(22,19,42,0.92) 100%)",
            }}
          />
        </div>

        {/* Body */}
        <div className="p-5 flex-1 flex flex-col">
          <h3
            className="text-gold font-bold text-lg mb-1.5 truncate transition-colors"
            style={{ color: "#dcb771" }}
          >
            {hotelName}
          </h3>
          <p className="text-white/50 text-xs uppercase tracking-widest mb-3">{displayDescription}</p>
          <div className="mt-auto flex items-center justify-between text-[12px] uppercase tracking-widest pt-3 border-t border-white/[0.05]">
            <span style={{ color: "rgba(220,183,113,0.75)" }}>View hotel</span>
            <span
              className="transition-transform group-hover:translate-x-1"
              style={{ color: "#dcb771" }}
            >
              →
            </span>
          </div>
        </div>
      </motion.div>
    </CardShine>
  );
}
