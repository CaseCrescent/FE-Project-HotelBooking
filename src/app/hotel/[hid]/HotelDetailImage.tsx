// ===========================================
// src/app/hotel/[hid]/HotelDetailImage.tsx
// Client Component สำหรับแสดงรูปโรงแรม
// - อ่าน meta.picture จาก Redux (frontend-only)
// - ถ้าไม่มีใน Redux ใช้ fallbackSrc จาก server
// ===========================================

"use client";
import { useAppSelector } from "@/redux/store";
import { getHotelMeta } from "@/redux/features/bookSlice";
import { isValidImageUrl } from "@/libs/isValidImageUrl";

export default function HotelDetailImage({
  hotelId,
  hotelName,
  fallbackSrc,
}: {
  hotelId: string;
  hotelName: string;
  fallbackSrc: string;
}) {
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);
  const meta = getHotelMeta(hotelMetaStore, hotelId, hotelName);
  const rawSrc = meta.picture || fallbackSrc;
  const src = isValidImageUrl(rawSrc) ? rawSrc : fallbackSrc;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={hotelName}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
}