"use client";

import React from "react";
import { cn } from "../lib/cn";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, initials, size = "md", ...props }, ref) => {
    const sizes = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base",
      xl: "h-16 w-16 text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-navy to-slate-blue text-ivory font-semibold",
          sizes[size],
          className,
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials || "?"
        )}
      </div>
    );
  },
);

Avatar.displayName = "Avatar";

export { Avatar };
