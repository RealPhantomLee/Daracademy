"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@daracademy/animations";

/**
 * Final CTA Section
 * High-impact closing section with gradient background and celebration animation
 */
export function FinalCTASection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="w-full py-32 px-4 md:px-8 bg-gradient-to-r from-color-navy via-color-slate-blue to-color-navy relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-color-gold/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-color-sage/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col items-center gap-8"
        >
          {/* Headline */}
          <motion.h2
            variants={itemVariants}
            className="font-serif text-4xl md:text-6xl text-color-ivory leading-tight"
          >
            Take the Next Step
          </motion.h2>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-color-ivory/90 max-w-2xl"
          >
            Join students and families who have transformed their academic journey. Your first
            consultation is free.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-10 py-4 md:py-5 bg-color-gold text-color-navy font-bold rounded-lg text-lg shadow-2xl hover:shadow-3xl hover:shadow-color-gold/40 transition-all duration-300"
          >
            Get Started Today
          </motion.button>

          {/* Celebration animation with Noah */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8"
          >
            <motion.div
              animate={{
                y: [-5, 5, -5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-6xl"
            >
              🎓
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
