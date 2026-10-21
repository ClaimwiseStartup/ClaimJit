"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Real-Time Code Validation",
    description:
      "Paste your clinical note and get instant ICD-10 and CPT code suggestions validated against payer-specific rules.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "AI Denial Prediction",
    description:
      "Our model flags claims likely to be denied before you submit, with specific reasons and suggested corrections.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 17v-2a4 4 0 014-4h0a4 4 0 014 4v2" />
        <circle cx="13" cy="7" r="3" />
        <path d="M5 17v-2a4 4 0 013-3.87" />
        <circle cx="8" cy="7" r="3" />
      </svg>
    ),
    title: "Built for Small Clinics",
    description:
      "No complex EHR integrations needed. Just paste your note, pick your payer, and get results instantly.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "Evidence-Based Coding",
    description:
      "Every suggested code comes with clinical evidence from your documentation — ready for audits and appeals.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "HIPAA-First Security",
    description:
      "Your clinical data never leaves our encrypted environment. SOC 2 compliant with zero data retention options.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 8v4l3 3" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
    title: "30-Second Turnaround",
    description:
      "Analyze claims in seconds, not hours. Stop spending your evenings resubmitting denied claims.",
  },
];

export default function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" className="relative py-24 sm:py-32 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#0F766E] text-sm font-semibold uppercase tracking-widest">
            Inside Prevo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E293B] mt-3">
            Everything You Need to Prevent Denials
          </h2>
          <p className="text-[#1E293B]/60 mt-4 max-w-2xl mx-auto">
            Purpose-built tools for independent practices that don&apos;t have a
            dedicated billing department.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group relative p-8 rounded-2xl border border-[#1E293B]/5 bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] transition-all duration-300 hover:shadow-xl hover:shadow-[#1E293B]/5 hover:border-[#0F766E]/15"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0F766E]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-[#1E293B]/5 text-[#1E293B] flex items-center justify-center mb-5 group-hover:bg-[#1E293B] group-hover:text-white transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-[#1E293B] mb-2">
                  {f.title}
                </h3>
                <p className="text-[#1E293B]/60 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
