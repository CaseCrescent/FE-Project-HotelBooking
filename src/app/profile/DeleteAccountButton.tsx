"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await deleteAccountAction();
      if (res.success) {
        toast.success("Account deleted");
        await signOut({ callbackUrl: "/" });
      } else {
        toast.error(res.message || "Failed to delete account.");
        setDeleting(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full block text-center px-6 py-3.5 rounded-full border border-red-500/40 bg-red-500/[0.08] text-red-300 text-xs tracking-widest uppercase font-bold hover:bg-red-500/20 hover:border-red-500/70 transition-colors"
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
        <DialogTitle sx={{ color: "#ef4444", fontWeight: 700 }}>
          Delete Account
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>
            Are you sure you want to permanently delete your account? All your bookings will be removed
            and <strong style={{ color: "white" }}>this cannot be undone</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setOpen(false)} disabled={deleting} sx={{ color: "rgba(255,255,255,0.5)", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleting}
            variant="contained"
            sx={{
              backgroundColor: "#ef4444",
              color: "white",
              borderRadius: "999px",
              px: 3,
              fontWeight: 700,
              letterSpacing: 1.2,
              textTransform: "uppercase",
              minWidth: 140,
              "&:hover": { backgroundColor: "#dc2626" },
              "&:disabled": { backgroundColor: "#555" },
            }}
          >
            {deleting ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <CircularProgress size={16} sx={{ color: "white" }} />
                Deleting…
              </span>
            ) : (
              "Delete account"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
