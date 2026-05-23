"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import {
  banUserAction,
  unbanUserAction,
  promoteUserAction,
  demoteUserAction,
  deleteUserAction,
} from "@/app/actions";
import type { UserAdminRow } from "@/libs/getUsers";

type Verb = "ban" | "unban" | "promote" | "demote" | "delete";

const ACTIONS: Record<Verb, (id: string) => Promise<{ success: boolean; message?: string }>> = {
  ban: banUserAction,
  unban: unbanUserAction,
  promote: promoteUserAction,
  demote: demoteUserAction,
  delete: deleteUserAction,
};

const LABELS: Record<Verb, string> = {
  ban: "banned",
  unban: "unbanned",
  promote: "promoted",
  demote: "demoted",
  delete: "deleted",
};

export default function AdminUsersTable({
  users,
  currentUserId,
}: {
  users: UserAdminRow[];
  currentUserId?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [pendingId, setPendingId] = useState<string | null>(null);
  // Delete is destructive — gate it behind a confirmation dialog instead of firing
  // the same way as ban/promote. `deleteTarget` holds the row that the admin clicked
  // Delete on; null means the dialog is closed.
  const [deleteTarget, setDeleteTarget] = useState<UserAdminRow | null>(null);
  // Explicit state for the dialog's in-flight gate. Mirrors the hotel-delete pattern in
  // /admin/hotels — more reliable inside MUI's onClose callback than reading the
  // transition's `pending` flag, which is only guaranteed consistent inside React events.
  const [isDeleting, setIsDeleting] = useState(false);

  const run = (userId: string, verb: Exclude<Verb, "delete">) => {
    setPendingId(userId);
    startTransition(async () => {
      const res = await ACTIONS[verb](userId);
      setPendingId(null);
      if (res.success) {
        toast.success(`User ${LABELS[verb]}`);
        router.refresh();
      } else {
        toast.error(res.message || `Could not ${verb} user`);
      }
    });
  };

  const confirmDelete = () => {
    if (!deleteTarget || isDeleting) return;
    const userId = deleteTarget._id;
    setPendingId(userId);
    setIsDeleting(true);
    startTransition(async () => {
      const res = await ACTIONS.delete(userId);
      setPendingId(null);
      setIsDeleting(false);
      if (res.success) {
        toast.success(`User ${LABELS.delete}`);
        setDeleteTarget(null);
        router.refresh();
      } else {
        toast.error(res.message || "Could not delete user");
        // Keep the dialog open on failure so the admin sees the error in context.
      }
    });
  };

  if (users.length === 0) {
    return (
      <div className="glass-card p-10 text-center">
        <p className="text-white/55 text-sm">No users to show.</p>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/[0.03] text-[10px] uppercase tracking-widest text-white/45">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Email</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isMe = u._id === currentUserId;
                const busy = pending && pendingId === u._id;
                return (
                  <tr key={u._id} className="border-t border-white/[0.05]">
                    <td className="px-4 py-3">
                      <div className="text-white font-semibold truncate max-w-[200px]">{u.name}</div>
                      <div className="text-white/40 text-xs md:hidden">{u.email}</div>
                    </td>
                    <td className="px-4 py-3 text-white/65 hidden md:table-cell truncate max-w-[260px]">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] uppercase tracking-widest font-bold px-2 py-[2px] rounded-full ${
                          u.role === "admin"
                            ? "bg-[#dcb771]/15 text-[#f5d78e] border border-[#dcb771]/30"
                            : "bg-white/[0.04] text-white/60 border border-white/10"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {u.banned ? (
                        <span className="text-[10px] uppercase tracking-widest text-red-300 border border-red-400/30 rounded-full px-2 py-[2px]">
                          Banned
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest text-emerald-300/80 border border-emerald-400/20 rounded-full px-2 py-[2px]">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isMe ? (
                        <span className="text-white/40 text-xs italic">— you —</span>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 justify-end">
                          {u.role === "user" ? (
                            <ActionBtn label="Promote" onClick={() => run(u._id, "promote")} disabled={busy} color="gold" />
                          ) : (
                            <ActionBtn label="Demote" onClick={() => run(u._id, "demote")} disabled={busy} color="white" />
                          )}
                          {u.banned ? (
                            <ActionBtn label="Unban" onClick={() => run(u._id, "unban")} disabled={busy} color="emerald" />
                          ) : (
                            <ActionBtn label="Ban" onClick={() => run(u._id, "ban")} disabled={busy} color="red" />
                          )}
                          <ActionBtn label="Delete" onClick={() => setDeleteTarget(u)} disabled={busy} color="red-solid" />
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={!!deleteTarget}
        onClose={() => {
          // Don't let the admin dismiss mid-flight — they need the toast feedback first.
          if (isDeleting) return;
          setDeleteTarget(null);
        }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#12101f",
              color: "white",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "#dcb771" }}>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.55)" }}>
            Delete{" "}
            <strong style={{ color: "white" }}>{deleteTarget?.name}</strong>?
            Their bookings and reviews will be removed. This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteTarget(null)}
            disabled={isDeleting}
            sx={{ color: "rgba(255,255,255,0.5)", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={confirmDelete}
            disabled={isDeleting}
            variant="contained"
            sx={{
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "999px",
              px: 3,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function ActionBtn({
  label,
  onClick,
  disabled,
  color,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  color: "gold" | "white" | "red" | "emerald" | "red-solid";
}) {
  const style =
    color === "gold"
      ? "border-[#dcb771]/40 text-gold hover:bg-[#dcb771]/10"
      : color === "emerald"
      ? "border-emerald-400/40 text-emerald-200 hover:bg-emerald-500/10"
      : color === "red"
      ? "border-red-400/40 text-red-200 hover:bg-red-500/10"
      : color === "red-solid"
      ? "border-red-500/60 bg-red-500/15 text-red-200 hover:bg-red-500/25"
      : "border-white/15 text-white/75 hover:bg-white/[0.04]";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-widest font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${style}`}
    >
      {label}
    </button>
  );
}
