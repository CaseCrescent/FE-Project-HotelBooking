import InfoPageLayout from "@/components/info/InfoPageLayout";
import PolicySection from "@/components/info/PolicySection";
import Link from "next/link";

export const metadata = { title: "Terms of Service · Hotel Booking" };

export default function TermsPage() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Terms of Service"
      description={`Effective ${new Date().getFullYear()}. By using Hotel Booking you agree to the following.`}
    >
      <PolicySection number="01" title="Your account">
        <p>
          You must be at least 18 years old or have parental consent to create an account. You are responsible for keeping your password secret and for activity that happens under your account. Sharing accounts is prohibited.
        </p>
      </PolicySection>

      <PolicySection number="02" title="Booking obligations">
        <ul className="list-disc list-inside space-y-1.5">
          <li>Bookings are capped at <strong>3 nights per booking</strong> for non-admin accounts.</li>
          <li>Confirming a booking is a commitment to honour the stay or cancel before check-in.</li>
          <li>Payment is settled with the hotel at check-in — we do not collect payment up front.</li>
          <li>The booking ticket link is shareable; the holder can view but not edit it.</li>
        </ul>
      </PolicySection>

      <PolicySection number="03" title="Cancellation">
        <p>
          You can cancel any active booking from My Bookings at any time. Cancellation is instant; the room becomes available to other guests. Hotel-side late-cancellation fees may still apply — see{" "}
          <Link href="/refund-policy" className="text-gold hover:text-[#f5d78e]">Refund & Cancellation Policy</Link>.
        </p>
      </PolicySection>

      <PolicySection number="04" title="Reviews">
        <p>
          Any signed-in user can post one review per hotel. By posting you grant us a non-exclusive licence to display your review on the hotel page. We may remove reviews that contain harassment, doxxing, or off-topic content. Like/dislike counts are visible to admins.
        </p>
      </PolicySection>

      <PolicySection number="05" title="Add-on services">
        <p>
          Add-on services (spa, pickup, etc.) are billed by the hotel at check-in. The name and price shown at booking time is captured as a snapshot — even if the service is later edited or removed, your booking shows what you originally agreed to.
        </p>
      </PolicySection>

      <PolicySection number="06" title="Liability">
        <p>
          Hotel Booking is an aggregator. We are not the lodging provider. Disputes about the stay itself (cleanliness, amenities not delivered, etc.) should be raised with the hotel first; we'll assist where we can but cannot guarantee resolution.
        </p>
      </PolicySection>

      <PolicySection number="07" title="Disputes & changes">
        <p>
          We may update these terms; meaningful changes will be flagged on the home page. Disputes are governed by the law of your local jurisdiction unless otherwise required. Contact us via the{" "}
          <Link href="/contact" className="text-gold hover:text-[#f5d78e]">Contact page</Link>{" "}
          before any legal action.
        </p>
      </PolicySection>
    </InfoPageLayout>
  );
}
