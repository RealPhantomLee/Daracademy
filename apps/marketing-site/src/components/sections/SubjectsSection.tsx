"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Pencil,
  Microscope,
  Landmark,
  CheckCircle,
  FileText,
} from "lucide-react";
import {
  ScrollReveal,
  staggerContainer,
  staggerItem,
} from "@daracademy/animations";

/**
 * Subjects Section
 * Grid layout with subject cards featuring icons
 */
export function SubjectsSection() {
  const subjects = [
    {
      id: "math",
      name: "Math",
      description:
        "Algebra, geometry, trigonometry, and calculus mastery through problem-solving strategies.",
      icon: BookOpen,
    },
    {
      id: "english",
      name: "English & Writing",
      description:
        "Literary analysis, essay writing, and communication skills for academic success.",
      icon: Pencil,
    },
    {
      id: "science",
      name: "Science",
      description:
        "Biology, chemistry, and physics concepts explained with real-world applications.",
      icon: Microscope,
    },
    {
      id: "history",
      name: "History & Social Studies",
      description:
        "Critical thinking about historical events and cultural perspectives.",
      icon: Landmark,
    },
    {
      id: "test-prep",
      name: "Test Prep",
      description:
        "SAT and ACT prep with proven strategies and practice techniques.",
      icon: CheckCircle,
    },
    {
      id: "essays",
      name: "College Essays",
      description:
        "Craft compelling personal narratives for college applications.",
      icon: FileText,
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-color-ivory">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-color-navy mb-4">
              What We Teach
            </h2>
            <p className="text-lg text-color-slate-blue max-w-2xl mx-auto">
              Expert tutoring across all major subjects, from foundational
              concepts to advanced preparation.
            </p>
          </div>
        </ScrollReveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {subjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <motion.div
                key={subject.id}
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                className="glass p-6 rounded-2xl flex flex-col gap-4 cursor-pointer hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-8 h-8 text-color-gold flex-shrink-0" />
                  <h3 className="font-serif text-2xl text-color-navy">
                    {subject.name}
                  </h3>
                </div>
                <p className="text-color-slate-blue leading-relaxed">
                  {subject.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
