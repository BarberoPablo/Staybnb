import { motion } from "framer-motion";

interface FavoritesSummaryProps {
  favoritesCount: number;
}

export function FavoritesSummary({ favoritesCount }: FavoritesSummaryProps) {
  return (
    <motion.div
      className="bg-myGreenLight rounded-xl p-6 border border-myGreenBold/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-myGrayDark">Favorites Summary</h3>
          <p className="text-myGray text-sm">Keep track of your saved places</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-myGrayDark">{favoritesCount}</div>
          <div className="text-sm text-myGray">Total Favorites</div>
        </div>
      </div>
    </motion.div>
  );
}
