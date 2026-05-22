"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { ScrollReveal } from "@daracademy/animations";

/**
 * Testimonials Section
 * Horizontal marquee scroll with testimonial cards and ratings
 */
export function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      grade: "Grade 11",
      stars: 5,
      quote:
        "Dara transformed my approach to learning. Her patience and expertise completely changed my confidence in math.",
    },
    {
      id: 2,
      name: "Michael Chen",
      grade: "Parent",
      stars: 5,
      quote:
        "We love seeing our son excited about school again. The progress tracking and communication are invaluable.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      grade: "Grade 9",
      stars: 5,
      quote:
        "My tutor understands my learning style and explains things in ways that actually make sense to me.",
    },
    {
      id: 4,
      name: "James Park",
      grade: "Grade 12",
      stars: 5,
      quote:
        "Improved my SAT score by 200 points in just 3 months. The personalized strategy made all the difference.",
    },
    {
      id: 5,
      name: "Jessica Williams",
      grade: "Grade 10",
      stars: 5,
      quote:
        "Finally, tutoring that feels like mentorship. Dara genuinely cares about my success and progress.",
    },
    {
      id: 6,
      name: "Alex Thompson",
      grade: "Grade 8",
      stars: 5,
      quote:
        "I went from struggling to confident in English. The essay feedback alone has been life-changing.",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-color-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal variant="fadeInUp" delay={0.1}>
          <div className="text-center mb-12 md:mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-color-navy mb-4">
              Student Success Stories
            </h2>
            <p className="text-lg text-color-slate-blue max-w-2xl mx-auto">
              Hear from students and parents who have experienced real
              transformation
            </p>
          </div>
        </ScrollReveal>

        {/* Marquee Container */}
        <div className="relative">
          <motion.div
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth"
            initial={{ x: 0 }}
            animate={{ x: -500 }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: [0, 0, 1, 1],
              repeatType: "loop",
            }}
            whileHover={{ animationPlayState: "paused" }}
            style={{
              scrollBehavior: "smooth",
            }}
          >
            {/* Render testimonials twice for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <motion.div
                key={`${testimonial.id}-${index}`}
                whileHover={{ scale: 1.02 }}
                className="glass p-6 rounded-2xl min-w-80 flex-shrink-0 hover:shadow-lg transition-all duration-300"
              >
                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-color-gold text-color-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-lg italic text-color-slate-blue leading-relaxed mb-6">
                  "{testimonial.quote}"
                </blockquote>

                {/* Author */}
                <div>
                  <p className="font-semibold text-color-navy">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-color-slate-blue">
                    {testimonial.grade}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Fade edges for visual smoothness */}
          <div className="absolute top-0 left-0 w-12 h-full bg-gradient-to-r from-color-ivory to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-12 h-full bg-gradient-to-l from-color-ivory to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
