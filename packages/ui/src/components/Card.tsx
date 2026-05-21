"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border border-slate-blue/20 bg-ivory",
      elevated: "shadow-lg bg-ivory",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 transition-all",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

export { Card };
