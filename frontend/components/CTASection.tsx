"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="relative py-24 sm:py-32 bg-[#FAF8F4]" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1C2321] leading-tight">
            Stop Losing Revenue to
            <br />
            <span className="text-[#C9873A]">Preventable Denials</span>
          </h2>
          <p className="text-[#1C2321]/60 mt-6 text-lg max-w-xl mx-auto leading-relaxed">
            Join independent clinics that use Prevo to catch coding errors,
            optimize claims, and get paid faster.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#demo"
              className="px-8 py-4 rounded-full bg-[#1F4B4C] text-white font-semibold text-base hover:bg-[#163a3b] transition-all shadow-xl shadow-[#1F4B4C]/10 hover:shadow-2xl hover:scale-[1.02]"
            >
              Try Prevo Free
            </a>
            <a
              href="mailto:team@prevo.ai"
              className="px-8 py-4 rounded-full border border-[#1F4B4C]/20 text-[#1F4B4C] font-medium text-base hover:bg-[#1F4B4C]/5 transition-all"
            >
              Contact Sales
            </a>
          </div>

          {/* Trust items */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[#1C2321]/30 text-sm">
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              HIPAA Compliant
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M9 12l2 2 4-4" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              No Credit Card Required
            </span>
            <span className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Results in 30 Seconds
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
