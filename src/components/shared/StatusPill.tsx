type BookingStatus = "confirmed" | "cancelled" | "completed" | "checked_in" | string;

const LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  completed: "Completed",
  checked_in: "Checked-in",
};

export default function StatusPill({ status }: { status?: BookingStatus }) {
  const key = (status || "confirmed").toLowerCase();
  const klass = ["confirmed", "cancelled", "completed", "checked_in"].includes(key) ? key : "confirmed";
  return (
    <span className={`status-pill ${klass}`}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", opacity: 0.85 }} />
      {LABELS[key] || key}
    </span>
  );
}
