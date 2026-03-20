// ===========================================
// src/components/BookingCard.tsx
// Single Booking Card (Client Component)
// - แสดงข้อมูล booking 1 รายการ: ชื่อ hotel, วันที่, จำนวนคืน
// - มีปุ่ม Edit (สีทอง) + Delete (สีแดง พร้อม confirm dialog)
// - ดีไซน์อิงจากเว็บ Venue (BookingList.tsx) โดย:
//   1. เพิ่มปุ่ม Edit (Venue มีแค่ Cancel)
//   2. เพิ่ม confirmation dialog ก่อน delete (แก้จุดด้อย Venue)
//   3. แสดง numOfNights (Venue ไม่มี)
//   4. เรียก Server Action แทน Redux dispatch
// ===========================================

"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { deleteBookingAction } from "@/app/actions";
import dayjs from "dayjs";

export default function BookingCard({
  bookingId,
  hotelName,
  hotelAddress,
  bookingDate,
  numOfNights,
  isAdmin,
  userName,
  editPath,
}: {
  bookingId: string;
  hotelName: string;
  hotelAddress?: string;
  bookingDate: string;
  numOfNights: number;
  isAdmin?: boolean; // แสดงชื่อ user ด้วยถ้าเป็น admin
  userName?: string;
  editPath: string; // path สำหรับหน้า edit (/mybooking/edit/[id] หรือ /admin/bookings/edit/[id])
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Format วันที่ให้อ่านง่าย
  const formattedDate = dayjs(bookingDate).format("DD MMM YYYY");
  const checkoutDate = dayjs(bookingDate)
    .add(numOfNights, "day")
    .format("DD MMM YYYY");

  // ===== Delete Handler =====
  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const result = await deleteBookingAction(bookingId);
      if (result.success) {
        setDeleteDialogOpen(false);
        router.refresh();
      } else {
        setError(result.message || "Failed to delete booking.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* ===== Booking Card ===== */}
      {/* ดีไซน์เหมือน booking card ของเว็บ Venue (กล่อง #1a1730 + gradient border) */}
      <div
        className="p-6 rounded-2xl flex flex-col gap-4 animate-fade-in"
        style={{
          backgroundColor: "#1a1730",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(220, 183, 113, 0.1)",
        }}
      >
        {/* ===== Header: Hotel name ===== */}
        <div
          className="pb-3 mb-1"
          style={{ borderBottom: "1px solid #333" }}
        >
          <h2 className="text-[#dcb771] text-xl font-bold text-center">
            {hotelName}
          </h2>
          {hotelAddress && (
            <p className="text-[#9ca3af] text-xs text-center mt-1">
              {hotelAddress}
            </p>
          )}
        </div>

        {/* ===== Booking Details ===== */}
        <div className="flex flex-col gap-3">
          {/* ถ้าเป็น admin → แสดงชื่อ user ที่จอง */}
          {isAdmin && userName && (
            <div className="flex justify-between items-center">
              <span className="text-[#9ca3af] text-sm">Booked by</span>
              <span className="text-white text-sm font-medium">
                {userName}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-[#9ca3af] text-sm">Check-in</span>
            <span className="text-white text-sm">{formattedDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#9ca3af] text-sm">Check-out</span>
            <span className="text-white text-sm">{checkoutDate}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#9ca3af] text-sm">Nights</span>
            <span className="text-[#dcb771] text-sm font-bold">
              {numOfNights} {numOfNights === 1 ? "Night" : "Nights"}
            </span>
          </div>
        </div>

        {/* ===== Error Message ===== */}
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {/* ===== Action Buttons (Edit + Delete) ===== */}
        <div className="flex gap-3 mt-2">
          {/* Edit Button (สีทอง — ใหม่ ไม่มีในเว็บ Venue) */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => router.push(editPath)}
            sx={{
              color: "#dcb771",
              borderColor: "#dcb771",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 0",
              "&:hover": {
                backgroundColor: "#dcb771",
                color: "#1a1730",
                borderColor: "#dcb771",
              },
            }}
          >
            Edit
          </Button>

          {/* Delete Button (สีแดง — เหมือน Cancel ของเว็บ Venue แต่เพิ่ม confirm) */}
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setDeleteDialogOpen(true)}
            sx={{
              color: "#ef4444",
              borderColor: "#ef4444",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px 0",
              "&:hover": {
                backgroundColor: "#ef4444",
                color: "white",
                borderColor: "#ef4444",
              },
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* ===== Confirmation Dialog (แก้จุดด้อย Venue ที่ลบทันทีไม่ถาม) ===== */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#1a1730",
              color: "white",
              borderRadius: "16px",
              border: "1px solid #333",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "#dcb771" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#9ca3af" }}>
            Are you sure you want to delete your booking at{" "}
            <strong style={{ color: "#dcb771" }}>{hotelName}</strong> on{" "}
            {formattedDate}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ color: "#9ca3af" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            sx={{
              backgroundColor: "#ef4444",
              color: "white",
              "&:hover": { backgroundColor: "#dc2626" },
              "&:disabled": { backgroundColor: "#555" },
              borderRadius: "8px",
              padding: "6px 20px",
            }}
            variant="contained"
          >
            {deleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
