// ===========================================
// src/components/DateReserve.tsx
// MUI Date Picker Wrapper (Client Component)
// - ใช้ @mui/x-date-pickers พร้อม dayjs adapter
// - โครงสร้างเดียวกับเว็บ Venue เดิม (DateReserve.tsx)
//   แต่เพิ่ม label prop เพื่อใช้ซ้ำได้หลายที่
// - รองรับ initial value สำหรับหน้า Edit
// - wrapper class "date-picker-wrap" สำหรับ brute-force CSS override ใน globals.css
// ===========================================

"use client";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";

export default function DateReserve({
  onDateChange,
  value,
  label,
}: {
  onDateChange?: (value: Dayjs | null) => void;
  value?: Dayjs | null;
  label?: string;
}) {
  return (
    // date-picker-wrap: CSS override target ใน globals.css
    <div className="date-picker-wrap">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label={label || ""}
          value={value || null}
          onChange={(newValue) => {
            if (onDateChange) onDateChange(newValue);
          }}
          sx={{
            width: "100%",
            "& .MuiInputBase-root": {
              backgroundColor: "rgba(255,255,255,0.04)",
              borderRadius: "10px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.1)",
                borderWidth: "1px",
              },
              "&:hover fieldset": {
                borderColor: "rgba(255,255,255,0.2)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#dcb771",
              },
            },
            "& .MuiSvgIcon-root": {
              color: "#9ca3af",
            },
          }}
          minDate={dayjs()}
        />
      </LocalizationProvider>
    </div>
  );
}