import { Promotion } from "@/lib/types/listing";
import { getPromotion } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { IoSparkles } from "react-icons/io5";

interface PromotionsProgressBarProps {
  promotions: Promotion[];
  currentNights: number;
}

export default function PromotionsProgressBar({ promotions, currentNights }: PromotionsProgressBarProps) {
  if (!promotions || promotions.length === 0) return null;

  // Sort promotions by min_nights
  const sortedPromotions = [...promotions].sort((a, b) => a.minNights - b.minNights);
  const activePromo = getPromotion(promotions, currentNights);
  const nextPromo = sortedPromotions.find((p) => currentNights < p.minNights);
  const maxNights = sortedPromotions[sortedPromotions.length - 1]?.minNights || 0;
  const progressPercentage = Math.min((currentNights / maxNights) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-myGrayDark">
        <span>Available Promotions</span>
        {currentNights > 0 && (
          <span className="text-xs text-myGray">
            ({currentNights} night{currentNights > 1 ? "s" : ""} selected)
          </span>
        )}
      </div>

      {/* Current Status - Fixed height container to prevent layout shift */}
      <div className="text-center min-h-[3rem] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {currentNights > 1 && (
            <>
              {activePromo && (
                <motion.div
                  key="active-promo"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-myGreenSemiBold font-medium flex items-center justify-center gap-1"
                >
                  <IoSparkles className="text-lg text-yellow-500" />
                  You&apos;re getting {activePromo.discountPercentage}% off!
                </motion.div>
              )}
              {nextPromo && (
                <motion.div
                  key="next-promo"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="text-myGray text-sm"
                >
                  Stay {nextPromo.minNights - currentNights} more night{nextPromo.minNights - currentNights > 1 ? "s" : ""} to unlock{" "}
                  {nextPromo.discountPercentage}% off
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-myGreenExtraLight to-myGreenSemiBold h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Milestones */}
        <div className="relative mt-2">
          {sortedPromotions.map((promo, index) => {
            const milestonePosition = (promo.minNights / maxNights) * 100;
            const isActive = currentNights >= promo.minNights;
            const isNext = currentNights < promo.minNights && (index === 0 || currentNights >= sortedPromotions[index - 1]?.minNights);

            return (
              <div key={promo.minNights} className="absolute transform -translate-x-1/2" style={{ top: -22, left: `${milestonePosition}%` }}>
                {/* Milestone Dot */}
                <div
                  className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-300
                  ${
                    isActive
                      ? "bg-myGreenSemiBold border-myGreenBold shadow-lg"
                      : isNext
                        ? "bg-background border-myGreenSemiBold"
                        : "bg-background border-gray-300"
                  }
                `}
                />

                {/* Milestone Label */}
                <div
                  className={`
                  absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap
                  text-xs font-medium transition-all duration-300
                  ${isActive ? "text-myGreenSemiBold" : "text-myGrayDark"}
                `}
                >
                  <div className="text-center">
                    <div className="font-semibold">{promo.minNights} nights</div>
                    <div className="text-xs">{promo.discountPercentage}% off</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
