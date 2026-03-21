// ===========================================
// src/app/hotel/[hid]/HotelDetailClient.tsx
// Client Component สำหรับแสดง rating + description
// - ใช้ใน hotel detail page (Server Component ไม่เรียก Redux ได้)
// - รับ apiRating/apiDescription จาก backend เป็น primary
// - ใช้ Redux hotelMeta เป็น fallback ถ้า backend ไม่มีค่า
// ===========================================

"use client";
import { useAppSelector } from "@/redux/store";
import { getHotelMeta } from "@/redux/features/bookSlice";
import StarRating from "@/components/StarRating";

export default function HotelDetailClient({
  hotelId,
  hotelName,
  apiRating,
  apiDescription,
}: {
  hotelId: string;
  hotelName: string;
  apiRating?: number | null;
  apiDescription?: string | null;
}) {
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);
  const meta = getHotelMeta(hotelMetaStore, hotelId, hotelName);

  // Backend value takes priority; Redux meta is fallback
  const displayRating = apiRating ?? meta.rating;
  const displayDescription = apiDescription ?? meta.description;

  return (
    <div className="flex flex-col gap-1 pb-3 mb-1 border-b border-white/[0.06]">
      <StarRating rating={displayRating} size={16} />
      <p className="text-white/40 text-sm">{displayDescription}</p>
    </div>
  );
}
