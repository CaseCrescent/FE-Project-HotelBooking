"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkInBookingAction, completeBookingAction, cancelBookingAction } from "@/app/actions";

// Inline admin-only row that flips booking status (check-in / complete / cancel).
// Rendered inside BookingCard when isAdmin && status !== 'cancelled'.
export default function AdminBookingStatusControl({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyVerb, setBusyVerb] = useState<string | null>(null);

  const run = (verb: string, fn: () => Promise<{ success: boolean; message?: string }>) => {
    setBusyVerb(verb);
    startTransition(async () => {
      const res = await fn();
      setBusyVerb(null);
      if (res.success) {
        toast.success(`Booking ${verb}`);
        router.refresh();
      } else {
        toast.error(res.message || `Could not ${verb} booking`);
      }
    });
  };

  // Available transitions:
  //   confirmed   → Check-in (force allowed), Complete (skip), Cancel
  //   checked_in  → Complete, Cancel
  //   completed   → (none)
  //   cancelled   → (handled by caller — control is hidden)
  const canCheckIn = status === "confirmed";
  const canComplete = status === "confirmed" || status === "checked_in";
  const canCancel = status !== "completed";

  return (
    <div className="mt-2 pt-3 border-t border-[#dcb771]/15 flex flex-wrap gap-2">
      <span className="text-[10px] uppercase tracking-widest text-gold/70 mr-1 self-center">
        Admin
      </span>
      {canCheckIn && (
        <AdminPill
          label={busyVerb === "checked in" && pending ? "Checking in…" : "Check in"}
          color="emerald"
          disabled={pending}
          onClick={() => run("checked in", () => checkInBookingAction(bookingId, true))}
        />
      )}
      {canComplete && (
        <AdminPill
          label={busyVerb === "completed" && pending ? "Completing…" : "Complete"}
          color="blue"
          disabled={pending}
          onClick={() => run("completed", () => completeBookingAction(bookingId))}
        />
      )}
      {canCancel && (
        <AdminPill
          label={busyVerb === "cancelled" && pending ? "Cancelling…" : "Cancel"}
          color="red"
          disabled={pending}
          onClick={() => run("cancelled", () => cancelBookingAction(bookingId))}
        />
      )}
    </div>
  );
}

function AdminPill({
  label,
  color,
  disabled,
  onClick,
}: {
  label: string;
  color: "emerald" | "blue" | "red";
  disabled?: boolean;
  onClick: () => void;
}) {
  const style =
    color === "emerald"
      ? "border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/10"
      : color === "blue"
      ? "border-blue-400/40 text-blue-200 hover:bg-blue-500/10"
      : "border-red-400/40 text-red-200 hover:bg-red-500/10";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-widest transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${style}`}
    >
      {label}
    </button>
  );
}
