"use client";

import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex flex-col absolute z-10 left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center py-16">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-myGreenSemiBold">
        <FaSpinner className="w-8 h-8" />
      </motion.div>
      <p className="text-myGray mt-4">Loading your listings...</p>
    </div>
  );
}
