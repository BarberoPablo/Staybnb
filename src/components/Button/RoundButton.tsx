import { motion } from "framer-motion";

export function RoundButton({
  className,
  style,
  children,
  disabled,
  onClick,
}: {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
}) {
  return (
    <motion.button
      transition={{ duration: 0.2, ease: "easeOut" }}
      whileHover={{ scale: 1.1 }}
      disabled={disabled}
      className={`flex items-center justify-center w-8 h-8 cursor-pointer bg-background rounded-full ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </motion.button>
  );
}
