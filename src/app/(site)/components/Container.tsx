"use client";

import { windowWidth } from "@/lib/utils";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function Container({
  children,
  style,
  className,
  noPadding,
}: {
  children: React.ReactNode;
  className?: string;
  style?: Record<string, string | number>;
  noPadding?: boolean;
}) {
  const pathname = usePathname();
  const fullWidth = !windowWidth.shortPath(pathname);

  return (
    <motion.div
      className={`${noPadding ? "" : "px-12 py-10"} w-full ${className}`}
      style={style}
      initial={{ maxWidth: fullWidth ? windowWidth.full : windowWidth.short }}
      animate={{ maxWidth: fullWidth ? windowWidth.full : windowWidth.short }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
