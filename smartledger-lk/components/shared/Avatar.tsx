
import React from "react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Avatar Component.
 * Displays profile placeholder or actual photo of the business user.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = "User",
  size = "md",
}) => {
  const initial = name.charAt(0).toUpperCase();
  const sizeClasses = {
    sm: "h-8 w-8 text-sm",
    md: "h-10 w-10 text-base",
    lg: "h-12 w-12 text-lg",
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-brand-500 text-white flex items-center justify-center font-bold shadow-layered-sm dark:shadow-layered-sm-dark overflow-hidden select-none`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
};
