import Link from "next/link";

// Shown by server components that fail to fetch from the BE because the user's
// JWT was rejected (expired, invalid signature, or banned). Gives them a clear
// "log in again" path instead of an empty state with a silent console error.
export default function SessionExpiredCard({
  message,
  callbackUrl = "/",
}: {
  message: string;
  callbackUrl?: string;
}) {
  const isAuthError = /sign in|session|account|expired|suspended|authoriz/i.test(message);
  return (
    <div className="glass-card-gold p-8 md:p-10 max-w-[640px] mx-auto text-center">
      <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-3">
        {isAuthError ? "Session issue" : "Could not load"}
      </div>
      <h2 className="text-white text-xl md:text-2xl font-bold mb-3">{message}</h2>
      {isAuthError ? (
        <>
          <p className="text-white/55 text-sm mb-6 leading-relaxed">
            Your session has ended or your account state changed. Sign in again to continue.
          </p>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
            className="inline-block px-7 py-3 rounded-full gradient-gold text-[#1a1730] text-xs font-bold uppercase tracking-[0.18em] shadow-elegant hover:-translate-y-0.5 transition-transform"
          >
            Sign in again
          </Link>
        </>
      ) : (
        <p className="text-white/55 text-sm leading-relaxed">
          Make sure the backend is running and try again.
        </p>
      )}
    </div>
  );
}
