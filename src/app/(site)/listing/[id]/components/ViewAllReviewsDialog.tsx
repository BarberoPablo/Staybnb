"use client";

import { ReviewCard } from "@/app/(site)/listing/[id]/components/ReviewCard";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { IoClose, IoStar } from "react-icons/io5";

interface Review {
  score: number;
  message: string;
  userId: string;
}

interface ViewAllReviewsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  reviews: Review[];
}

export function ViewAllReviewsDialog({ isOpen, setIsOpen, reviews }: ViewAllReviewsDialogProps) {
  const [selectedScore, setSelectedScore] = useState<number | "all">("all");
  const [sortOrder, setSortOrder] = useState<"highest" | "lowest">("highest");

  const onClose = () => {
    setIsOpen(false);
  };

  const reviewStats = useMemo(() => {
    const stats = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    reviews.forEach((review) => {
      if (review.score >= 1 && review.score <= 5) {
        stats[review.score as keyof typeof stats]++;
      }
    });

    return stats;
  }, [reviews]);

  const filteredAndSortedReviews = useMemo(() => {
    let filtered = reviews;

    if (selectedScore !== "all") {
      filtered = reviews.filter((review) => review.score === selectedScore);
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === "highest") {
        return b.score - a.score;
      } else {
        return a.score - b.score;
      }
    });

    return sorted;
  }, [reviews, selectedScore, sortOrder]);

  const averageScore = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1) : "0.0";

  const handleSort = (order: "highest" | "lowest") => {
    setSortOrder(order);
    setSelectedScore("all");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            scale: { duration: 0.2 },
          }}
          className="w-full max-w-4xl max-h-[90vh] flex flex-col"
        >
          <DialogPanel className="relative bg-white rounded-2xl shadow-2xl w-full border border-gray-100 max-h-full overflow-y-auto">
            {/* Header */}
            <div className="relative flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-myGreenExtraLight rounded-full">
                  <IoStar className="w-5 h-5 text-myGreenBold" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-semibold text-myGrayDark">All Reviews</DialogTitle>
                  <p className="text-sm text-myGray mt-1">
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""} • Average: {averageScore} stars
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-myGray hover:text-myGrayDark transition-colors duration-200 cursor-pointer"
              >
                <IoClose className="w-4 h-4 text-myGray" />
              </button>
            </div>

            {/* Stats Section */}
            <div className="px-6 py-6 bg-myGreenExtraLight/10 border-b border-gray-100">
              {/* Overall Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:gap-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-4xl font-bold text-myGreenBold">{averageScore}</div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <IoStar key={i} className="w-6 h-6 text-myGreenBold fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-myGray">
                  {reviews.length} calification{reviews.length !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Review Distribution */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((score) => {
                  const count = reviewStats[score as keyof typeof reviewStats];
                  const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                  const isSelected = selectedScore === score;

                  return (
                    <button
                      key={score}
                      onClick={() => setSelectedScore(selectedScore === score ? "all" : score)}
                      className="flex items-center gap-3 w-full group cursor-pointer"
                    >
                      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${isSelected ? "bg-myGreenBold" : "bg-myGreenSemiBold"}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-1 ">
                        <IoStar className={`w-4 h-4 ${isSelected ? "text-myGreenBold" : "text-gray-400"} fill-current`} />
                        <span className={`text-sm font-medium ${isSelected ? "text-myGreenBold" : "text-myGray"}`}>{score}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Filters */}
            <div className="px-6 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-myGray">
                <span>
                  Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
                </span>
                {selectedScore !== "all" && (
                  <button onClick={() => setSelectedScore("all")} className="text-myGreenBold hover:underline cursor-pointer">
                    Clear filter
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-myGray">Sort by:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => handleSort(e.target.value as "highest" | "lowest")}
                  className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-myGrayDark focus:outline-none focus:ring-2 focus:ring-myGreenSemiBold cursor-pointer"
                >
                  <option value="highest">Highest Score</option>
                  <option value="lowest">Lowest Score</option>
                </select>
              </div>
            </div>

            {/* Reviews List */}
            <div className="p-6">
              {filteredAndSortedReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <IoStar className="w-16 h-16 text-gray-300 mb-4" />
                  <p className="text-lg text-myGray">No reviews found with this filter</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredAndSortedReviews.map((review, index) => (
                    <ReviewCard key={`${review.userId}-${index}`} review={review} index={index} />
                  ))}
                </div>
              )}
            </div>
          </DialogPanel>
        </motion.div>
      </div>
    </Dialog>
  );
}
