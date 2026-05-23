"use client";
import { useEffect, useMemo, useState } from "react";
import { Slider } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { useSession, signIn } from "next-auth/react";
import DateReserve from "@/components/DateReserve";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { createBookingAction, updateBookingAction, registerAction } from "@/app/actions";
import BookingSummaryPanel from "@/components/BookingSummaryPanel";
import ServicePicker, { type PickedService } from "@/components/booking/ServicePicker";
import { HOUSE_EASE, slideIn } from "@/lib/animations";

type HotelLite = { _id: string; name: string; address: string; pricePerNight?: number };

interface BookingFormProps {
  mode: "create" | "edit";
  hotels: HotelLite[];
  initialHotelId?: string;
  initialData?: { bookingId: string; bookingDate?: string; numOfNights?: number };
  prefilledDate?: string;
  prefilledNights?: number;
}

const STEPS = ["Pick hotel", "Pick dates", "Add services", "Review"] as const;

export default function BookingForm({
  mode,
  hotels,
  initialHotelId,
  initialData,
  prefilledDate,
  prefilledNights,
}: BookingFormProps) {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const isGuest = sessionStatus !== "loading" && !session?.user?.token;

  // Pre-fill source priority: edit's initialData > URL prefills > defaults
  const baseDate = initialData?.bookingDate || prefilledDate;
  const baseNights = initialData?.numOfNights ?? prefilledNights ?? 1;

  // Open at Dates if hotel preselected, Review on edit, else Pick Hotel.
  // Steps: 0=Hotel, 1=Dates, 2=Services, 3=Review
  const startStep: 0 | 1 | 2 | 3 = initialData ? 3 : initialHotelId ? 1 : 0;

  const [step, setStep] = useState<0 | 1 | 2 | 3>(startStep);
  const [hotelId, setHotelId] = useState(initialHotelId || (hotels?.length > 0 ? hotels[0]._id : ""));
  const [bookDate, setBookDate] = useState<Dayjs | null>(baseDate ? dayjs(baseDate) : null);
  const [numOfNights, setNumOfNights] = useState<number>(baseNights);
  const [services, setServices] = useState<PickedService[]>([]);
  const [loading, setLoading] = useState(false);
  const [availLoading, setAvailLoading] = useState(false);
  const [availOK, setAvailOK] = useState<boolean | null>(null);
  const [availError, setAvailError] = useState<boolean>(false);
  const [guestName, setGuestName] = useState("");
  const [guestTel, setGuestTel] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPassword, setGuestPassword] = useState("");

  // Reset service selection when the hotel changes (services are per-hotel).
  useEffect(() => {
    setServices([]);
  }, [hotelId]);

  const selectedHotel = useMemo(() => hotels.find((h) => h._id === hotelId), [hotels, hotelId]);
  const checkoutDate = bookDate ? bookDate.add(numOfNights, "day") : null;
  const isOverLimit = numOfNights > 3;
  const datePicked = !!bookDate;
  const canAdvanceFromHotel = !!hotelId;
  const canAdvanceFromDates = datePicked && !isOverLimit && numOfNights >= 1;
  const totalPrice = (selectedHotel?.pricePerNight ?? 1500) * numOfNights;

  // Live availability check (debounced via effect dep tracking)
  useEffect(() => {
    if (!hotelId || !bookDate) {
      setAvailOK(null);
      setAvailError(false);
      return;
    }
    let cancelled = false;
    setAvailLoading(true);
    setAvailError(false);
    const date = bookDate.format("YYYY-MM-DD");
    fetch(`/api/availability/${hotelId}/check?date=${date}&nights=${numOfNights}`)
      .then((r) => r.json())
      .then((j) => {
        if (cancelled) return;
        setAvailOK(j?.success ? !!j.data?.available : false);
      })
      .catch(() => {
        if (cancelled) return;
        // Network / BE-down: keep availOK null (no spurious "fully booked") but
        // surface the error explicitly so the user knows to retry, not pick a different date.
        setAvailOK(null);
        setAvailError(true);
      })
      .finally(() => !cancelled && setAvailLoading(false));
    return () => {
      cancelled = true;
    };
  }, [hotelId, bookDate, numOfNights]);

  const buildSelfNext = () => {
    if (!hotelId || !bookDate) return "/booking";
    const qs = new URLSearchParams({
      hotel: hotelId,
      date: bookDate.format("YYYY-MM-DD"),
      nights: String(numOfNights),
    });
    return `/booking?${qs.toString()}`;
  };

  const handleSubmit = async () => {
    if (!hotelId) return toast.error("Please select a hotel.");
    if (!bookDate) return toast.error("Please select a check-in date.");
    if (isOverLimit) return toast.error("Maximum 3 nights per booking.");
    if (availOK === false) return toast.error("Those dates are fully booked.");

    setLoading(true);

    if (isGuest && mode === "create") {
      if (!guestName || !guestTel || !guestEmail || !guestPassword) {
        setLoading(false);
        return toast.error("Please fill in all guest details to create an account.");
      }
      try {
        const regRes = await registerAction(guestName, guestTel, guestEmail, guestPassword);
        if (!regRes.success) {
          setLoading(false);
          return toast.error(regRes.message || "Registration failed");
        }
        
        const signRes = await signIn("credentials", {
          redirect: false,
          email: guestEmail,
          password: guestPassword
        });

        if (signRes?.error) {
          setLoading(false);
          return toast.error("Login failed after registration");
        }
        // Small delay to ensure cookie is set before the server action
        await new Promise(r => setTimeout(r, 500));
      } catch (err) {
        setLoading(false);
        return toast.error("Registration error");
      }
    }

    try {
      const formattedDate = bookDate.format("YYYY-MM-DD");
      const res =
        mode === "create"
          ? await createBookingAction(hotelId, formattedDate, numOfNights, services)
          : await updateBookingAction(initialData!.bookingId, formattedDate, numOfNights, hotelId);

      if (res?.success) {
        const newId = (res as { success: true; data?: { data?: { _id?: string } } }).data?.data?._id;
        toast.success(mode === "create" ? "Booking confirmed" : "Booking updated");
        if (mode === "create" && newId) router.push(`/booking/${newId}`);
        else router.push("/mybooking");
      } else {
        toast.error(res?.message || "Booking failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const primaryLabel = (() => {
    if (loading) return "Confirming…";
    if (mode === "edit") return "Update Booking";
    if (isGuest) return "Sign in & confirm";
    return "Confirm Booking";
  })();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
      {/* LEFT — wizard */}
      <div className="glass-card-gold p-6 md:p-8">
        {/* Guest banner */}
        {isGuest && (
          <div className="mb-6 rounded-xl px-4 py-3 text-sm flex items-center gap-3 border border-[#dcb771]/25 bg-[rgba(220,183,113,0.06)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dcb771] pulse-gold" />
            <span className="text-white/75">
              You're browsing as a guest. You can create an account directly in the final step to confirm your booking.
            </span>
          </div>
        )}

        {/* Progress bar — fills as the user advances. scaleX (compositor-only)
            instead of width (layout reflow) for cheaper per-frame animation. */}
        <div className="relative h-[3px] w-full rounded-full bg-white/[0.06] mb-6 overflow-hidden">
          <motion.div
            initial={false}
            animate={{ scaleX: (step + 1) / STEPS.length }}
            transition={{ duration: 0.45, ease: HOUSE_EASE }}
            style={{ transformOrigin: "left" }}
            className="absolute inset-0 rounded-full gradient-gold"
          />
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex-1 flex items-center gap-2 min-w-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors flex-shrink-0 ${
                  i <= step ? "gradient-gold text-[#1a1730]" : "bg-white/[0.06] text-white/40"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[11px] uppercase tracking-widest font-semibold truncate ${
                  i <= step ? "text-gold" : "text-white/40"
                }`}
              >
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 min-w-[12px] h-[2px] rounded-full ${i < step ? "bg-[#dcb771]" : "bg-white/[0.06]"}`} />
              )}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Step 0 — Hotel */}
          {step === 0 && (
            <motion.div
              key="step-0"
              variants={slideIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <SectionLabel>Choose a hotel</SectionLabel>
              <div className="grid sm:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto pr-1">
                {hotels.map((h) => (
                  <button
                    key={h._id}
                    type="button"
                    onClick={() => setHotelId(h._id)}
                    className={`text-left rounded-xl p-4 border transition-all ${
                      hotelId === h._id
                        ? "border-[#dcb771] bg-[rgba(220,183,113,0.08)] shadow-soft"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/20"
                    }`}
                  >
                    <div className="text-gold text-sm font-bold truncate">{h.name}</div>
                    <div className="text-white/55 text-xs mt-1 truncate">{h.address}</div>
                    {h.pricePerNight !== undefined && (
                      <div className="mt-3 inline-block text-[11px] font-bold text-gold-light bg-[rgba(220,183,113,0.1)] px-2 py-0.5 rounded-full">
                        ฿{h.pricePerNight.toLocaleString()} / night
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <FooterActions onNext={() => setStep(1)} nextDisabled={!canAdvanceFromHotel} nextLabel="Continue" />
            </motion.div>
          )}

          {/* Step 1 — Dates */}
          {step === 1 && (
            <motion.div
              key="step-1"
              variants={slideIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-6"
            >
              <SectionLabel>Pick a check-in date</SectionLabel>
              <DateReserve label="" value={bookDate} onDateChange={(val) => setBookDate(val)} />

              <SectionLabel className="mt-2">Number of nights</SectionLabel>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={numOfNights}
                  onChange={(e) => setNumOfNights(Math.max(1, Math.min(3, Number(e.target.value) || 1)))}
                  className="w-20 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-center font-bold text-gold"
                />
                <div className="flex-1 px-2">
                  <Slider
                    value={numOfNights}
                    onChange={(_, val) => setNumOfNights(val as number)}
                    step={1}
                    marks
                    min={1}
                    max={3}
                    valueLabelDisplay="auto"
                    sx={{
                      color: "#dcb771",
                      "& .MuiSlider-mark": { backgroundColor: "rgba(255,255,255,0.2)" },
                      "& .MuiSlider-markActive": { backgroundColor: "#fff" },
                    }}
                  />
                </div>
              </div>

              {/* Live availability badge */}
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm flex items-center gap-3">
                {availLoading ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-white/40 animate-pulse" />
                    <span className="text-white/55">Checking availability…</span>
                  </>
                ) : availError ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-amber-200">Couldn&apos;t reach availability service. Check connection and try again.</span>
                  </>
                ) : availOK === true ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-gold" />
                    <span className="text-emerald-200">Rooms available for those dates.</span>
                  </>
                ) : availOK === false ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-400" />
                    <span className="text-red-200">Sorry — fully booked. Pick different dates.</span>
                  </>
                ) : (
                  <span className="text-white/55">Pick a date to check availability.</span>
                )}
              </div>

              <FooterActions
                onBack={() => setStep(0)}
                onNext={() => setStep(2)}
                nextDisabled={!canAdvanceFromDates || availOK === false || availError}
                nextLabel="Add-ons"
              />
            </motion.div>
          )}

          {/* Step 2 — Services */}
          {step === 2 && (
            <motion.div
              key="step-2"
              variants={slideIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <SectionLabel>Add-on services (optional)</SectionLabel>
              <ServicePicker hotelId={hotelId} value={services} onChange={setServices} />
              <FooterActions
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
                nextLabel="Review"
              />
            </motion.div>
          )}

          {/* Step 3 — Review */}
          {step === 3 && (
            <motion.div
              key="step-3"
              variants={slideIn}
              initial="hidden"
              animate="show"
              exit="exit"
              className="flex flex-col gap-5"
            >
              <SectionLabel>Review &amp; confirm</SectionLabel>

              <div className="rounded-xl border border-[#dcb771]/30 bg-[rgba(220,183,113,0.05)] p-5">
                <Row label="Hotel" value={selectedHotel?.name || "—"} highlight />
                <Row label="Address" value={selectedHotel?.address || "—"} />
                <Row label="Check-in" value={bookDate ? bookDate.format("DD MMM YYYY") : "—"} />
                <Row label="Check-out" value={checkoutDate ? checkoutDate.format("DD MMM YYYY") : "—"} />
                <Row label="Nights" value={`${numOfNights} ${numOfNights === 1 ? "night" : "nights"}`} />
                {services.length > 0 && (
                  <Row
                    label="Add-ons"
                    value={`${services.length} ${services.length === 1 ? "service" : "services"}`}
                  />
                )}
                {selectedHotel?.pricePerNight && (
                  <Row label="Total" value={`฿${totalPrice.toLocaleString()}`} highlight />
                )}
              </div>

              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                disabled={loading}
                onClick={handleSubmit}
                className={`w-full py-3.5 rounded-full text-sm font-bold tracking-[0.18em] uppercase shadow-elegant transition-opacity inline-flex items-center justify-center gap-2 ${
                  loading ? "bg-white/[0.06] text-white/40 cursor-not-allowed" : "gradient-gold text-[#1a1730]"
                }`}
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                )}
                {primaryLabel}
              </motion.button>

              {isGuest && (
                <div className="rounded-xl border border-[#dcb771]/30 bg-[rgba(220,183,113,0.05)] p-5 flex flex-col gap-3">
                  <SectionLabel>Guest Details (Create Account)</SectionLabel>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={guestName}
                    onChange={e => setGuestName(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-gold outline-none"
                    disabled={loading}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={guestTel}
                    onChange={e => setGuestTel(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-gold outline-none"
                    disabled={loading}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={guestEmail}
                    onChange={e => setGuestEmail(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-gold outline-none"
                    disabled={loading}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={guestPassword}
                    onChange={e => setGuestPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-gold outline-none"
                    disabled={loading}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-center text-xs text-white/50 tracking-widest uppercase hover:text-white"
              >
                ← Back to add-ons
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* RIGHT — summary */}
      <BookingSummaryPanel
        hotelName={selectedHotel?.name}
        bookDate={bookDate}
        checkoutDate={checkoutDate}
        numOfNights={numOfNights}
        isOverLimit={isOverLimit}
      />
    </div>
  );
}

function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-[11px] tracking-[0.32em] uppercase text-gold ${className}`}>{children}</div>;
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
      <span className="text-white/55 text-xs uppercase tracking-widest">{label}</span>
      <span className={`text-sm ${highlight ? "text-gold-light font-bold" : "text-white/85"}`}>{value}</span>
    </div>
  );
}

function FooterActions({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-3 rounded-full border border-white/15 text-white/70 text-xs tracking-widest uppercase font-semibold hover:bg-white/[0.04]"
        >
          ← Back
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        disabled={nextDisabled}
        onClick={onNext}
        className={`px-7 py-3 rounded-full text-xs tracking-widest uppercase font-bold transition-opacity ${
          nextDisabled ? "bg-white/[0.06] text-white/40 cursor-not-allowed" : "gradient-gold text-[#1a1730] shadow-soft hover:-translate-y-0.5 transition-transform"
        }`}
      >
        {nextLabel} →
      </button>
    </div>
  );
}
