// ===========================================
// src/app/profile/DeleteAccountButton.tsx
// Client Component — Delete Account + SignOut
// - แสดงปุ่มสีแดง + confirmation dialog ก่อนลบ
// - เรียก deleteAccountAction (Server Action) → สำเร็จ → signOut
// ===========================================

"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import { deleteAccountAction } from "@/app/actions";

export default function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      const res = await deleteAccountAction();
      if (res.success) {
        await signOut({ callbackUrl: "/" });
      } else {
        setError(res.message || "Failed to delete account. Please try again.");
        setDeleting(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full transition-all duration-200 hover:-translate-y-0.5 hover:bg-red-500/20 hover:border-red-500/60 active:translate-y-0"
        style={{
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid rgba(239,68,68,0.45)",
          background: "rgba(239,68,68,0.12)",
          color: "#f87171",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Delete Account
      </button>

      <Dialog
        open={open}
        onClose={() => !deleting && setOpen(false)}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "#12101f",
              color: "white",
              borderRadius: "16px",
              border: "1px solid rgba(255,255,255,0.08)",
              maxWidth: "420px",
              width: "100%",
            },
          },
        }}
      >
        <DialogTitle sx={{ color: "#ef4444", fontWeight: "700" }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
            Are you sure you want to permanently delete your account?
            All your bookings will be removed and{" "}
            <strong style={{ color: "white" }}>this cannot be undone</strong>.
          </DialogContentText>
          {error && (
            <p style={{ color: "#fca5a5", fontSize: "13px", marginTop: "12px" }}>
              {error}
            </p>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={deleting}
            sx={{ color: "rgba(255,255,255,0.3)", textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "8px",
              px: 3,
              textTransform: "none",
              minWidth: "140px",
              "&:hover": { backgroundColor: "#dc2626" },
              "&:disabled": { backgroundColor: "#555" },
            }}
          >
            {deleting ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CircularProgress size={16} sx={{ color: "white" }} />
                Deleting...
              </span>
            ) : (
              "Delete Account"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}