"use client";

import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";

export default function Loading() {
  return (
    <div className="flex flex-col relative w-full flex-grow min-h-screen py-8 px-6 sm:px-12 gap-8">
      {/* Header Skeleton */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
        <div className="flex relative items-center gap-4 justify-between mb-6 sm:mb-0">
          <div className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 animate-pulse">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
          </div>
          <div className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-200 animate-pulse">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            <div className="w-32 h-4 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gray-200 animate-pulse">
              <div className="w-8 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-4 max-w-md mx-auto"></div>
          <div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-2xl mx-auto"></div>
        </div>
      </motion.div>

      {/* Loading Spinner */}
      <div className="flex flex-col absolute z-10 left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center py-16">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="text-myGreenSemiBold">
          <FaSpinner className="w-8 h-8" />
        </motion.div>
        <p className="text-myGray mt-4">Loading your listings...</p>
      </div>

      {/* Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-2xl shadow-lg border border-gray-300 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="flex gap-2 mt-4">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse flex-1"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Status Skeleton */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <div className="bg-white/60 rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="text-center">
                <div className="h-8 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
