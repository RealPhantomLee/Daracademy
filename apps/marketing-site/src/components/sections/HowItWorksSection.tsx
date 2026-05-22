"use client";

import React, { useRef } from "react";
import { motion, easeInOut } from "framer-motion";
import { MessageCircle, Calendar, Zap, Trophy } from "lucide-react";
import {
  ScrollReveal,
  staggerContainer,
  staggerItem,
} from "@daracademy/animations";

/**
 * How It Works Section
 * 4-step flow with animated SVG path and numbered steps
 */
export function HowItWorksSection() {
  const svgRef = useRef<SVGSVGElement>(null);

  const steps = [
    {
      number: 1,
      title: "Inquire",
      description: "Tell us about your goals and challenges",
      icon: MessageCircle,
    },
    {
      number: 2,
      title: "Schedule",
      description: "Book your first personalized session",
      icon: Calendar,
    },
    {
      number: 3,
      title: "Learn",
      description: "Work through concepts at your pace",
      icon: Zap,
    },
    {
      number: 4,
      title: "Achieve",
      description: "Reach your academic goals",
      icon: Trophy,
    },
  ];

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: easeInOut,
        delay: 0.3,
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-color-ivory">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-color-navy mb-4">
              How It Works
            </h2>
            <p className="text-lg text-color-slate-blue max-w-2xl mx-auto">
              A simple, personalized journey to academic success
            </p>
          </div>
        </ScrollReveal>

        {/* Desktop: Grid with connecting path */}
        <div className="hidden md:block relative">
          {/* Animated SVG Path */}
          <svg
            ref={svgRef}
            className="absolute top-0 left-0 w-full h-full"
            style={{ pointerEvents: "none" }}
            viewBox="0 0 1000 300"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 100 150 L 900 150"
              stroke="rgba(212, 165, 116, 0.3)"
              strokeWidth="2"
              fill="none"
              variants={pathVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            />
          </svg>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-4 gap-8 relative"
          >
            {steps.map((step) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={staggerItem}
                  className="flex flex-col items-center gap-4"
                >
                  {/* Number Circle */}
                  <div className="relative z-10">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 rounded-full bg-color-gold text-color-navy flex items-center justify-center font-bold text-2xl shadow-lg"
                    >
                      {step.number}
                    </motion.div>
                  </div>

                  {/* Icon */}
                  <IconComponent className="w-8 h-8 text-color-gold" />

                  {/* Content */}
                  <div className="text-center">
                    <h3 className="font-serif text-2xl text-color-navy mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-color-slate-blue">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Mobile: Stacked vertical */}
        <div className="md:hidden">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {steps.map((step) => (
              <motion.div
                key={step.number}
                variants={staggerItem}
                className="glass p-6 rounded-2xl flex gap-4"
              >
                <div className="flex-shrink-0">
                  <motion.div className="w-16 h-16 rounded-full bg-color-gold text-color-navy flex items-center justify-center font-bold text-xl">
                    {step.number}
                  </motion.div>
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl text-color-navy mb-2">
                    {step.title}
                  </h3>
                  <p className="text-color-slate-blue">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
