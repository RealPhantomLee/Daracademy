"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "primary"
    | "secondary"
    | "gold"
    | "success"
    | "warning"
    | "error";
  size?: "sm" | "md";
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variants = {
      default: "bg-slate-blue/10 text-slate-blue",
      primary: "bg-navy/10 text-navy",
      secondary: "bg-sage/10 text-sage",
      gold: "bg-gold/10 text-gold",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-block font-medium rounded-full",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      />
    );
  },
);

Badge.displayName = "Badge";

export { Badge };
