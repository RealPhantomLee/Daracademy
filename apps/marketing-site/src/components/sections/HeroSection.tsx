"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { NoahWidget } from "@daracademy/noah-engine";

/**
 * Hero Section
 * Full-viewport landing hero with 2-col layout (text left, Noah right)
 * Features staggered headline animation and scroll indicator
 */
export function HeroSection() {
  const headlineWords = ["Confidence", "Begins", "With", "Understanding."];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const scrollIndicatorVariants = {
    animate: {
      y: [0, 8, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const noahVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        delay: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center py-16 md:py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Container */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left Column - Text Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6 md:gap-8"
        >
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
            }}
            className="text-xs md:text-sm font-semibold tracking-widest uppercase text-color-gold"
          >
            Premium 1-on-1 Tutoring
          </motion.div>

          {/* Main Headline with Staggered Words */}
          <motion.h1
            variants={containerVariants}
            className="font-serif text-4xl md:text-6xl lg:text-7xl leading-tight text-color-navy"
          >
            {headlineWords.map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                variants={wordVariants}
                className="inline-block"
              >
                {word}
                {index < headlineWords.length - 1 && <span> </span>}
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.4 },
              },
            }}
            className="text-lg md:text-xl text-color-slate-blue leading-relaxed max-w-md"
          >
            Expert-led tutoring sessions designed to build confidence and
            mastery in every subject.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, delay: 0.5 },
              },
            }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            {/* Primary CTA */}
            <button className="px-8 py-3 md:py-4 bg-transparent border-2 border-color-gold text-color-gold font-semibold rounded-lg hover:bg-color-gold hover:text-color-navy transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-color-gold/30">
              Book a Free Consultation
            </button>

            {/* Secondary CTA */}
            <button className="px-8 py-3 md:py-4 bg-color-navy text-color-ivory font-semibold rounded-lg hover:bg-color-slate-blue transition-all duration-300">
              Explore Daracademy
            </button>
          </motion.div>
        </motion.div>

        {/* Right Column - Noah Character */}
        <motion.div
          variants={noahVariants}
          initial="hidden"
          animate="visible"
          className="flex justify-center items-center"
        >
          <NoahWidget />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        variants={scrollIndicatorVariants}
        animate="animate"
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-6 h-6 text-color-gold" />
      </motion.div>
    </section>
  );
}
