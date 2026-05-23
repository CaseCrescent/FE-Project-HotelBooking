"use client";
import { useState } from "react";

// Interactive 1-5 star input. Hover-preview, click to set.
export default function StarInput({
  value,
  onChange,
  size = 28,
  readOnly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  readOnly?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  return (
    <div
      className="inline-flex items-center gap-1 select-none"
      onMouseLeave={() => setHover(null)}
      role="radiogroup"
      aria-label="Rating"
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= display;
        return (
          <button
            key={i}
            type="button"
            disabled={readOnly}
            onClick={() => !readOnly && onChange?.(i)}
            onMouseEnter={() => !readOnly && setHover(i)}
            className="leading-none transition-transform hover:scale-110 disabled:cursor-default"
            aria-label={`${i} star${i === 1 ? "" : "s"}`}
            aria-checked={value === i}
            role="radio"
            style={{
              fontSize: size,
              color: filled ? "#f5d78e" : "rgba(255,255,255,0.2)",
              cursor: readOnly ? "default" : "pointer",
              textShadow: filled ? "0 0 10px rgba(245,215,142,0.4)" : "none",
            }}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
