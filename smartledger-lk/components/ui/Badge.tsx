
import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "brand" | "success" | "warning" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-300",
    success: "bg-success-50 text-success-700 dark:bg-success-500/20 dark:text-success-400",
    warning: "bg-warning-50 text-warning-700 dark:bg-warning-500/20 dark:text-warning-400",
    danger: "bg-danger-50 text-danger-700 dark:bg-danger-500/20 dark:text-danger-400",
    secondary: "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs rounded-full",
    md: "px-3 py-1 text-xs font-medium rounded-full",
    lg: "px-4 py-1.5 text-sm font-medium rounded-full",
  };

  return (
    <span className={`inline-flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

