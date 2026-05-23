"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteReviewAction } from "@/app/actions";
import type { ReviewItem } from "@/libs/getReviews";

function fmt(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function AdminReviewRow({ review }: { review: ReviewItem }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const userName = typeof review.user === "object" && review.user ? review.user.name : "Guest";
  const hotelObj = typeof review.hotel === "object" ? review.hotel : null;
  const hotelName = hotelObj?.name || "Hotel";
  const hotelId = hotelObj?._id ?? (typeof review.hotel === "string" ? review.hotel : "");

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteReviewAction(review._id, hotelId);
      if (res.success) {
        toast.success("Review removed");
        router.refresh();
      } else {
        toast.error(res.message || "Could not delete");
        setConfirming(false);
      }
    });
  };

  return (
    <article className="glass-card p-5">
      <header className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[#f5d78e] tracking-tight">{"★".repeat(review.score)}</span>
            <span className="text-white/30">{"★".repeat(5 - review.score)}</span>
            <span className="text-white font-semibold text-sm">· {userName}</span>
            <span className="text-white/40 text-xs">on {hotelName}</span>
          </div>
          <span className="text-white/40 text-[11px]">{fmt(review.createdAt)}</span>
        </div>
        <div className="flex gap-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-[2px] rounded-full">
            👍 {review.likes?.length ?? 0}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-white/40 border border-white/10 px-2 py-[2px] rounded-full">
            👎 {review.dislikes?.length ?? 0}
          </span>
        </div>
      </header>
      {review.comment && <p className="text-white/75 text-sm leading-relaxed mb-3 break-words">{review.comment}</p>}
      <footer className="flex justify-end gap-2">
        {confirming ? (
          <>
            <span className="text-red-200 text-xs self-center mr-2">Delete this review?</span>
            <button
              type="button"
              onClick={handleDelete}
              disabled={pending}
              className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[11px] uppercase tracking-widest font-bold disabled:opacity-50"
            >
              {pending ? "Deleting…" : "Confirm"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="px-3 py-1.5 rounded-full border border-white/15 text-white/70 text-[11px] uppercase tracking-widest"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="px-3 py-1.5 rounded-full border border-red-400/40 text-red-200 text-[11px] uppercase tracking-widest hover:bg-red-500/10 transition-colors"
          >
            Delete
          </button>
        )}
      </footer>
    </article>
  );
}
