// ===========================================
// src/components/BookingForm.tsx
// Booking Form — Restored Original Design + MUI DatePicker
// ===========================================

"use client";
import { useState } from "react";
import { Slider } from "@mui/material";
// นำ DateReserve ของคุณกลับมาใช้
import DateReserve from "@/components/DateReserve";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { createBookingAction, updateBookingAction } from "@/app/actions";
import BookingSummaryPanel from "@/components/BookingSummaryPanel";

export default function BookingForm({ mode, hotels, initialHotelId, initialData }: any) {
  const router = useRouter();

  const [hotelId, setHotelId] = useState(initialHotelId || (hotels?.length > 0 ? hotels[0]._id : ""));
  
  // กลับมาใช้ State แบบ Dayjs | null สำหรับ MUI DatePicker
  const [bookDate, setBookDate] = useState<Dayjs | null>(
    initialData?.bookingDate ? dayjs(initialData.bookingDate) : null
  );
  const [numOfNights, setNumOfNights] = useState<number>(initialData?.numOfNights || 1);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedHotel = hotels?.find((h: any) => h._id === hotelId);
  const checkoutDate = bookDate ? bookDate.add(numOfNights, 'day') : null;

  const isOverLimit = numOfNights > 3;

  const handleSubmit = async () => {
    setError("");
    if (!hotelId) { setError("Please select a hotel."); return; }
    if (!bookDate) { setError("Please select a check-in date."); return; }
    if (numOfNights < 1 || isOverLimit) {
      setError("Maximum 3 nights per booking. Please reduce the number of nights."); return;
    }

    setLoading(true);
    try {
      const formattedDate = bookDate.format("YYYY-MM-DD");
      let res;
      if (mode === "create") {
        res = await createBookingAction(hotelId, formattedDate, numOfNights);
      } else {
        // ส่ง hotelId ด้วยเผื่อ admin เปลี่ยนโรงแรม
        res = await updateBookingAction(initialData.bookingId, formattedDate, numOfNights, hotelId || undefined);
      }

      if (res?.success) {
        router.push("/mybooking");
      } else {
        setError(res?.message || "Booking failed. Please try again.");
      }
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={twoColStyle}>
      {/* LEFT: Form */}
      <div style={formCardStyle}>
        <h2 style={sectionTitleStyle}>Booking Details</h2>

        {/* Select Hotel */}
        <div style={fieldGroup}>
          <label style={labelStyle}>
            <span style={labelIconStyle}>🏨</span> Select Hotel
          </label>
          <select
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            style={selectStyle}
          >
            <option value="" disabled style={{ color: "black" }}>— Choose a hotel —</option>
            {hotels?.map((h: any) => (
              <option key={h._id} value={h._id} style={{ color: "black" }}>
                {h.name}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in Date (เรียกใช้ MUI DatePicker ที่เราตั้งค่ากล่องใหม่ให้กลืนกับดีไซน์) */}
        <div style={fieldGroup}>
          <label style={labelStyle}>
            <span style={labelIconStyle}>📅</span> Check-in Date
          </label>
          <DateReserve label="" value={bookDate} onDateChange={(val: any) => setBookDate(val)} />
        </div>

        {/* Number of Nights (Input + Slider) */}
        <div style={fieldGroup}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={labelStyle}>
              <span style={labelIconStyle}>🌙</span> Number of Nights
            </label>
            <input
              type="number"
              min={1}
              max={7}
              value={numOfNights}
              onChange={(e) => setNumOfNights(Number(e.target.value))}
              style={{
                ...inputStyle,
                width: "70px",
                padding: "8px",
                textAlign: "center",
                borderColor: isOverLimit ? "#ef4444" : "rgba(255,255,255,0.1)",
                color: isOverLimit ? "#ef4444" : "#dcb771",
                fontWeight: "bold",
              }}
            />
          </div>

          <div style={{ padding: "0 10px", marginTop: "8px" }}>
            <Slider
              value={numOfNights}
              onChange={(_, val) => setNumOfNights(val as number)}
              step={1}
              marks
              min={1}
              max={7}
              valueLabelDisplay="auto"
              sx={{
                color: isOverLimit ? "#ef4444" : "#dcb771",
                "& .MuiSlider-mark": { backgroundColor: "rgba(255,255,255,0.2)" },
                "& .MuiSlider-markActive": { backgroundColor: "#fff" }
              }}
            />
          </div>

          {isOverLimit && (
            <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "4px" }}>
              * Maximum 3 nights per booking.
            </p>
          )}
        </div>

        {/* Error Banner */}
        {error && (
          <div style={errorBannerStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fca5a5" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "15px",
            borderRadius: "12px",
            border: "none",
            background: loading
              ? "rgba(255,255,255,0.1)"
              : "linear-gradient(135deg, #dcb771, #c5a059)",
            color: loading ? "#6b7280" : "#12102a",
            fontWeight: "700",
            fontSize: "16px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
            marginTop: "4px",
            letterSpacing: "0.3px",
            boxShadow: loading ? "none" : "0 8px 24px rgba(220,183,113,0.2)",
          }}
        >
          {loading ? "Confirming…" : mode === "create" ? "Confirm Booking" : "Update Booking"}
        </button>
      </div>

      {/* RIGHT: Summary */}
      <BookingSummaryPanel
        hotelName={selectedHotel?.name}
        bookDate={bookDate}
        checkoutDate={checkoutDate}
        numOfNights={numOfNights}
        isOverLimit={isOverLimit}
      />
    </div>
  );
}

// ===========================================
// Styles
// ===========================================

const twoColStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 340px",
  gap: "24px",
  alignItems: "start",
};

const formCardStyle: React.CSSProperties = {
  backgroundColor: "#1a1730",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "24px",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#dcb771",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom: "0",
};

const fieldGroup: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const labelStyle: React.CSSProperties = {
  color: "#9ca3af",
  fontSize: "13px",
  fontWeight: "500",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const labelIconStyle: React.CSSProperties = {
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "12px 16px",
  color: "#e5e7eb",
  fontSize: "15px",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
  colorScheme: "dark",
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: "pointer",
  appearance: "auto",
};

const errorBannerStyle: React.CSSProperties = {
  background: "rgba(239,68,68,0.1)",
  border: "1px solid rgba(239,68,68,0.3)",
  borderRadius: "10px",
  padding: "12px 16px",
  color: "#fca5a5",
  fontSize: "14px",
  display: "flex",
  gap: "8px",
  alignItems: "flex-start",
};