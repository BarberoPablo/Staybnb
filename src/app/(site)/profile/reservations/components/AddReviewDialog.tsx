"use client";

import { addReviewToListing } from "@/lib/api/server/api";
import { Review } from "@/lib/types/listing";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IoClose, IoStar } from "react-icons/io5";

interface AddReviewDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  listingId: number;
  listingTitle: string;
  existingReview?: Review | null;
  onReviewAdded?: (listingId: number, score: number, message: string) => void;
}

export function AddReviewDialog({ isOpen, setIsOpen, listingId, listingTitle, existingReview, onReviewAdded }: AddReviewDialogProps) {
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (existingReview) {
      setScore(existingReview.score);
      setMessage(existingReview.message);
    } else {
      setScore(0);
      setMessage("");
    }
    setHoveredStar(0);
  }, [existingReview, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setScore(0);
    setMessage("");
    setHoveredStar(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (score === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (message.trim().length < 10) {
      toast.error("Please write at least 10 characters for your review");
      return;
    }

    setLoading(true);

    onReviewAdded?.(listingId, score, message.trim());

    try {
      const result = await addReviewToListing(listingId, score, message.trim());

      if (result.success) {
        toast.success(existingReview ? "Review updated successfully!" : "Review added successfully!");
        handleClose();
      } else {
        toast.error(result.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Failed to update review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const isFilled = starValue <= (hoveredStar || score);

      return (
        <button
          key={index}
          type="button"
          className="focus:outline-none hover:cursor-pointer"
          onClick={() => setScore(starValue)}
          onMouseEnter={() => setHoveredStar(starValue)}
          onMouseLeave={() => setHoveredStar(0)}
          disabled={loading}
        >
          <IoStar
            className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors ${isFilled ? "text-yellow-400" : "text-gray-300"} ${
              !loading ? "hover:text-yellow-400" : ""
            }`}
          />
        </button>
      );
    });
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
            scale: { duration: 0.2 },
          }}
          className="w-full max-w-md max-h-[90vh] sm:max-h-[80vh] flex flex-col"
        >
          <DialogPanel className="relative bg-white rounded-2xl shadow-2xl w-full border border-gray-100 flex flex-col max-h-full overflow-hidden">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-myGreenExtraLight rounded-full">
                  <IoStar className="w-4 h-4 sm:w-5 sm:h-5 text-myGreenSemiBold" />
                </div>
                <DialogTitle className="text-lg sm:text-xl font-semibold text-myGrayDark">{existingReview ? "Edit Review" : "Add Review"}</DialogTitle>
              </div>
              <button
                onClick={handleClose}
                disabled={loading}
                className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer"
              >
                <IoClose className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-myGray" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-myGrayDark mb-1 sm:mb-2 line-clamp-2">{listingTitle}</h3>
                  <p className="text-xs sm:text-sm text-myGray">{existingReview ? "Update your review" : "How was your experience?"}</p>
                </div>

                {/* Star Rating */}
                <div className="space-y-2 sm:space-y-3">
                  <label className="block text-sm font-medium text-myGrayDark">Rating *</label>
                  <div className="flex gap-0.5 sm:gap-1 justify-center sm:justify-start">{renderStars()}</div>
                  {score > 0 && (
                    <p className="text-xs sm:text-sm text-myGray text-center sm:text-left">
                      {score} star{score !== 1 ? "s" : ""} -{" "}
                      {score === 1 ? "Poor" : score === 2 ? "Fair" : score === 3 ? "Good" : score === 4 ? "Very Good" : "Excellent"}
                    </p>
                  )}
                </div>

                {/* Review Message */}
                <div className="space-y-2 sm:space-y-3">
                  <label htmlFor="review-message" className="block text-sm font-medium text-myGrayDark">
                    Your Review *
                  </label>
                  <textarea
                    id="review-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your experience with other travelers..."
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl bg-white text-myGrayDark placeholder-myGray focus:outline-none focus:ring-2 focus:ring-myGreenSemiBold focus:border-transparent resize-none text-sm sm:text-base"
                    disabled={loading}
                    maxLength={500}
                  />
                  <div className="flex justify-between text-xs text-myGray">
                    <span>Minimum 10 characters</span>
                    <span>{message.length}/500</span>
                  </div>
                </div>
              </form>
            </div>

            {/* Actions - Fixed at bottom */}
            <div className="flex gap-2 sm:gap-3 p-4 sm:p-6 pt-0 border-t border-gray-100 flex-shrink-0">
              <button
                type="button"
                disabled={loading}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-100 text-myGrayDark rounded-xl font-medium transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer text-sm sm:text-base"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || score === 0 || message.trim().length < 10}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-myGreenSemiBold text-white rounded-xl font-medium transition-colors hover:bg-myGreen disabled:opacity-50 disabled:cursor-not-allowed hover:cursor-pointer text-sm sm:text-base"
                onClick={handleSubmit}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{existingReview ? "Updating..." : "Adding..."}</span>
                  </div>
                ) : existingReview ? (
                  "Update Review"
                ) : (
                  "Add Review"
                )}
              </button>
            </div>
          </DialogPanel>
        </motion.div>
      </div>
    </Dialog>
  );
}
