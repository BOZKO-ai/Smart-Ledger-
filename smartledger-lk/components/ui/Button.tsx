
import React from "react";
import { motion } from "framer-motion";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline" | "destructive" | "danger" | "glow";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  disabled,
  ...props
}) => {
  const base =
    "relative inline-flex items-center justify-center rounded-2xl font-semibold " +
    "transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointer-events-none touch-target overflow-hidden select-none";

  const variants: Record<string, string> = {
    primary:
      "bg-brand-gradient text-white shadow-glow-brand-sm " +
      "hover:opacity-90 hover:shadow-glow-brand focus:ring-brand-500",
    secondary:
      "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 " +
      "dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700 focus:ring-neutral-500",
    ghost:
      "text-neutral-700 hover:bg-neutral-100 " +
      "dark:text-neutral-300 dark:hover:bg-neutral-800 focus:ring-neutral-500",
    outline:
      "border border-neutral-200 text-neutral-700 bg-white/60 hover:bg-neutral-50 " +
      "dark:border-neutral-700 dark:text-neutral-300 dark:bg-transparent dark:hover:bg-neutral-800 " +
      "backdrop-blur-sm focus:ring-neutral-500",
    destructive:
      "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 " +
      "shadow-glow-danger focus:ring-danger-500",
    danger:
      "bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700 " +
      "shadow-glow-danger focus:ring-danger-500",
    glow:
      "bg-brand-gradient text-white shadow-glow-brand animate-pulse-glow " +
      "hover:opacity-90 focus:ring-brand-500",
  };

  const sizes: Record<string, string> = {
    sm:   "px-3.5 py-2 text-sm gap-1.5",
    md:   "px-5 py-2.5 text-base gap-2",
    lg:   "px-7 py-3.5 text-lg gap-2.5",
    icon: "p-2.5",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {/* Shimmer overlay on primary */}
      {(variant === "primary" || variant === "glow") && (
        <span className="absolute inset-0 shimmer rounded-2xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity" />
      )}

      {loading ? (
        <>
          <svg
            className="animate-spin w-4 h-4 mr-2 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          Loading…
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};
