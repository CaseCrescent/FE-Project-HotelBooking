"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";

interface ServiceOption {
  _id: string;
  name: string;
  description?: string;
  price: number;
  dailyCapacity: number | null;
}

export interface PickedService {
  service: string;
  quantity: number;
}

export default function ServicePicker({
  hotelId,
  value,
  onChange,
}: {
  hotelId: string;
  value: PickedService[];
  onChange: (next: PickedService[]) => void;
}) {
  const [services, setServices] = useState<ServiceOption[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setServices(null);
    setError(null);
    import("@/app/actions")
      .then((m) => m.fetchHotelServicesAction(hotelId))
      .then((res) => {
        if (cancelled) return;
        if (res?.success) setServices((res.data ?? []) as ServiceOption[]);
        else setError(res?.message || "Could not load services");
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message || "Could not load services");
      });
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  const setQty = (serviceId: string, qty: number) => {
    const next = value.filter((p) => p.service !== serviceId);
    if (qty > 0) next.push({ service: serviceId, quantity: qty });
    onChange(next);
  };
  const qtyOf = (serviceId: string) => value.find((p) => p.service === serviceId)?.quantity ?? 0;

  if (services === null && !error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-white/55 text-sm">Loading services…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-red-300 text-sm">{error}</p>
      </div>
    );
  }
  if (!services || services.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-white/55 text-sm">No add-on services for this hotel — skip to review.</p>
      </div>
    );
  }

  const total = value.reduce((sum, p) => {
    const svc = services.find((s) => s._id === p.service);
    return sum + (svc ? svc.price * p.quantity : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {services.map((s) => {
          const qty = qtyOf(s._id);
          const cap = s.dailyCapacity ?? 10;
          const selected = qty > 0;
          return (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: HOUSE_EASE }}
              className={`rounded-xl p-4 border transition-colors ${
                selected
                  ? "border-[#dcb771] bg-[rgba(220,183,113,0.08)]"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-bold text-sm truncate">{s.name}</h3>
                    {s.dailyCapacity != null && (
                      <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 rounded-full px-2 py-[1px]">
                        max {s.dailyCapacity}/day
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
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setQty(s._id, Math.max(0, qty - 1))}
                    disabled={qty === 0}
                    className="w-8 h-8 rounded-full border border-white/15 text-white/70 hover:border-[#dcb771]/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Decrease"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-bold text-white tabular-nums">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty(s._id, Math.min(cap, qty + 1))}
                    disabled={qty >= cap}
                    className="w-8 h-8 rounded-full border border-white/15 text-white/70 hover:border-[#dcb771]/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Increase"
                  >
                    +
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
      {total > 0 && (
        <div className="flex items-center justify-between px-1 mt-1">
          <span className="text-white/55 text-xs uppercase tracking-widest">Add-ons subtotal</span>
          <span className="text-gold-light font-bold tabular-nums">฿{total.toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
