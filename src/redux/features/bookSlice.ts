// ===========================================
// src/redux/features/bookSlice.ts
// Redux Slice — Hotel Metadata (client-side overrides)
//
// hotelMeta เก็บ rating + description + picture สำหรับแต่ละโรงแรม
// - Backend มี field rating/description/picture อยู่แล้ว
// - Redux ใช้เป็น override/fallback เมื่อ API ไม่มีค่า หรือ admin ตั้งค่าท้องถิ่น
// - เก็บใน Redux Persist (localStorage)
// ===========================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Hotel metadata (client-side override — อ่าน backend ก่อน ใช้ Redux เป็น fallback)
export interface HotelMeta {
  rating: number;        // 1-5 ดาว
  description: string;   // ประเภท/คำอธิบายโรงแรม
  picture?: string;      // base64 DataURL หรือ URL รูปภาพ (override รูปจาก backend)
}

type BookState = {
  hotelMeta: { [hotelId: string]: HotelMeta }; // key = hotel._id
};

const initialState: BookState = {
  hotelMeta: {},
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    // ----- Hotel Meta Actions -----
    setHotelMeta: (
      state,
      action: PayloadAction<{ hotelId: string; meta: HotelMeta }>
    ) => {
      // Guard: redux-persist may rehydrate from an older state that lacks hotelMeta
      if (!state.hotelMeta) state.hotelMeta = {};
      state.hotelMeta[action.payload.hotelId] = action.payload.meta;
    },
    removeHotelMeta: (state, action: PayloadAction<string>) => {
      delete state.hotelMeta[action.payload];
    },
  },
});

export const {
  setHotelMeta,
  removeHotelMeta,
} = bookSlice.actions;

export default bookSlice.reducer;

// ----- Helper: ดึง default rating/description ถ้า admin ยังไม่ตั้ง -----
export function getHotelMeta(
  hotelMeta: { [id: string]: HotelMeta } | undefined,
  hotelId: string,
  hotelName: string
): HotelMeta {
  const safeHotelMeta = hotelMeta ?? {};

  // ถ้า admin ตั้งค่าไว้แล้วใน Redux → ใช้ค่านั้น
  if (safeHotelMeta[hotelId]) return safeHotelMeta[hotelId];

  // ไม่มี → สร้าง default ตามชื่อ (deterministic — ชื่อเดิมได้ค่าเดิมเสมอ)
  const hash = hotelName.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const descriptions = [
    "Luxury Resort & Spa",
    "Business Hotel",
    "Boutique Hotel",
    "Family-Friendly Resort",
    "City Center Hotel",
    "Beachfront Resort",
    "Mountain Retreat",
    "Heritage Hotel",
  ];

  return {
    rating: (hash % 3) + 3, // 3-5 ดาว
    description: descriptions[hash % descriptions.length],
  };
}
