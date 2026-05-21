"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ScrollReveal } from "@daracademy/animations";

/**
 * About Section
 * Alternating image/text layout with 3 panels
 */
export const AboutSection = () => {
  const panelVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-color-ivory">
      <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
        {/* Panel 1: Text Left, Image Right */}
        <ScrollReveal variant="slideInLeft" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              variants={panelVariants}
              className="flex flex-col gap-6"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-color-navy">
                Meet Dara
              </h2>
              <p className="text-lg text-color-slate-blue leading-relaxed">
                With over a decade of teaching experience, Dara has dedicated
                her career to understanding how students learn best. She
                believes that every student has unique potential waiting to be
                unlocked.
              </p>
              <p className="text-lg text-color-slate-blue leading-relaxed">
                Her personalized approach combines rigorous academics with
                genuine mentorship, creating an environment where students don't
                just learn—they thrive.
              </p>
            </motion.div>
            <motion.div
              variants={panelVariants}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
              style={{
                boxShadow:
                  "0 20px 40px rgba(212, 165, 116, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-color-slate-blue to-color-navy flex items-center justify-center">
                <div className="text-center text-color-ivory">
                  <p className="font-serif text-2xl mb-2">Dara Main Page</p>
                  <p className="text-sm opacity-75">Image placeholder</p>
                </div>
              </div>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Panel 2: Image Left, Text Right */}
        <ScrollReveal variant="slideInRight" delay={0.1}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              variants={panelVariants}
              className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl md:order-2"
              style={{
                boxShadow:
                  "0 20px 40px rgba(212, 165, 116, 0.2), 0 8px 16px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-color-gold/20 to-color-slate-blue/20 flex items-center justify-center">
                <div className="text-center text-color-navy">
                  <p className="font-serif text-2xl mb-2">Dara About Page</p>
                  <p className="text-sm opacity-75">Image placeholder</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              variants={panelVariants}
              className="flex flex-col gap-6 md:order-1"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-color-navy">
                Our Approach
              </h2>
              <p className="text-lg text-color-slate-blue leading-relaxed">
                We believe in a student-centered, holistic approach to
                education. Rather than focusing solely on grades, we develop
                critical thinking skills, build confidence, and foster a genuine
                love of learning.
              </p>
              <p className="text-lg text-color-slate-blue leading-relaxed">
                Each session is tailored to your learning style, pace, and
                goals. We celebrate progress, identify knowledge gaps, and
                create sustainable improvement strategies.
              </p>
            </motion.div>
          </div>
        </ScrollReveal>

        {/* Panel 3: 2x2 Photo Grid with Pull-Quotes */}
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <div className="space-y-8">
            <h2 className="font-serif text-4xl md:text-5xl text-color-navy text-center">
              Why Students Choose Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl overflow-hidden p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-color-slate-blue to-color-navy flex items-center justify-center">
                  <div className="text-center text-color-ivory">
                    <p className="font-serif text-lg">Photo 1</p>
                  </div>
                </div>
                <blockquote className="text-lg italic text-color-slate-blue leading-relaxed">
                  "Dara transformed my approach to learning. Her patience and
                  expertise are unmatched."
                </blockquote>
                <p className="text-sm text-color-navy font-semibold mt-4">
                  Sarah, Grade 11
                </p>
              </motion.div>

              {/* Card 2 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl overflow-hidden p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-color-gold/30 to-color-slate-blue/30 flex items-center justify-center">
                  <div className="text-center text-color-navy">
                    <p className="font-serif text-lg">Photo 2</p>
                  </div>
                </div>
                <blockquote className="text-lg italic text-color-slate-blue leading-relaxed">
                  "I improved my SAT score by 200 points. The personalized
                  strategy made all the difference."
                </blockquote>
                <p className="text-sm text-color-navy font-semibold mt-4">
                  Marcus, Grade 12
                </p>
              </motion.div>

              {/* Card 3 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl overflow-hidden p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-color-sage/30 to-color-navy/30 flex items-center justify-center">
                  <div className="text-center text-color-navy">
                    <p className="font-serif text-lg">Photo 3</p>
                  </div>
                </div>
                <blockquote className="text-lg italic text-color-slate-blue leading-relaxed">
                  "Finally, tutoring that feels like mentorship. Dara genuinely
                  cares about my success."
                </blockquote>
                <p className="text-sm text-color-navy font-semibold mt-4">
                  Jessica, Grade 10
                </p>
              </motion.div>

              {/* Card 4 */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass rounded-2xl overflow-hidden p-6 h-full flex flex-col justify-between hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 md:h-56 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-color-slate-blue/20 to-color-gold/20 flex items-center justify-center">
                  <div className="text-center text-color-navy">
                    <p className="font-serif text-lg">Photo 4</p>
                  </div>
                </div>
                <blockquote className="text-lg italic text-color-slate-blue leading-relaxed">
                  "Dara doesn't just teach—she empowers. I've gone from
                  struggling to confident in math."
                </blockquote>
                <p className="text-sm text-color-navy font-semibold mt-4">
                  Alex, Grade 9
                </p>
              </motion.div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
