"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Lightweight top progress bar — fires briefly on every route change.
export default function RouteProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(true);
    const t = setTimeout(() => setActive(false), 650);
    return () => clearTimeout(t);
  }, [pathname, searchParams]);

  if (!active) return null;
  return <div className="route-progress" aria-hidden />;
}
