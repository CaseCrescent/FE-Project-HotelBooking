// ===========================================
// src/redux/features/bookSlice.ts
// Redux Slice — Bookings + Hotel Metadata
//
// เพิ่ม hotelMeta: เก็บ rating + description ของ hotel แต่ละแห่ง
// - ไม่แตะ Backend เลย (Backend ไม่มี field rating/description)
// - Admin ตั้งค่าผ่านหน้า Manage Hotels → เก็บใน Redux Persist
// - Hotel card อ่านจาก hotelMeta ถ้ามี, ไม่มีใช้ default
// ===========================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Booking item
export interface ReduxBookingItem {
  _id: string;
  bookingDate: string;
  numOfNights: number;
  user: string;
  hotel: {
    _id: string;
    name: string;
    address: string;
    tel: string;
  };
  createdAt: string;
}

// Hotel metadata (เก็บเฉพาะ frontend — ไม่มีใน Backend)
export interface HotelMeta {
  rating: number;        // 1-5 ดาว
  description: string;   // ประเภท/คำอธิบายโรงแรม
  picture?: string;      // base64 DataURL หรือ URL รูปภาพ (ไม่ส่งไป Backend)
}

type BookState = {
  bookItems: ReduxBookingItem[];
  hotelMeta: { [hotelId: string]: HotelMeta }; // key = hotel._id
};

const initialState: BookState = {
  bookItems: [],
  hotelMeta: {},
};

export const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    // ----- Booking Actions -----
    setBookings: (state, action: PayloadAction<ReduxBookingItem[]>) => {
      state.bookItems = action.payload;
    },
    addBooking: (state, action: PayloadAction<ReduxBookingItem>) => {
      state.bookItems.push(action.payload);
    },
    updateBooking: (state, action: PayloadAction<ReduxBookingItem>) => {
      const index = state.bookItems.findIndex((item) => item._id === action.payload._id);
      if (index >= 0) state.bookItems[index] = action.payload;
    },
    removeBooking: (state, action: PayloadAction<string>) => {
      state.bookItems = state.bookItems.filter((item) => item._id !== action.payload);
    },
    clearBookings: (state) => {
      state.bookItems = [];
    },

    // ----- Hotel Meta Actions (Frontend-only) -----
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
  setBookings,
  addBooking,
  updateBooking,
  removeBooking,
  clearBookings,
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
