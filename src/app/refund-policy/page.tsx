import InfoPageLayout from "@/components/info/InfoPageLayout";
import PolicySection from "@/components/info/PolicySection";
import Link from "next/link";

export const metadata = { title: "Refund & Cancellation · Hotel Booking" };

export default function RefundPage() {
  return (
    <InfoPageLayout
      eyebrow="Booking"
      title="Refund & Cancellation"
      description="No hidden fees. Cancel from My Bookings in two clicks."
    >
      <PolicySection number="01" title="How cancellation works">
        <p>
          Hotel Booking does not collect payment at booking — your card is never charged through us. Cancelling on Hotel Booking simply removes your reservation from the hotel&apos;s upcoming list and frees the room for other guests.
        </p>
        <p className="mt-3">
          Cancellation is a <strong>soft delete</strong> — your booking record stays on file with status &quot;cancelled&quot; so you keep a paper trail. The room becomes available to other guests immediately.
        </p>
      </PolicySection>

      <PolicySection number="02" title="What you can cancel">
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>Confirmed bookings</strong> — cancel any time before the start of your stay.</li>
          <li><strong>Checked-in bookings</strong> — admin only. Reach out via{" "}
            <Link href="/contact" className="text-gold hover:text-[#f5d78e]">Contact</Link>{" "}
            if you need to end a stay early.
          </li>
          <li><strong>Completed bookings</strong> — past stays cannot be cancelled.</li>
          <li><strong>Already-cancelled bookings</strong> — the status doesn&apos;t flip back; create a new booking instead.</li>
        </ul>
      </PolicySection>

      <PolicySection number="03" title="Hotel-side fees">
        <p>
          Even though Hotel Booking charges nothing, individual hotels may have their own late-cancellation fees billed at check-in or directly to your saved method (if you provided one at the property). The hotel&apos;s telephone number is on every booking ticket — call before your stay window starts to confirm their policy.
        </p>
      </PolicySection>

      <PolicySection number="04" title="Add-on services">
        <p>
          Selected add-ons (spa, pickup, breakfast, etc.) are cancelled together with the booking and re-opened to other guests against any daily capacity cap. There is no separate fee for cancelling individual add-ons through Hotel Booking — but please notify the hotel directly if a service is time-sensitive (e.g. airport pickup the next morning).
        </p>
      </PolicySection>

      <PolicySection number="05" title="How to cancel">
        <ol className="list-decimal list-inside space-y-1.5">
          <li>
            Go to <Link href="/mybooking" className="text-gold hover:text-[#f5d78e]">My Bookings</Link>.
          </li>
          <li>Find the booking and hit <strong>Cancel</strong>.</li>
          <li>Confirm the dialog. Done — you&apos;ll see the status flip to &quot;cancelled&quot; immediately.</li>
        </ol>
      </PolicySection>

      <PolicySection number="06" title="Need help?">
        <p>
          If the cancel button is greyed out, the booking is already past or already cancelled. For anything else, reach out via{" "}
          <Link href="/contact" className="text-gold hover:text-[#f5d78e]">Contact</Link>{" "}
          — we typically reply within one business day.
        </p>
      </PolicySection>
    </InfoPageLayout>
  );
}
