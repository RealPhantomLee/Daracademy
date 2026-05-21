"use client";

import React from "react";
import { motion } from "framer-motion";

export interface PageTransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  duration?: number;
}

export const PageTransition = React.forwardRef<
  HTMLDivElement,
  PageTransitionProps
>(({ children, duration = 0.3, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration }}
      {...props}
    >
      {children}
    </motion.div>
  );
});

PageTransition.displayName = "PageTransition";
