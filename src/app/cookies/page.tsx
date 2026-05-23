import InfoPageLayout from "@/components/info/InfoPageLayout";
import PolicySection from "@/components/info/PolicySection";

export const metadata = { title: "Cookie Policy · Hotel Booking" };

const COOKIES = [
  {
    name: "next-auth.session-token",
    purpose: "Keeps you signed in. Holds an encrypted JWT with your name, email, role, and BE auth token.",
    expires: "30 days",
    type: "Essential",
  },
  {
    name: "next-auth.csrf-token",
    purpose: "Anti-CSRF token for the sign-in form. Required to prevent cross-site request forgery.",
    expires: "Session",
    type: "Essential",
  },
  {
    name: "persist:hotel-booking",
    purpose: "Stores local UI state (admin's hotel-meta overrides) in localStorage. Not strictly a cookie but in scope.",
    expires: "Until cleared",
    type: "Preferences",
  },
];

export default function CookiesPage() {
  return (
    <InfoPageLayout
      eyebrow="Legal"
      title="Cookie Policy"
      description="We keep our cookie use minimal — only what's needed to sign you in and remember your preferences."
    >
      <PolicySection number="01" title="Cookies we use">
        <div className="overflow-x-auto -mx-2 md:mx-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-widest text-white/45">
                <th className="text-left py-2 pr-3">Name</th>
                <th className="text-left py-2 pr-3 hidden md:table-cell">Purpose</th>
                <th className="text-left py-2 pr-3">Expires</th>
                <th className="text-left py-2">Type</th>
              </tr>
            </thead>
            <tbody>
              {COOKIES.map((c) => (
                <tr key={c.name} className="border-t border-white/[0.05]">
                  <td className="py-3 pr-3 text-white font-mono text-xs md:text-sm break-words">{c.name}</td>
                  <td className="py-3 pr-3 text-white/65 hidden md:table-cell">{c.purpose}</td>
                  <td className="py-3 pr-3 text-white/70">{c.expires}</td>
                  <td className="py-3">
                    <span
                      className="text-[10px] uppercase tracking-widest font-bold px-2 py-[2px] rounded-full"
                      style={{
                        background: "rgba(220,183,113,0.14)",
                        color: "#f5d78e",
                        border: "1px solid rgba(220,183,113,0.3)",
                      }}
                    >
                      {c.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PolicySection>

      <PolicySection number="02" title="How to disable them">
        <p>
          Every modern browser lets you clear cookies under Settings → Privacy. Note that clearing the session token signs you out, and clearing the CSRF token will require a hard reload before the next sign-in attempt.
        </p>
      </PolicySection>

      <PolicySection number="03" title="Third-party cookies">
        <p>
          We do not run analytics, ad networks, or cross-site tracking. The Google Maps iframe on hotel detail pages may set Google&apos;s own cookies — those are governed by Google&apos;s policy, not ours.
        </p>
      </PolicySection>
    </InfoPageLayout>
  );
}
