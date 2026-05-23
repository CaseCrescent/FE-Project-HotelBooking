// Google Maps embed without API key or billing — uses the public maps URL with
// `output=embed`. Same pattern as TinyBot's hospital detail page. Lazy-loaded so
// it doesn't block first paint.

export default function HotelMap({ address, name }: { address: string; name: string }) {
  const query = encodeURIComponent(`${name}, ${address}`);
  const src = `https://www.google.com/maps?q=${query}&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${query}`;

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div>
          <div className="text-[11px] tracking-[0.32em] uppercase text-gold mb-1">Location</div>
          <p className="text-white/65 text-sm">{address}</p>
        </div>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#dcb771]/30 text-gold hover:bg-[rgba(220,183,113,0.08)] text-xs uppercase tracking-widest font-bold transition-colors"
        >
          Get directions →
        </a>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-white/[0.06]" style={{ aspectRatio: "16/9" }}>
        <iframe
          src={src}
          title={`Map of ${name}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
          style={{ border: 0, filter: "saturate(0.85) brightness(0.95)" }}
        />
      </div>
    </div>
  );
}
