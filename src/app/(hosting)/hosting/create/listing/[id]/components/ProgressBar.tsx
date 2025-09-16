"use client";

import { hostingSteps } from "@/lib/types/hostingSteps";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function ProgressBar() {
  const pathname = usePathname();
  const currentStepIndex = hostingSteps.findIndex((step) => pathname.includes(step));
  const progress = ((currentStepIndex + 1) / hostingSteps.length) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
      <motion.div
        className="bg-myGreenSemiBold h-2 rounded-full transition-all duration-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
