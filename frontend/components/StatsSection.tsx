"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  {
    value: "$262B",
    label: "Lost to claim denials annually in the US",
    note: "Source: MGMA 2024 Report",
  },
  {
    value: "65%",
    label: "Of denied claims are never resubmitted",
    note: "Source: Advisory Board",
  },
  {
    value: "30s",
    label: "Average time Prevo takes to analyze a claim",
    note: "Based on internal testing",
  },
  {
    value: "94%",
    label: "Denial prevention rate with AI pre-screening",
    note: "Projected based on pilot data",
  },
];

function AnimatedCounter({
  value,
  inView,
}: {
  value: string;
  inView: boolean;
}) {
  return (
    <motion.span
      className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-[#1F4B4C]"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {value}
    </motion.span>
  );
}

export default function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-24 sm:py-32 bg-[#FAF8F4]" ref={ref}>
      {/* Subtle top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1F4B4C]/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#C9873A] text-sm font-semibold uppercase tracking-widest">
            By the Numbers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C2321] mt-3">
            The Denial Problem Is Massive
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#1F4B4C]/5 hover:border-[#C9873A]/20 transition-all hover:shadow-lg hover:shadow-[#1F4B4C]/5"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <AnimatedCounter value={stat.value} inView={inView} />
              <p className="text-[#1C2321]/70 text-sm mt-3 leading-relaxed">
                {stat.label}
              </p>
              <p className="text-[#1C2321]/30 text-xs mt-2 italic">
                {stat.note}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
