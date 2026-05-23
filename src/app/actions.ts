// ===========================================
// src/app/actions.ts
// Server Actions สำหรับ Mutations ทั้งหมด
// - ทุกฟังก์ชันมี "use server" เพื่อรันบน server เท่านั้น
// - ดึง session token จาก NextAuth อัตโนมัติ (client ไม่ต้องส่ง token เอง)
// - เรียก lib functions ที่ใช้ process.env.BACKEND_URL (server-only)
// - ใช้ revalidatePath เพื่อ refresh หน้าหลัง mutation สำเร็จ
//
// ทำไมต้องมีไฟล์นี้:
//   เว็บ Venue เดิมเก็บ booking ใน Redux (client-side) ไม่ต้องเรียก API
//   แต่ Hotel Booking ต้อง CRUD ผ่าน Backend API จริง
//   และ BACKEND_URL เป็น server-only env var → client เรียกตรงไม่ได้
//   จึงต้องใช้ Server Actions เป็นตัวกลาง
// ===========================================

"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { revalidatePath, revalidateTag } from "next/cache";

import createBooking from "@/libs/createBooking";
import updateBooking from "@/libs/updateBooking";
import deleteBooking from "@/libs/deleteBooking";
import cancelBooking from "@/libs/cancelBooking";
import createHotel from "@/libs/createHotel";
import updateHotel from "@/libs/updateHotel";
import deleteHotel from "@/libs/deleteHotel";
import deleteAccount from "@/libs/deleteAccount";
import userRegister from "@/libs/userRegister";
import getRoomServices from "@/libs/getRoomServices";
import createReview from "@/libs/createReview";
import updateReview from "@/libs/updateReview";
import deleteReview from "@/libs/deleteReview";
import voteReview, { type VoteValue } from "@/libs/voteReview";
import createRoomService from "@/libs/createRoomService";
import updateRoomService from "@/libs/updateRoomService";
import deleteRoomService from "@/libs/deleteRoomService";
import checkinBooking from "@/libs/checkinBooking";
import completeBooking from "@/libs/completeBooking";
import payBooking from "@/libs/payBooking";
import { banUser, unbanUser, promoteUser, demoteUser } from "@/libs/userAdmin";
import deleteUser from "@/libs/deleteUser";

// ==================
// Auth Actions
// ==================

// สมัครสมาชิก (Public — ไม่ต้อง login)
export async function registerAction(
  name: string,
  tel: string,
  email: string,
  password: string
) {
  try {
    const result = await userRegister(name, tel, email, password);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ลบ account ตัวเอง (Extra Credit)
export async function deleteAccountAction() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await deleteAccount(session.user.token);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Booking Actions
// ==================

// สร้าง Booking ใหม่ (Step 4) — รองรับ optional roomServices array
export async function createBookingAction(
  hotelId: string,
  bookingDate: string,
  numOfNights: number,
  roomServices: { service: string; quantity: number }[] = []
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await createBooking(
      session.user.token,
      hotelId,
      bookingDate,
      numOfNights,
      roomServices
    );

    // Refresh หน้า mybooking เพื่อแสดงข้อมูลใหม่
    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// แก้ไข Booking (Step 6 สำหรับ user, Step 11 สำหรับ admin)
export async function updateBookingAction(
  bookingId: string,
  bookingDate: string,
  numOfNights: number,
  hotelId?: string  // optional: admin ใช้เพื่อเปลี่ยนโรงแรม
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await updateBooking(
      session.user.token,
      bookingId,
      bookingDate,
      numOfNights,
      hotelId
    );

    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Soft cancel — flips status to 'cancelled', preserves the row for history.
export async function cancelBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  try {
    const result = await cancelBooking(session.user.token, bookingId);
    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");
    revalidatePath(`/booking/${bookingId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ลบ Booking (Step 7 สำหรับ user, Step 12 สำหรับ admin)
export async function deleteBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }

  try {
    const result = await deleteBooking(session.user.token, bookingId);

    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Hotel Actions (Admin Only)
// ==================

// สร้างโรงแรมใหม่ (picture จัดการใน Redux ไม่ส่ง Backend)
export async function createHotelAction(
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  if (session.user.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  try {
    const result = await createHotel(session.user.token, name, address, tel, picture, rating, description);

    revalidateTag("hotels");
    revalidatePath("/hotel");
    revalidatePath("/admin/hotels");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// แก้ไขโรงแรม (picture จัดการใน Redux ไม่ส่ง Backend)
export async function updateHotelAction(
  hotelId: string,
  name: string,
  address: string,
  tel: string,
  picture?: string,
  rating?: number,
  description?: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  if (session.user.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  try {
    const result = await updateHotel(
      session.user.token,
      hotelId,
      name,
      address,
      tel,
      picture,
      rating,
      description
    );

    revalidateTag("hotels");
    revalidatePath("/hotel");
    revalidatePath("/admin/hotels");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ลบโรงแรม (จะ cascade delete bookings ที่เกี่ยวข้องด้วย)
export async function deleteHotelAction(hotelId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) {
    return { success: false, message: "Not authenticated" };
  }
  if (session.user.role !== "admin") {
    return { success: false, message: "Admin only" };
  }

  try {
    const result = await deleteHotel(session.user.token, hotelId);

    revalidateTag("hotels");
    revalidatePath("/hotel");
    revalidatePath("/admin/hotels");
    revalidatePath("/mybooking");
    revalidatePath("/admin/bookings");

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Read Actions (สำหรับ client components ที่ต้อง fetch data)
// ==================

// ==================
// Read Actions (for client components that can't access BACKEND_URL directly)
// ==================

export async function fetchHotelServicesAction(hotelId: string) {
  try {
    const result = await getRoomServices(hotelId);
    return { success: true, data: result.data ?? [] };
  } catch (error: any) {
    return { success: false, message: error.message, data: [] };
  }
}

// ==================
// Review Actions
// ==================

export async function submitReviewAction(hotelId: string, score: number, comment: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await createReview(session.user.token, hotelId, score, comment);
    revalidatePath(`/hotel/${hotelId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateReviewAction(
  reviewId: string,
  hotelId: string,
  patch: { score?: number; comment?: string }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await updateReview(session.user.token, reviewId, patch);
    revalidatePath(`/hotel/${hotelId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteReviewAction(reviewId: string, hotelId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await deleteReview(session.user.token, reviewId);
    revalidatePath(`/hotel/${hotelId}`);
    revalidatePath("/admin/reviews");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function voteReviewAction(reviewId: string, value: VoteValue) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Sign in to vote" };
  try {
    const result = await voteReview(session.user.token, reviewId, value);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// RoomService Actions
// ==================

export async function createRoomServiceAction(
  hotelId: string,
  payload: { name: string; description?: string; price?: number; dailyCapacity?: number | null; active?: boolean }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await createRoomService(session.user.token, hotelId, payload);
    revalidatePath(`/admin/roomservices`);
    revalidatePath(`/admin/roomservices/${hotelId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateRoomServiceAction(
  serviceId: string,
  hotelId: string,
  patch: { name?: string; description?: string; price?: number; dailyCapacity?: number | null; active?: boolean }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await updateRoomService(session.user.token, serviceId, patch);
    revalidatePath(`/admin/roomservices`);
    revalidatePath(`/admin/roomservices/${hotelId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteRoomServiceAction(serviceId: string, hotelId: string, hard = false) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await deleteRoomService(session.user.token, serviceId, hard);
    revalidatePath(`/admin/roomservices`);
    revalidatePath(`/admin/roomservices/${hotelId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// Booking lifecycle Actions (admin)
// ==================

export async function checkInBookingAction(bookingId: string, force = false) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await checkinBooking(session.user.token, bookingId, { force });
    revalidatePath("/admin/bookings");
    revalidatePath("/mybooking");
    revalidatePath(`/booking/${bookingId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function completeBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await completeBooking(session.user.token, bookingId);
    revalidatePath("/admin/bookings");
    revalidatePath("/mybooking");
    revalidatePath(`/booking/${bookingId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function payBookingAction(bookingId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await payBooking(session.user.token, bookingId);
    revalidatePath("/mybooking");
    revalidatePath(`/booking/${bookingId}`);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ==================
// User Admin Actions (ban / unban / promote / demote)
//
// Each is an explicit exported async function — Next.js Server Actions are looked up
// by a build-time hash that requires top-level async function declarations. A factory
// returning closures works in dev but is fragile under production minification.
// ==================

export async function banUserAction(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await banUser(session.user.token, userId);
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function unbanUserAction(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await unbanUser(session.user.token, userId);
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function promoteUserAction(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await promoteUser(session.user.token, userId);
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function demoteUserAction(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  try {
    const result = await demoteUser(session.user.token, userId);
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// Hard-delete another user's account (admin only).
// Defence-in-depth: refuse self-target even though the UI hides the button for the
// current admin's own row. Backend MUST also enforce admin role and reject self-delete.
export async function deleteUserAction(userId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.token) return { success: false, message: "Not authenticated" };
  if (session.user.role !== "admin") return { success: false, message: "Admin only" };
  // Validate Mongo ObjectId format before it reaches URL interpolation. Backend
  // rejects malformed IDs too, but failing fast here keeps junk out of fetch().
  if (!/^[a-f0-9]{24}$/i.test(userId)) {
    return { success: false, message: "Invalid user ID" };
  }
  if (session.user._id === userId) {
    return { success: false, message: "You cannot delete your own account from this screen." };
  }
  try {
    const result = await deleteUser(session.user.token, userId);
    revalidatePath("/admin/users");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ดึง hotels ทั้งหมด (ใช้ใน admin/hotels page ที่เป็น client component)
export async function getHotelsAction() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/hotels`,
      { cache: "no-store" }
    );
    if (!response.ok) {
      const body = await response.clone().json().catch(() => null);
      throw new Error(body?.message || body?.error || `Could not load hotels (${response.status})`);
    }
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.message, data: [] };
  }
}
