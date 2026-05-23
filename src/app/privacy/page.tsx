import InfoPageLayout from "@/components/info/InfoPageLayout";
import PolicySection from "@/components/info/PolicySection";
import Link from "next/link";

export const metadata = { title: "Privacy Policy · Hotel Booking" };

export default function PrivacyPage() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Privacy Policy"
      description={`Last updated: ${new Date().getFullYear()}. We collect only what's needed to run your bookings.`}
    >
      <PolicySection number="01" title="What we collect">
        <p>
          When you create an account we store your <strong>name, email, phone number, role, and a hashed password</strong>. We never store passwords in plain text. When you create a booking we additionally store the booking date, length of stay, hotel reference, and any add-on services you selected.
        </p>
        <p className="mt-3">
          We do not collect payment details — bookings settle directly with the hotel at check-in.
        </p>
      </PolicySection>

      <PolicySection number="02" title="How we use it">
        <ul className="list-disc list-inside space-y-1.5">
          <li>Authenticate you across the app (JWT sessions, 30-day default).</li>
          <li>Show your bookings, reviews, and add-on selections.</li>
          <li>Calculate per-hotel rating averages from reviews you post.</li>
          <li>Send confirmation tickets at the public link you can share.</li>
          <li>Surface admin-only views to admin accounts.</li>
        </ul>
      </PolicySection>

      <PolicySection number="03" title="Third-party services">
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>NextAuth</strong> — manages your session cookie locally; no third-party redirect.</li>
          <li><strong>MongoDB Atlas</strong> — stores all account, booking, and review data.</li>
          <li><strong>Google Maps</strong> — loads the hotel-location map via iframe embed. No API key, no tracking script from us; Google may set its own cookies.</li>
          <li><strong>Vercel / Render</strong> — hosting platforms with standard request logs.</li>
        </ul>
      </PolicySection>

      <PolicySection number="04" title="Cookies">
        <p>
          We use three first-party cookies: a NextAuth session token, an anti-CSRF token, and a Redux-persist key for your local UI preferences. See the{" "}
          <Link href="/cookies" className="text-gold hover:text-[#f5d78e]">Cookie Policy</Link>{" "}
          for the full table.
        </p>
      </PolicySection>

      <PolicySection number="05" title="Your rights">
        <ul className="list-disc list-inside space-y-1.5">
          <li><strong>Access</strong> — see all your data in Profile.</li>
          <li><strong>Edit</strong> — change your profile fields in Profile; edit any review or booking from My Bookings.</li>
          <li><strong>Delete</strong> — remove your account from Profile → Delete account. This is permanent and removes your bookings, reviews, and personal data.</li>
        </ul>
      </PolicySection>

      <PolicySection number="06" title="Contact">
        <p>
          Questions or requests? Reach us via the{" "}
          <Link href="/contact" className="text-gold hover:text-[#f5d78e]">Contact page</Link>.
        </p>
      </PolicySection>
    </InfoPageLayout>
  );
}
