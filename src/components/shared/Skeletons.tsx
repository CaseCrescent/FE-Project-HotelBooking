// Component-shaped skeletons. Mirror the real component's bounding box.

export function SkeletonLine({ w = "100%", h = 12, className = "" }: { w?: string | number; h?: number; className?: string }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width: typeof w === "number" ? `${w}px` : w, height: h }}
    />
  );
}

export function SkeletonBlock({ h = 180, className = "" }: { h?: number; className?: string }) {
  return <div className={`skeleton skeleton-block ${className}`} style={{ width: "100%", height: h }} />;
}

export function SkeletonHotelCard() {
  return (
    <div className="w-full max-w-[340px] rounded-2xl overflow-hidden border border-white/[0.04] bg-[#16132a]">
      <div className="skeleton" style={{ width: "100%", height: 200, borderRadius: 0 }} />
      <div className="p-5 flex flex-col gap-3">
        <SkeletonLine w="70%" h={16} />
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ width: 14, height: 14, borderRadius: 4 }} />
          ))}
        </div>
        <SkeletonLine w="90%" />
        <SkeletonLine w="60%" />
      </div>
    </div>
  );
}

export function SkeletonHotelGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex justify-center">
          <SkeletonHotelCard />
        </div>
      ))}
    </div>
  );
}

export function SkeletonBookingCard() {
  return (
    <div className="p-6 rounded-2xl flex flex-col gap-4" style={{ backgroundColor: "#1a1730", border: "1px solid rgba(220, 183, 113, 0.08)" }}>
      <div className="pb-3" style={{ borderBottom: "1px solid #333" }}>
        <div className="flex justify-center"><SkeletonLine w={180} h={20} /></div>
        <div className="flex justify-center mt-2"><SkeletonLine w={120} h={10} /></div>
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <SkeletonLine w={70} />
            <SkeletonLine w={100} />
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2">
        <SkeletonBlock h={40} className="flex-1" />
        <SkeletonBlock h={40} className="flex-1" />
      </div>
    </div>
  );
}

export function SkeletonBookingGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBookingCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonDetail() {
  return (
    <div className="w-full max-w-[1100px] mx-auto px-6">
      <SkeletonBlock h={320} />
      <div className="mt-8 grid md:grid-cols-[1fr_360px] gap-8">
        <div className="flex flex-col gap-4">
          <SkeletonLine w={320} h={28} />
          <SkeletonLine w={200} />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine w="80%" />
          <SkeletonLine w="60%" />
        </div>
        <SkeletonBlock h={320} />
      </div>
    </div>
  );
}
