"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function TestimonialSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-24 sm:py-32 bg-white overflow-hidden"
      ref={ref}
    >
      {/* Full-width band with dark bg */}
      <div className="absolute inset-0 bg-[#1F4B4C]" />

      {/* Decorative lines */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
        <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <svg
            className="mx-auto mb-8 text-[#C9873A]/40"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M11 7H7a4 4 0 00-4 4v4h4a4 4 0 004-4V7zM21 7h-4a4 4 0 00-4 4v4h4a4 4 0 004-4V7z" />
          </svg>

          <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-relaxed font-medium">
            We built Prevo because small clinics shouldn&apos;t need a
            full-time billing department to get paid for the care they
            provide.
          </blockquote>

          <div className="mt-10 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#C9873A]/20 flex items-center justify-center">
              <span className="text-[#C9873A] font-serif font-bold text-lg">
                P
              </span>
            </div>
            <p className="text-white/80 font-medium">Prevo Team</p>
            <p className="text-white/40 text-sm">
              Healthcare AI for Independent Practices
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
