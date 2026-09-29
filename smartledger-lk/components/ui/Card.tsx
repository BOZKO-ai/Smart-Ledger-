
import React from "react";
import { motion } from "framer-motion";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  variant?: "default" | "glass" | "gradient" | "glow";
  padding?: boolean;
}

const variantClasses: Record<string, string> = {
  default:
    "bg-white/90 dark:bg-neutral-900/90 border border-neutral-200/70 dark:border-neutral-800/70 shadow-card dark:shadow-layered-dark backdrop-blur-sm",
  glass:
    "glass border border-white/40 dark:border-white/10 shadow-layered dark:shadow-layered-dark",
  gradient:
    "bg-white/90 dark:bg-neutral-900/90 border-gradient shadow-card dark:shadow-layered-dark backdrop-blur-sm",
  glow:
    "bg-white/90 dark:bg-neutral-900/90 border border-brand-200/60 dark:border-brand-700/40 shadow-glow-brand-sm backdrop-blur-sm",
};

export const Card: React.FC<CardProps> = ({
  children,
  hover = false,
  variant = "default",
  className = "",
  ...props
}) => {
  return (
    <motion.div
      initial={false}
      whileHover={
        hover
          ? { y: -5, transition: { duration: 0.2, ease: "easeOut" } }
          : {}
      }
      className={`rounded-3xl transition-all duration-300 ${variantClasses[variant]} ${
        hover
          ? "cursor-pointer hover:shadow-card-hover dark:hover:shadow-layered-lg-dark"
          : ""
      } ${className}`}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};
