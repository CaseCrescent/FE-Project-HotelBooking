// ===========================================
// src/components/BookingSummaryPanel.tsx
// Booking Summary — right panel extracted from BookingForm
// ===========================================

import { Dayjs } from "dayjs";

interface BookingSummaryPanelProps {
  hotelName?: string;
  bookDate: Dayjs | null;
  checkoutDate: Dayjs | null;
  numOfNights: number;
  isOverLimit: boolean;
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "12px",
        marginBottom: "12px",
      }}
    >
      <span style={{ fontSize: "12px", color: "#6b7280", flexShrink: 0, paddingTop: "2px" }}>
        {label}
      </span>
      <span
        style={{
          fontSize: "14px",
          color: highlight ? "#e5e7eb" : "#4b5563",
          fontWeight: highlight ? "500" : "400",
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const summaryCardStyle: React.CSSProperties = {
  backgroundColor: "#1a1730",
  borderRadius: "16px",
  padding: "32px",
  border: "1px solid rgba(220,183,113,0.1)",
  position: "sticky",
  top: "80px",
};

const sectionTitleStyle: React.CSSProperties = {
  color: "#dcb771",
  fontSize: "14px",
  fontWeight: "700",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom: "0",
};

export default function BookingSummaryPanel({
  hotelName,
  bookDate,
  checkoutDate,
  numOfNights,
  isOverLimit,
}: BookingSummaryPanelProps) {
  return (
    <div style={summaryCardStyle}>
      <h2 style={sectionTitleStyle}>Booking Summary</h2>

      <div style={{ marginTop: "20px" }}>
        <SummaryRow label="Hotel" value={hotelName || "—"} highlight={!!hotelName} />
      </div>

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "16px 0" }} />

      <SummaryRow
        label="Check-in"
        value={bookDate ? bookDate.format("DD MMM YYYY") : "—"}
        highlight={!!bookDate}
      />
      <SummaryRow
        label="Check-out"
        value={checkoutDate ? checkoutDate.format("DD MMM YYYY") : "—"}
        highlight={!!checkoutDate}
      />

      <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", margin: "16px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>Duration</span>
        <span
          style={{
            fontSize: "22px",
            fontWeight: "700",
            color: isOverLimit ? "#ef4444" : "#dcb771",
          }}
        >
          {numOfNights} {numOfNights === 1 ? "Night" : "Nights"}
        </span>
      </div>

      {/* Visual night indicators */}
      <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
        {Array.from({ length: Math.min(numOfNights, 7) }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: "6px",
              borderRadius: "3px",
              background: isOverLimit ? "#ef4444" : "#dcb771",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}