"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@daracademy/animations";
import { CalendlyEmbed } from "@/components/integrations/CalendlyEmbed";

/**
 * Schedule Section
 * CTA section with soft gold gradient background and Calendly embed
 */
export function ScheduleSection() {
  return (
    <section className="w-full py-24 px-4 md:px-8 bg-gradient-to-br from-color-gold/10 to-color-sage/10">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl md:text-5xl text-color-navy">
              Ready to Start?
            </h2>
            <p className="text-lg text-color-slate-blue max-w-xl">
              Schedule a free consultation with Dara to discuss your goals and create a
              personalized learning plan.
            </p>
          </div>
        </ScrollReveal>

        {/* Calendly Embed */}
        <ScrollReveal variant="fadeInUp" delay={0.2} className="w-full">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            className="w-full"
          >
            <CalendlyEmbed
              url="https://calendly.com/placeholder"
              height={700}
              className="rounded-2xl overflow-hidden shadow-lg"
            />
          </motion.div>
        </ScrollReveal>

        {/* CTA Button */}
        <ScrollReveal variant="fadeInUp" delay={0.3}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 md:py-5 bg-color-gold text-color-navy font-semibold rounded-lg shadow-lg hover:shadow-xl hover:shadow-color-gold/30 transition-all duration-300"
          >
            Get Started Today
          </motion.button>
        </ScrollReveal>
      </div>
    </section>
  );
}
