"use client";

import { motion } from "framer-motion";
import { MdOutlineDashboard } from "react-icons/md";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="text-center mb-12"
    >
      <div className="flex items-center justify-center mb-4">
        <div className="p-3 rounded-full bg-myGreenExtraLight">
          <MdOutlineDashboard className="w-8 h-8 text-myGreenSemiBold" />
        </div>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">Hosting Dashboard</h1>
      <p className="text-lg text-myGray max-w-2xl mx-auto">Manage your properties, track bookings, and grow your hosting business</p>
    </motion.div>
  );
}
