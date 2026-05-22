"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import {
  ScrollReveal,
  staggerContainer,
  staggerItem,
} from "@daracademy/animations";

/**
 * Guardian Section
 * Parent trust section with trust-building features in grid layout
 */
export function GuardianSection() {
  const trustPoints = [
    {
      id: "progress",
      title: "Transparent Progress",
      description:
        "Real-time progress tracking and detailed reports every step of the way",
    },
    {
      id: "communication",
      title: "Direct Communication",
      description:
        "Easy contact with Dara to discuss your student's growth and goals",
    },
    {
      id: "scheduling",
      title: "Flexible Scheduling",
      description:
        "Sessions fit your family's schedule with convenient booking options",
    },
    {
      id: "goals",
      title: "Goal Tracking",
      description:
        "Customizable learning milestones and measurable achievement metrics",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-color-ivory">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-color-navy mb-4">
              Parents Trust Us
            </h2>
            <p className="text-lg text-color-slate-blue max-w-2xl mx-auto">
              We provide transparency, communication, and measurable results for
              every student
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {trustPoints.map((point) => (
            <motion.div
              key={point.id}
              variants={staggerItem}
              whileHover={{ scale: 1.05 }}
              className="glass p-6 rounded-2xl flex flex-col gap-4 hover:shadow-lg transition-all duration-300"
            >
              <CheckCircle className="w-8 h-8 text-color-gold flex-shrink-0" />
              <h3 className="font-serif text-2xl text-color-navy">
                {point.title}
              </h3>
              <p className="text-color-slate-blue leading-relaxed">
                {point.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
