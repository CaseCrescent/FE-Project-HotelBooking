import Link from "next/link";
import InfoPageLayout from "@/components/info/InfoPageLayout";
import PolicySection from "@/components/info/PolicySection";

export const metadata = { title: "About · Hotel Booking" };

const TIMELINE = [
  { step: "01", title: "Browse", body: "Open the catalog. Every hotel passes our quality review before listing — no fillers." },
  { step: "02", title: "Pick dates", body: "Live per-night availability uses real room counts, not stale estimates." },
  { step: "03", title: "Add services", body: "Spa, pickup, breakfast — pick what you want, see the running total." },
  { step: "04", title: "Confirm", body: "Sign in only at the final step. Confirmation ticket ships instantly." },
];

export default function AboutPage() {
  return (
    <InfoPageLayout
      eyebrow="About us"
      title={
        <>
          Booking, designed like the{" "}
          <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
            stay itself.
          </span>
        </>
      }
      description="A curated hotel booking aggregator built for clarity, speed, and respect for your time."
    >
      <PolicySection title="Our story">
        <p>
          We started Hotel Booking because every other aggregator we tried felt like a tax on the experience: too many tabs, opaque pricing, dark patterns at checkout. The room is the destination — getting there should feel just as deliberate.
        </p>
        <p className="mt-3">
          We index a small set of partner hotels we&apos;ve actually stayed at. No PPC bidding, no fake-urgency timers, no upsell modals. You see real availability, you pay the hotel directly, and your time is yours.
        </p>
      </PolicySection>

      <PolicySection title="How it works">
        <ol className="grid sm:grid-cols-2 gap-4 mt-2 list-none">
          {TIMELINE.map((t) => (
            <li
              key={t.step}
              className="rounded-xl p-4 border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-gold-light text-xs font-bold tracking-widest tabular-nums">
                  {t.step}
                </span>
                <h3 className="text-white font-bold text-base">{t.title}</h3>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{t.body}</p>
            </li>
          ))}
        </ol>
      </PolicySection>

      <PolicySection title="What we believe">
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>Editorial curation</strong> beats infinite scroll.</li>
          <li><strong>Transparent pricing</strong> beats marketing copy.</li>
          <li><strong>One real cancellation policy</strong> beats five fine-print tiers.</li>
          <li><strong>Receipts that work</strong> beats logging in to find your booking.</li>
        </ul>
      </PolicySection>

      <PolicySection title="Talk to us">
        <p>
          Have feedback or want to onboard your hotel?{" "}
          <Link href="/contact" className="text-gold hover:text-[#f5d78e]">Get in touch</Link>.
        </p>
      </PolicySection>
    </InfoPageLayout>
  );
}
