"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { cancelBookingAction, deleteBookingAction } from "@/app/actions";
import dayjs from "dayjs";
import StatusPill from "@/components/shared/StatusPill";
import AdminBookingStatusControl from "@/components/admin/AdminBookingStatusControl";
import { HOVER_LIFT } from "@/lib/animations";

export interface BookedService {
  service: string | { _id: string; name?: string };
  name?: string;
  price?: number;
  quantity?: number;
}

export default function BookingCard({
  bookingId,
  hotelName,
  hotelAddress,
  bookingDate,
  numOfNights,
  isAdmin,
  userName,
  editPath,
  status,
  paymentStatus,
  confirmationNumber,
  roomServices,
}: {
  bookingId: string;
  hotelName: string;
  hotelAddress?: string;
  bookingDate: string;
  numOfNights: number;
  isAdmin?: boolean;
  userName?: string;
  editPath: string;
  status?: string;
  paymentStatus?: string;
  confirmationNumber?: string;
  roomServices?: BookedService[];
}) {
  const router = useRouter();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const formattedDate = dayjs(bookingDate).format("DD MMM YYYY");
  const checkoutDate = dayjs(bookingDate).add(numOfNights, "day").format("DD MMM YYYY");

  const isActive = !status || status === "confirmed" || status === "checked_in";

  const handleCancel = async () => {
    setBusy(true);
    try {
      const r = await cancelBookingAction(bookingId);
      if (r.success) {
        toast.success("Booking cancelled");
        setCancelOpen(false);
        router.refresh();
      } else {
        toast.error(r.message || "Failed to cancel.");
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      const r = await deleteBookingAction(bookingId);
      if (r.success) {
        toast.success("Booking removed");
        setDeleteOpen(false);
        router.refresh();
      } else {
        toast.error(r.message || "Failed to delete.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -4 }}
        transition={HOVER_LIFT}
        className="glass-card p-6 flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="min-w-0">
            <h2 className="text-gold text-lg font-bold truncate">{hotelName}</h2>
            {hotelAddress && <p className="text-white/45 text-xs mt-0.5 truncate">{hotelAddress}</p>}
            {confirmationNumber && (
              <p className="text-white/30 text-[10px] mt-1 tracking-widest uppercase">{confirmationNumber}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusPill status={status} />
            {paymentStatus === "paid" ? (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-sm uppercase tracking-widest border border-emerald-200">Paid</span>
            ) : paymentStatus === "pending" ? (
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-sm uppercase tracking-widest border border-amber-200">Payment Pending</span>
            ) : null}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2">
          {isAdmin && userName && (
            <Row label="Booked by" value={userName} />
          )}
          <Row label="Check-in" value={formattedDate} />
          <Row label="Check-out" value={checkoutDate} />
          <Row label="Nights" value={`${numOfNights} ${numOfNights === 1 ? "Night" : "Nights"}`} highlight />
          {roomServices && roomServices.length > 0 && (
            <div className="mt-1 pt-2 border-t border-white/[0.05]">
              <div className="text-white/45 text-[10px] uppercase tracking-widest mb-1">Add-ons</div>
              <ul className="flex flex-col gap-0.5">
                {roomServices.map((s, i) => {
                  const name = s.name || (typeof s.service === "object" ? s.service?.name : null) || "Service";
                  const qty = s.quantity ?? 1;
                  const price = s.price ?? 0;
                  return (
                    <li key={i} className="flex justify-between text-xs text-white/70">
                      <span className="truncate">{name} × {qty}</span>
                      <span className="tabular-nums text-gold-light flex-shrink-0 ml-2">
                        {price === 0 ? "Included" : `฿${(price * qty).toLocaleString()}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Link
            href={`/booking/${bookingId}`}
            className="flex-1 min-w-[120px] text-center px-4 py-2.5 rounded-lg border border-white/15 text-white/85 text-xs uppercase tracking-widest font-semibold hover:bg-white/[0.05]"
          >
            View ticket
          </Link>

          {isActive && (
            <>
              <Button
                variant="outlined"
                onClick={() => router.push(editPath)}
                sx={{
                  flex: 1,
                  minWidth: 100,
                  color: "#dcb771",
                  borderColor: "rgba(220,183,113,0.5)",
                  fontWeight: 700,
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  fontSize: 11,
                  "&:hover": { backgroundColor: "rgba(220,183,113,0.1)", borderColor: "#dcb771" },
                }}
              >
                Edit
              </Button>

              <Button
                variant="outlined"
                onClick={() => setCancelOpen(true)}
                sx={{
                  flex: 1,
                  minWidth: 100,
                  color: "#fca5a5",
                  borderColor: "rgba(239,68,68,0.4)",
                  fontWeight: 700,
                  borderRadius: "8px",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  fontSize: 11,
                  "&:hover": { backgroundColor: "rgba(239,68,68,0.08)", borderColor: "#ef4444" },
                }}
              >
                Cancel
              </Button>
            </>
          )}

          {isAdmin && (
            <Button
              variant="outlined"
              onClick={() => setDeleteOpen(true)}
              sx={{
                flex: 1,
                minWidth: 100,
                color: "#ef4444",
                borderColor: "rgba(239,68,68,0.6)",
                fontWeight: 700,
                borderRadius: "8px",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                fontSize: 11,
                "&:hover": { backgroundColor: "#ef4444", color: "white", borderColor: "#ef4444" },
              }}
            >
              Delete
            </Button>
          )}
        </div>

        {/* Admin lifecycle control — inline status transitions */}
        {isAdmin && status && status !== "cancelled" && status !== "completed" && (
          <AdminBookingStatusControl bookingId={bookingId} status={status} />
        )}
      </motion.div>

      {/* Cancel confirm */}
      <ConfirmDialog
        open={cancelOpen}
        title="Cancel this booking?"
        body={
          <>
            Cancel your booking at <strong style={{ color: "#dcb771" }}>{hotelName}</strong> on {formattedDate}?
            Your booking will be kept on file as cancelled.
          </>
        }
        confirmLabel={busy ? "Cancelling…" : "Cancel booking"}
        confirmColor="#fca5a5"
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancel}
        busy={busy}
      />

      {/* Delete confirm (admin) */}
      <ConfirmDialog
        open={deleteOpen}
        title="Delete this booking?"
        body={
          <>
            Permanently delete the booking at <strong style={{ color: "#dcb771" }}>{hotelName}</strong> on {formattedDate}?
            This cannot be undone.
          </>
        }
        confirmLabel={busy ? "Deleting…" : "Delete"}
        confirmColor="#ef4444"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        busy={busy}
      />
    </>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/45 text-xs uppercase tracking-widest">{label}</span>
      <span className={`text-sm ${highlight ? "text-gold-light font-bold" : "text-white/85"}`}>{value}</span>
    </div>
  );
}

function ConfirmDialog({
  open,
  title,
  body,
  confirmLabel,
  confirmColor,
  onClose,
  onConfirm,
  busy,
}: {
  open: boolean;
  title: string;
  body: React.ReactNode;
  confirmLabel: string;
  confirmColor: string;
  onClose: () => void;
  onConfirm: () => void;
  busy: boolean;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#1a1730",
            color: "white",
            borderRadius: "16px",
            border: "1px solid rgba(220,183,113,0.18)",
            backdropFilter: "blur(12px)",
          },
        },
      }}
    >
      <DialogTitle sx={{ color: "#dcb771", fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "#9ca3af" }}>{body}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px" }}>
        <Button onClick={onClose} sx={{ color: "#9ca3af" }}>Cancel</Button>
        <Button
          onClick={onConfirm}
          disabled={busy}
          sx={{
            backgroundColor: confirmColor,
            color: "white",
            "&:hover": { backgroundColor: confirmColor, filter: "brightness(0.9)" },
            "&:disabled": { backgroundColor: "#555" },
            borderRadius: "8px",
            padding: "6px 20px",
            fontWeight: 700,
            letterSpacing: 1.1,
          }}
          variant="contained"
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
