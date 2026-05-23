"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  createRoomServiceAction,
  updateRoomServiceAction,
  deleteRoomServiceAction,
} from "@/app/actions";
import type { RoomServiceItem } from "@/libs/getRoomServices";
import { HOUSE_EASE } from "@/lib/animations";

interface FormState {
  name: string;
  description: string;
  price: string;
  dailyCapacity: string;
  active: boolean;
}

const EMPTY: FormState = { name: "", description: "", price: "0", dailyCapacity: "", active: true };

export default function AdminRoomServicePanel({
  hotelId,
  initialServices,
}: {
  hotelId: string;
  initialServices: RoomServiceItem[];
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [pending, startTransition] = useTransition();

  const startCreate = () => {
    setEditingId("new");
    setForm(EMPTY);
  };
  const startEdit = (s: RoomServiceItem) => {
    setEditingId(s._id);
    setForm({
      name: s.name,
      description: s.description || "",
      price: String(s.price),
      dailyCapacity: s.dailyCapacity == null ? "" : String(s.dailyCapacity),
      active: s.active,
    });
  };
  const cancel = () => {
    setEditingId(null);
    setForm(EMPTY);
  };

  const submit = () => {
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      dailyCapacity: form.dailyCapacity === "" ? null : Number(form.dailyCapacity),
      active: form.active,
    };
    if (!payload.name) {
      toast.error("Name is required");
      return;
    }
    startTransition(async () => {
      const res =
        editingId === "new"
          ? await createRoomServiceAction(hotelId, payload)
          : await updateRoomServiceAction(editingId!, hotelId, payload);
      if (res.success) {
        toast.success(editingId === "new" ? "Service created" : "Service updated");
        cancel();
        router.refresh();
      } else {
        toast.error(res.message || "Save failed");
      }
    });
  };

  const remove = (s: RoomServiceItem) => {
    startTransition(async () => {
      const res = await deleteRoomServiceAction(s._id, hotelId, false);
      if (res.success) {
        toast.success("Service deactivated");
        router.refresh();
      } else {
        toast.error(res.message || "Delete failed");
      }
    });
  };

  const removeHard = (s: RoomServiceItem) => {
    if (!confirm(`Permanently delete "${s.name}"? Past bookings keep their snapshot.`)) return;
    startTransition(async () => {
      const res = await deleteRoomServiceAction(s._id, hotelId, true);
      if (res.success) {
        toast.success("Service deleted");
        router.refresh();
      } else {
        toast.error(res.message || "Delete failed");
      }
    });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-6">
      {/* List */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold">All services</h2>
          <button
            type="button"
            onClick={startCreate}
            className="px-4 py-2 rounded-full gradient-gold text-[#1a1730] text-xs font-bold uppercase tracking-widest hover:-translate-y-0.5 transition-transform"
          >
            + New service
          </button>
        </div>
        {initialServices.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-white/55 text-sm">No services yet. Add one to get started.</p>
          </div>
        ) : (
          <AnimatePresence>
            {initialServices.map((s) => (
              <motion.div
                key={s._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: HOUSE_EASE }}
                className={`rounded-xl p-4 border ${
                  s.active
                    ? "border-white/[0.08] bg-white/[0.02]"
                    : "border-white/[0.04] bg-white/[0.01] opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-bold text-sm truncate">{s.name}</h3>
                      {!s.active && (
                        <span className="text-[9px] uppercase tracking-widest text-red-300 border border-red-400/30 rounded-full px-2 py-[1px]">
                          Inactive
                        </span>
                      )}
                      {s.dailyCapacity != null && (
                        <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-2 py-[1px]">
                          cap {s.dailyCapacity}/day
                        </span>
                      )}
                    </div>
                    {s.description && (
                      <p className="text-white/55 text-xs mt-1 leading-relaxed">{s.description}</p>
                    )}
                    <div className="mt-2 inline-block text-[11px] font-bold text-gold-light bg-[rgba(220,183,113,0.1)] px-2 py-0.5 rounded-full">
                      {s.price === 0 ? "Included" : `฿${s.price.toLocaleString()}`}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => startEdit(s)}
                      className="px-3 py-1.5 rounded-full border border-[#dcb771]/30 text-gold text-[11px] uppercase tracking-widest hover:bg-[#dcb771]/10 transition-colors"
                    >
                      Edit
                    </button>
                    {s.active ? (
                      <button
                        type="button"
                        onClick={() => remove(s)}
                        disabled={pending}
                        className="px-3 py-1.5 rounded-full border border-red-400/30 text-red-300 text-[11px] uppercase tracking-widest hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeHard(s)}
                        disabled={pending}
                        className="px-3 py-1.5 rounded-full border border-red-400/30 text-red-200 text-[11px] uppercase tracking-widest hover:bg-red-500/15 disabled:opacity-50 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Form */}
      <aside className="lg:sticky lg:top-[80px] self-start">
        <AnimatePresence mode="wait">
          {editingId ? (
            <motion.div
              key={editingId}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.25, ease: HOUSE_EASE }}
              className="glass-card-gold p-6"
            >
              <div className="text-[10px] uppercase tracking-[0.32em] text-gold mb-3">
                {editingId === "new" ? "New service" : "Edit service"}
              </div>
              <Field label="Name">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dcb771]/50"
                />
              </Field>
              <Field label="Description (optional)">
                <textarea
                  value={form.description}
                  rows={3}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dcb771]/50 resize-y"
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (฿)">
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dcb771]/50"
                  />
                </Field>
                <Field label="Daily capacity (blank = ∞)">
                  <input
                    type="number"
                    min={1}
                    value={form.dailyCapacity}
                    onChange={(e) => setForm({ ...form, dailyCapacity: e.target.value })}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dcb771]/50"
                  />
                </Field>
              </div>
              <label className="flex items-center gap-2 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 accent-[#dcb771]"
                />
                <span className="text-white/80 text-sm">Active (visible to guests)</span>
              </label>
              <div className="flex gap-2 mt-5">
                <button
                  type="button"
                  onClick={submit}
                  disabled={pending}
                  className="px-5 py-2.5 rounded-full gradient-gold text-[#1a1730] text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:-translate-y-0.5 transition-transform"
                >
                  {pending ? "Saving…" : "Save service"}
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={pending}
                  className="px-5 py-2.5 rounded-full border border-white/15 text-white/70 text-xs uppercase tracking-widest hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="text-[10px] uppercase tracking-[0.32em] text-gold mb-3">Tip</div>
              <p className="text-white/65 text-sm leading-relaxed">
                Pick a service on the left to edit, or hit{" "}
                <span className="text-gold font-bold">+ New service</span> to add one.
              </p>
              <ul className="mt-4 text-white/55 text-xs space-y-1.5 list-disc list-inside">
                <li>Past bookings keep a snapshot of the name and price they saw.</li>
                <li>Deactivating hides the service from new bookings but keeps its history.</li>
                <li>Leave capacity blank for unlimited (e.g. WiFi, parking).</li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </aside>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-white/60 text-xs uppercase tracking-widest mb-1.5">{label}</label>
      {children}
    </div>
  );
}
