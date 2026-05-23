"use client";
import { useEffect, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { submitReviewAction, updateReviewAction, deleteReviewAction } from "@/app/actions";
import StarInput from "./StarInput";
import { HOUSE_EASE } from "@/lib/animations";

interface ExistingReview {
  _id: string;
  score: number;
  comment: string;
}

const MAX_COMMENT = 500;

export default function ReviewForm({
  hotelId,
  existing,
  onDone,
}: {
  hotelId: string;
  existing?: ExistingReview | null;
  onDone?: () => void;
}) {
  const [score, setScore] = useState<number>(existing?.score ?? 0);
  const [comment, setComment] = useState<string>(existing?.comment ?? "");
  const [editing, setEditing] = useState<boolean>(!existing);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setScore(existing?.score ?? 0);
    setComment(existing?.comment ?? "");
    setEditing(!existing);
  }, [existing?._id, existing?.score, existing?.comment]);

  const trimmed = comment.trim();
  const dirty = !existing
    ? score > 0
    : score !== existing.score || trimmed !== existing.comment.trim();
  const valid = score >= 1 && score <= 5 && trimmed.length > 0;

  const handleSubmit = () => {
    if (!valid || !dirty) return;
    startTransition(async () => {
      const res = existing
        ? await updateReviewAction(existing._id, hotelId, { score, comment: trimmed })
        : await submitReviewAction(hotelId, score, trimmed);
      if (res.success) {
        toast.success(existing ? "Review updated" : "Review posted");
        setEditing(false);
        onDone?.();
      } else {
        toast.error(res.message || "Could not save review");
      }
    });
  };

  const handleDelete = () => {
    if (!existing) return;
    startTransition(async () => {
      const res = await deleteReviewAction(existing._id, hotelId);
      if (res.success) {
        toast.success("Review removed");
        setConfirmDelete(false);
        onDone?.();
      } else {
        toast.error(res.message || "Could not delete review");
      }
    });
  };

  // Locked-in view (own review, not editing)
  if (existing && !editing) {
    return (
      <div className="glass-card-gold p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="text-[10px] tracking-[0.32em] uppercase text-gold mb-1">Your review</div>
            <StarInput value={existing.score} readOnly size={20} />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-3 py-1.5 rounded-full border border-[#dcb771]/30 text-gold text-[11px] uppercase tracking-widest hover:bg-[#dcb771]/10 transition-colors"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-3 py-1.5 rounded-full border border-red-400/30 text-red-300 text-[11px] uppercase tracking-widest hover:bg-red-400/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        {existing.comment && (
          <p className="text-white/75 text-sm leading-relaxed">{existing.comment}</p>
        )}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-400/30"
            >
              <p className="text-red-200 text-xs mb-3">Delete this review? This cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={pending}
                  className="px-3 py-1.5 rounded-full bg-red-500 text-white text-[11px] uppercase tracking-widest font-bold disabled:opacity-50"
                >
                  {pending ? "Deleting…" : "Confirm delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={pending}
                  className="px-3 py-1.5 rounded-full border border-white/15 text-white/70 text-[11px] uppercase tracking-widest"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: HOUSE_EASE }}
      className="glass-card-gold p-5"
    >
      <div className="text-[10px] tracking-[0.32em] uppercase text-gold mb-3">
        {existing ? "Edit your review" : "Write a review"}
      </div>

      <div className="mb-4">
        <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">Your rating</label>
        <StarInput value={score} onChange={setScore} />
        {score === 0 && (
          <p className="text-white/40 text-[11px] mt-2">Click a star to rate (1–5)</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-white/60 text-xs uppercase tracking-widest mb-2">Your comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          rows={4}
          placeholder="Share the highlights — what made the stay memorable?"
          className="w-full rounded-lg bg-black/30 border border-white/10 px-4 py-3 text-white/90 text-sm placeholder:text-white/30 focus:outline-none focus:border-[#dcb771]/50 transition-colors resize-y"
        />
        <div className="mt-1 flex justify-between items-center text-[11px]">
          <span className="text-white/30">
            {trimmed.length === 0 ? "Comment is required" : `${trimmed.length}/${MAX_COMMENT}`}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!valid || !dirty || pending}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-gold text-[#1a1730] text-xs font-bold uppercase tracking-widest disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-transform"
        >
          {pending && (
            <span className="w-3 h-3 border-2 border-[#1a1730] border-t-transparent rounded-full animate-spin" />
          )}
          {existing ? (pending ? "Saving…" : "Save changes") : pending ? "Posting…" : "Post review"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => {
              setScore(existing.score);
              setComment(existing.comment);
              setEditing(false);
            }}
            disabled={pending}
            className="px-5 py-2.5 rounded-full border border-white/15 text-white/70 text-xs uppercase tracking-widest hover:bg-white/[0.04] transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}
