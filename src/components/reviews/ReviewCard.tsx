"use client";
import { motion } from "framer-motion";
import { HOUSE_EASE } from "@/lib/animations";
import StarInput from "./StarInput";
import LikeDislikeButtons from "./LikeDislikeButtons";
import type { ReviewItem } from "@/libs/getReviews";

function initialOf(name?: string | null) {
  if (!name) return "?";
  const trimmed = name.trim();
  return trimmed.length === 0 ? "?" : trimmed[0].toUpperCase();
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ReviewCard({
  review,
  currentUserId,
  isAdmin,
  isLoggedIn,
}: {
  review: ReviewItem;
  currentUserId?: string;
  isAdmin: boolean;
  isLoggedIn: boolean;
}) {
  const userObj = review.user && typeof review.user === "object" ? review.user : null;
  const userName = userObj?.name ?? "Guest";
  const userId = userObj?._id;
  const myVote: "like" | "dislike" | null = currentUserId
    ? review.likes?.includes(currentUserId)
      ? "like"
      : review.dislikes?.includes(currentUserId)
      ? "dislike"
      : null
    : null;
  const isMine = !!(currentUserId && userId && currentUserId === userId);

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: HOUSE_EASE }}
      className="glass-card p-5 md:p-6"
    >
      <header className="flex items-start gap-3 mb-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
          style={{
            background: "linear-gradient(135deg, rgba(245,215,142,0.25), rgba(220,183,113,0.15))",
            color: "#f5d78e",
            border: "1px solid rgba(220,183,113,0.3)",
          }}
        >
          {initialOf(userName)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white font-semibold text-sm truncate">{userName}</span>
            {isMine && (
              <span className="text-[9px] uppercase tracking-widest text-gold border border-[#dcb771]/30 rounded-full px-2 py-[1px]">
                You
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <StarInput value={review.score} readOnly size={14} />
            <span className="text-white/40 text-[11px]">{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </header>

      {review.comment && (
        <p className="text-white/75 text-sm leading-relaxed mb-3 break-words">{review.comment}</p>
      )}

      <footer className="flex items-center justify-between">
        <LikeDislikeButtons
          reviewId={review._id}
          initialLikes={review.likes?.length ?? 0}
          initialDislikes={review.dislikes?.length ?? 0}
          initialVote={myVote}
          isLoggedIn={isLoggedIn}
          showDislikeCount={isAdmin}
        />
      </footer>
    </motion.article>
  );
}
