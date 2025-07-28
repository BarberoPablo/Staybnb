"use client";

import { windowWidth } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Container({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const fullWidth = !windowWidth.shortPath(pathname);

  return (
    <motion.div
      className="w-full px-12 my-10"
      initial={{ maxWidth: fullWidth ? windowWidth.full : windowWidth.short }}
      animate={{ maxWidth: fullWidth ? windowWidth.full : windowWidth.short }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
