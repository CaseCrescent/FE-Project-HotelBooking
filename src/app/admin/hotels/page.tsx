"use client";
import { useEffect, useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { useAppSelector, AppDispatch } from "@/redux/store";
import { setHotelMeta, getHotelMeta } from "@/redux/features/bookSlice";
import { createHotelAction, updateHotelAction, deleteHotelAction, getHotelsAction } from "@/app/actions";
import AdminHotelFormPanel from "@/components/admin/AdminHotelFormPanel";
import AdminHotelListPanel from "@/components/admin/AdminHotelListPanel";
import PageShell, { PageHeader } from "@/components/layout/PageShell";
import { SkeletonHotelGrid } from "@/components/shared/Skeletons";

type Hotel = {
  _id: string;
  name: string;
  address: string;
  tel: string;
  picture?: string;
  rating?: number;
  description?: string;
};

export default function AdminHotelsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const hotelMetaStore = useAppSelector((state) => state.bookSlice.hotelMeta);

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(true);

  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [tel, setTel] = useState("");
  const [picture, setPicture] = useState("");
  const [rating, setRating] = useState<number>(4);
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [deletingName, setDeletingName] = useState("");
  const [deleting, setDeleting] = useState(false);

  const fetchHotels = async () => {
    setLoadingHotels(true);
    try {
      const data = await getHotelsAction();
      setHotels(data.data || []);
    } catch {
      /* ignore */
    } finally {
      setLoadingHotels(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const handleSubmit = async () => {
    if (!name.trim()) return toast.error("Hotel name is required.");
    if (!address.trim()) return toast.error("Address is required.");
    if (!tel.trim()) return toast.error("Telephone is required.");

    setSubmitting(true);
    try {
      const result =
        formMode === "create"
          ? await createHotelAction(name, address, tel, picture || undefined, rating, description || undefined)
          : await updateHotelAction(editingId, name, address, tel, picture || undefined, rating, description || undefined);

      if (result.success) {
        const hId = formMode === "create" ? result.data?.data?._id : editingId;
        if (hId) {
          dispatch(
            setHotelMeta({
              hotelId: hId,
              meta: {
                rating,
                description: description || "Hotel",
                picture: picture || undefined,
                // Store undefined (not 0) so the ?? fallback chain in HotelCard works.
                price: price > 0 ? price : undefined,
              },
            })
          );
        }
        toast.success(formMode === "create" ? "Hotel created" : "Hotel updated");
        resetForm();
        await fetchHotels();
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (h: Hotel) => {
    setFormMode("edit");
    setEditingId(h._id);
    setName(h.name);
    setAddress(h.address);
    setTel(h.tel);
    setPicture(h.picture || "");
    const m = getHotelMeta(hotelMetaStore, h._id, h.name);
    setRating(h.rating ?? m.rating);
    setDescription(h.description ?? m.description);
    setPrice(m.price ?? 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setFormMode("create");
    setEditingId("");
    setName("");
    setAddress("");
    setTel("");
    setPicture("");
    setRating(4);
    setPrice(0);
    setDescription("");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const result = await deleteHotelAction(deletingId);
      if (result.success) {
        setDeleteDialogOpen(false);
        toast.success("Hotel deleted");
        await fetchHotels();
      } else {
        toast.error(result.message || "Failed.");
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageShell wide>
      <PageHeader
        eyebrow="Admin console"
        title="Manage Hotels"
        description="Add, edit, or remove hotels from the platform."
      />

      <div className="grid lg:grid-cols-[420px_1fr] gap-6 lg:gap-8 items-start">
        <AdminHotelFormPanel
          formMode={formMode}
          name={name}
          setName={setName}
          address={address}
          setAddress={setAddress}
          tel={tel}
          setTel={setTel}
          picture={picture}
          setPicture={setPicture}
          rating={rating}
          setRating={setRating}
          price={price}
          setPrice={setPrice}
          description={description}
          setDescription={setDescription}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <div className="min-w-0">
          {loadingHotels ? (
            <SkeletonHotelGrid count={6} />
          ) : (
            <AdminHotelListPanel
              hotels={hotels}
              loadingHotels={loadingHotels}
              hotelMetaStore={hotelMetaStore}
              onEdit={startEdit}
              onDeleteRequest={(h) => {
                setDeletingId(h._id);
                setDeletingName(h.name);
                setDeleteDialogOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
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
        <DialogTitle sx={{ color: "#dcb771" }}>Delete Hotel</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "rgba(255,255,255,0.55)" }}>
            Delete <strong style={{ color: "white" }}>{deletingName}</strong>? All associated bookings will also be removed.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: "rgba(255,255,255,0.5)", textTransform: "none" }}>
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
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            {deleting ? "Deleting…" : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageShell>
  );
}
