"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: "sm" | "md" | "lg";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, blur = "md", ...props }, ref) => {
    const blurLevels = {
      sm: "backdrop-blur-sm",
      md: "backdrop-blur-md",
      lg: "backdrop-blur-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "glass rounded-2xl p-6 bg-white/10 border border-white/20 transition-all",
          blurLevels[blur],
          className,
        )}
        {...props}
      />
    );
  },
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
