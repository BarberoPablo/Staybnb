import { motion } from "framer-motion";

export function RoundButton({
  className,
  children,
  disabled,
  onClick,
}: {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.1, opacity: 1 }}
      disabled={disabled}
      className={`flex items-center justify-center w-8 h-8 cursor-pointer bg-background rounded-full opacity-80 ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}
