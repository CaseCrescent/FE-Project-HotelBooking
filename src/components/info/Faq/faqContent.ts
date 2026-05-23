export interface FaqItem {
  key: string;
  q: string;
  a: string;
}

// Guest-flow questions — focused on browsing, account creation, first booking.
export const GUEST_FAQ: FaqItem[] = [
  {
    key: "browse-no-account",
    q: "Do I need an account to browse?",
    a: "No — anyone can browse hotels, check availability, read reviews, and walk through the booking wizard. You only need to sign in at the final confirm step. We'll bring you right back to the same page after sign-in.",
  },
  {
    key: "register-required",
    q: "What do I need to register?",
    a: "Just a name, phone number, email, and password (min 6 characters). No credit card needed at signup — you only pay when you complete a booking. Email verification isn't required for early access.",
  },
  {
    key: "max-nights",
    q: "How many nights can I book?",
    a: "Up to 3 nights per booking. If you need a longer stay, split it across multiple bookings or contact the hotel directly through their listed phone number.",
  },
  {
    key: "max-bookings",
    q: "Is there a booking limit?",
    a: "You can have unlimited bookings on your account. Chatbot users (booking by phone) are capped at 3 active bookings per 24 hours to prevent abuse.",
  },
  {
    key: "availability",
    q: "How does the live availability work?",
    a: "Every hotel has a fixed room count. We calculate availability per night by counting confirmed and checked-in bookings against capacity. Cancelled bookings free the room immediately.",
  },
  {
    key: "pricing",
    q: "Where does the price come from?",
    a: "Each hotel sets a per-night price. Add-on services (spa, airport pickup, etc.) are priced separately and shown during the booking wizard before you confirm.",
  },
  {
    key: "payments",
    q: "How does payment work?",
    a: "This is a booking aggregator — payment is settled directly with the hotel at check-in. Your booking ticket serves as confirmation. We do not store any card data.",
  },
  {
    key: "data-collected",
    q: "What data do you collect?",
    a: "Just what you give us at signup: name, email, phone, password (hashed). See the Privacy Policy for the full list and your rights.",
  },
];

// User-flow questions — focused on managing existing bookings + reviews.
export const USER_FAQ: FaqItem[] = [
  {
    key: "edit-booking",
    q: "Can I edit a booking after confirming?",
    a: "Yes — go to My Bookings → Edit. You can change the date, hotel, or number of nights. We re-check availability before saving. Add-on services can't be changed in edit; cancel and rebook if you need to swap them.",
  },
  {
    key: "cancel-booking",
    q: "How do I cancel?",
    a: "Open the booking from My Bookings and hit Cancel. It's a soft cancel — your record stays on file with status 'cancelled', and the room becomes available again instantly. See the Refund Policy for fee details.",
  },
  {
    key: "share-ticket",
    q: "Can I share my booking ticket?",
    a: "Yes — the ticket page (linked from any booking) has a 'Copy receipt link' button. The link is public; anyone with it can view check-in details but cannot edit or cancel the booking.",
  },
  {
    key: "write-review",
    q: "Who can write a review?",
    a: "Any signed-in user can post one review per hotel with a 1–5 star rating and a comment. You can edit or delete your own review anytime; ratings recompute automatically.",
  },
  {
    key: "vote-reviews",
    q: "Why can I like reviews but not see dislike counts?",
    a: "We show like counts publicly but hide dislike counts to reduce dogpiling. Admins can see both for moderation. You can vote like, dislike, or clear your vote.",
  },
  {
    key: "delete-review",
    q: "What happens if I delete my review?",
    a: "The hotel's average rating recomputes immediately. The deletion is permanent — there's no undo.",
  },
  {
    key: "delete-account",
    q: "Can I delete my account?",
    a: "Yes — go to Profile → Delete account. This is permanent and removes your bookings, reviews, and personal data. Existing booking tickets keep working via the public ticket page.",
  },
  {
    key: "stale-session",
    q: "Why do I sometimes need to sign in again?",
    a: "Sessions last 30 days by default. If we restart the auth service or change security settings, you may be signed out early. Just sign in again — your data is safe.",
  },
];

// Admin-flow questions — focused on moderation, services, users, bookings lifecycle.
export const ADMIN_FAQ: FaqItem[] = [
  {
    key: "admin-dashboard",
    q: "What does the admin dashboard show?",
    a: "Six KPIs (hotels, bookings, upcoming, checked-in, reviews, users), recent bookings (last 5), recent reviews (last 5), and quick links to every admin section.",
  },
  {
    key: "moderate-reviews",
    q: "How do I moderate reviews?",
    a: "Admin → Reviews shows every review with like + dislike counts. Click Delete on any spam/off-topic post — the hotel's rating recomputes automatically.",
  },
  {
    key: "roomservices-cap",
    q: "What does daily capacity on a room service mean?",
    a: "Optional per-day limit (e.g. 'Spa, max 4 bookings/day'). Leave blank for unlimited (e.g. WiFi, parking). The booking wizard enforces it at booking time.",
  },
  {
    key: "deactivate-service",
    q: "What's the difference between Deactivate and Delete on a room service?",
    a: "Deactivate hides it from new bookings but keeps it on past bookings (snapshot pattern). Delete removes the service entirely — past bookings keep their snapshot of the name and price.",
  },
  {
    key: "ban-vs-delete",
    q: "Ban vs delete user?",
    a: "Ban is reversible — sets a flag, refuses future logins and existing tokens. The user's bookings + reviews stay on file. There's no hard-delete admin endpoint; users delete their own accounts.",
  },
  {
    key: "promote-self-target",
    q: "Why can't I ban/promote myself?",
    a: "Self-target is blocked server-side to prevent admins from accidentally locking themselves out. To demote yourself, ask another admin.",
  },
  {
    key: "booking-status-flow",
    q: "What's the booking status flow?",
    a: "Confirmed → Checked-in (during the stay window) → Completed (after stay). Cancel works from any state except Completed. Use the inline pills on each booking card.",
  },
  {
    key: "force-check-in",
    q: "What does 'force check-in' do?",
    a: "Bypasses the window check — useful for admins handling early or late arrivals. Regular users (owners) can only check in during the booking window.",
  },
  {
    key: "delete-hotel-cascade",
    q: "What happens if I delete a hotel?",
    a: "Cascades — all bookings, reviews, and room services for that hotel are deleted. This cannot be undone. Consider deactivating room services first if you only need to pause sales.",
  },
];
