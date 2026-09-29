
import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  radius?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  width,
  height,
  radius = "rounded-xl",
}) => {
  return (
    <div
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 ${radius} ${className}`}
      style={{ width, height }}
    />
  );
};

export const AuthPageSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <Skeleton className="h-10 w-3/4 mx-auto" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    </div>
  );
};

