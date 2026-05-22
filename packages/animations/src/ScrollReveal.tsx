"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, MotionProps } from "framer-motion";
import { fadeInUp } from "./variants";

export interface ScrollRevealProps extends MotionProps {
  children: React.ReactNode;
  variant?: "fadeInUp" | "fadeInDown" | "slideInLeft" | "slideInRight";
  delay?: number;
  threshold?: number;
  className?: string;
}

export const ScrollReveal = React.forwardRef<HTMLDivElement, ScrollRevealProps>(
  (
    { children, variant = "fadeInUp", delay = 0, threshold = 0.1, ...props },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const internalRef = useRef<HTMLDivElement>(null);
    const divRef = ref || internalRef;

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        },
        {
          threshold,
        },
      );

      const currentElement =
        typeof divRef === "function" ? undefined : divRef?.current;

      if (currentElement) {
        observer.observe(currentElement);
      }

      return () => {
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      };
    }, [divRef, threshold]);

    return (
      <motion.div
        ref={divRef}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeInUp}
        transition={{
          delay,
        }}
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

ScrollReveal.displayName = "ScrollReveal";
