"use client";

import { motion } from "framer-motion";

export default function Stats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="mt-16 max-w-4xl mx-auto"
    >
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-myGrayDark mb-6 text-center">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-xl bg-myGreenExtraLight/50">
            <div className="text-3xl font-bold text-myGreenSemiBold mb-2">0</div>
            <div className="text-myGray">Active Listings</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-myPurple/30">
            <div className="text-3xl font-bold text-myGrayDark mb-2">0</div>
            <div className="text-myGray">Total Bookings</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-myGreenLight/50">
            <div className="text-3xl font-bold text-myGreenSemiBold mb-2">$0</div>
            <div className="text-myGray">Total Earnings</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
