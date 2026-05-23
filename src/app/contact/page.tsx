import InfoPageLayout from "@/components/info/InfoPageLayout";
import ContactCard from "@/components/info/ContactCard";

export const metadata = { title: "Contact · Hotel Booking" };

export default function ContactPage() {
  return (
    <InfoPageLayout
      eyebrow="Get in touch"
      title={
        <>
          We&apos;re{" "}
          <span className="bg-gradient-to-r from-[#f5d78e] via-[#dcb771] to-[#c5a059] bg-clip-text text-transparent">
            here
          </span>{" "}
          to help.
        </>
      }
      description="Pick the channel you prefer. We reply within one business day."
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <ContactCard
          icon="@"
          label="Email"
          value="hello@hotelbooking.local"
          href="mailto:hello@hotelbooking.local"
          caption="Best for refund requests and account issues"
        />
        <ContactCard
          icon="☎"
          label="Phone"
          value="+66 (0) 2 000 0000"
          href="tel:+6620000000"
          caption="Mon–Fri 09:00–18:00 ICT"
        />
        <ContactCard
          icon="✉"
          label="LINE Official"
          value="@hotelbooking"
          href="https://line.me/R/ti/p/@hotelbooking"
          caption="Fast replies — bookings & account help"
        />
        <ContactCard
          icon="𝕏"
          label="Twitter / X"
          value="@hotelbooking"
          href="https://twitter.com/hotelbooking"
          caption="Public questions & feedback"
        />
      </div>

      <div className="glass-card-gold p-6 md:p-8">
        <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">Hours</div>
        <p className="text-white/75 text-sm md:text-base leading-relaxed">
          Email and LINE are monitored seven days a week, 24 hours. Phone support runs Monday to Friday, 09:00–18:00 ICT. For urgent issues during a stay, contact the hotel directly using the telephone number on your booking ticket.
        </p>
      </div>
    </InfoPageLayout>
  );
}
