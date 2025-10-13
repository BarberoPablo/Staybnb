import { motion } from "framer-motion";
import { CiUser } from "react-icons/ci";
import { IoStar } from "react-icons/io5";

interface ReviewCardProps {
  review: {
    score: number;
    message: string;
    userId: string;
  };
  index?: number;
  showFullDetails?: boolean;
}

export function ReviewCard({ review, index = 0, showFullDetails = true }: ReviewCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-r from-myGreenExtraLight/20 to-myGreenLight/10 border border-myGreenLight/30 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-myGreenLight to-myGreenBold rounded-full flex items-center justify-center">
          <CiUser className="w-6 h-6 text-white" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <IoStar key={i} className={`w-4 h-4 ${i < review.score ? "text-yellow-500 fill-current" : "text-gray-300"}`} />
              ))}
            </div>
            <span className="text-sm font-semibold text-myGrayDark">{review.score}.0</span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <p className="text-myGray leading-relaxed text-base">{review.message}</p>
        {showFullDetails && (
          <div className="flex items-center gap-2 text-sm text-myGray mt-2">
            <span className="font-medium">Guest</span>
            <span>•</span>
            <span>Verified stay</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
