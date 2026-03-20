// ===========================================
// src/app/hotel/[hid]/HotelDetailClient.tsx
// Client Component สำหรับแสดง rating + description
// - ใช้ใน hotel detail page (Server Component ไม่เรียก Redux ได้)
// ===========================================

"use client";
import { useAppSelector } from "@/redux/store";
import { getHotelMeta } from "@/redux/features/bookSlice";
import StarRating from "@/components/StarRating";

export default function HotelDetailClient({
  hotelId,
  hotelName,
}: {
  hotelId: string;
  hotelName: string;
}) {
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);
  const meta = getHotelMeta(hotelMetaStore, hotelId, hotelName);

  return (
    <div className="flex flex-col gap-1 pb-3 mb-1 border-b border-white/[0.06]">
      <StarRating rating={meta.rating} size={16} />
      <p className="text-white/40 text-sm">{meta.description}</p>
    </div>
  );
}
