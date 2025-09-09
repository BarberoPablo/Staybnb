"use client";

import { useRouter } from "nextjs-toploader/app";
import React from "react";
import { motion } from "framer-motion";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function HostListingsHeader() {
  const router = useRouter();
  const xs = useMediaQuery("(max-width: 575px)");

  const handleGoBack = () => {
    router.push("/hosting");
  };

  const handleCreateListing = () => {
    router.push("/hosting/create");
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>
      <div className="flex relative items-center gap-4 justify-between mb-6 sm:mb-0">
        <button
          onClick={handleGoBack}
          className="flex sm:absolute left-0 top-0 items-center gap-2 px-6 py-3 rounded-lg bg-white/60 backdrop-blur-sm border border-gray-200 hover:bg-white/80 transition-all duration-200 hover:cursor-pointer"
        >
          <FaArrowLeft className="w-4 h-4 text-myGrayDark" />
          <span className="text-myGrayDark font-medium">{xs ? "Back" : "Back to Dashboard"}</span>
        </button>

        <button
          onClick={handleCreateListing}
          className="flex sm:absolute right-0 top-0 items-center gap-2 px-6 py-3 rounded-xl bg-myGreenSemiBold text-white font-semibold hover:bg-myGreenBold transition-all duration-200 hover:cursor-pointer shadow-lg hover:shadow-xl"
        >
          <FaPlus className="w-4 h-4" />
          {xs ? "Create" : "Create New Listing"}
        </button>
      </div>

      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-myGreenExtraLight">
            <MdOutlineDashboard className="w-8 h-8 text-myGreenSemiBold" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-myGrayDark mb-4">My Listings</h1>
        <p className="text-lg text-myGray max-w-2xl mx-auto">Manage your properties, track performance, and optimize your hosting business</p>
      </div>
    </motion.div>
  );
}
