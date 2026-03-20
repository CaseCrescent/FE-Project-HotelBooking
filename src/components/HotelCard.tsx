// ===========================================
// src/components/HotelCard.tsx
// Hotel Card — Redesigned v2
// - รูปภาพ (ด้านบน)
// - ชื่อ hotel
// - ดาว rating (1-5)
// - description ใต้ดาว
// - ไม่มี badge ทับรูป
// ===========================================

"use client";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import { getHotelMeta } from "@/redux/features/bookSlice";
import StarRating from "@/components/StarRating";

export default function HotelCard({
  hotelId,
  hotelName,
  imgSrc,
}: {
  hotelId: string;
  hotelName: string;
  imgSrc?: string;
}) {
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);
  const meta = getHotelMeta(hotelMetaStore, hotelId, hotelName);

  const defaultImages = ["/img/hotel.jpg", "/img/hotel2.jpg", "/img/hotel3.jpg"];
  const imageIndex = hotelName.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0) % defaultImages.length;
  // meta.picture (Redux) takes priority over server imgSrc, then falls back to default
  const displayImage = meta.picture || imgSrc || defaultImages[imageIndex];

  return (
    <div className="w-full max-w-[340px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_50px_rgba(220,183,113,0.12)] cursor-pointer group border border-white/[0.04]">
      {/* ===== รูปภาพ — ไม่มี badge ทับ ===== */}
      <div className="relative w-full h-[200px] sm:h-[210px] overflow-hidden">
        <Image
          src={displayImage}
          alt={hotelName}
          fill={true}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>

      {/* ===== ข้อมูล ===== */}
      <div className="p-4 sm:p-5" style={{ backgroundColor: "#16132a" }}>
        {/* ชื่อ */}
        <h3 className="text-[#dcb771] font-bold text-base sm:text-lg mb-2 truncate">
          {hotelName}
        </h3>

        {/* ดาว */}
        <div className="mb-2">
          <StarRating rating={meta.rating} />
        </div>

        {/* Description */}
        <p className="text-white/35 text-xs sm:text-sm leading-relaxed">
          {meta.description}
        </p>
      </div>
    </div>
  );
}
