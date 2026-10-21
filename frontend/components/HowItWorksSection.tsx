"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Paste Your Clinical Note",
    description:
      "Copy the clinical documentation from your visit — the history, exam findings, and treatment plan.",
    visual: (
      <div className="bg-[#0F172A] rounded-xl p-4 font-mono text-xs text-white/70 leading-relaxed">
        <div className="text-[#0F766E] mb-2">// Clinical Note</div>
        <div className="text-white/50">
          Patient presents with persistent cough x 3 weeks, productive with
          yellow sputum. Bilateral rhonchi on auscultation. CXR shows right
          lower lobe infiltrate...
        </div>
        <div className="mt-2 h-px bg-white/10" />
        <div className="mt-2 flex items-center gap-2 text-[#0F766E]">
          <span className="w-2 h-2 rounded-full bg-[#0F766E]" />
          Ready to analyze
        </div>
      </div>
    ),
  },
  {
    num: "02",
    title: "Select Your Payer",
    description:
      "Choose from Medicare, Medicaid, Blue Cross, Aetna, UnitedHealthcare, Cigna, or other major payers.",
    visual: (
      <div className="bg-[#0F172A] rounded-xl p-4 space-y-2">
        {["Medicare", "Blue Cross Blue Shield", "Aetna"].map((p, i) => (
          <div
            key={p}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              i === 0
                ? "bg-[#0F766E] text-white"
                : "bg-white/5 text-white/50 border border-white/5"
            }`}
          >
            {p}
          </div>
        ))}
        <div className="text-white/30 text-xs text-center pt-1">
          + 12 more payers
        </div>
      </div>
    ),
  },
  {
    num: "03",
    title: "AI Analyzes & Validates",
    description:
      "Prevo's AI extracts codes, cross-references payer rules, identifies risks, and suggests corrections.",
    visual: (
      <div className="bg-[#0F172A] rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0F766E"
              strokeWidth="2"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-white/80 text-xs font-medium">
              Processing claim...
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#0F766E] to-[#0F766E]" />
            </div>
          </div>
        </div>
        <div className="text-[#0F766E] text-xs flex items-center gap-1.5">
          <span>&#10003;</span> ICD-10 codes validated
        </div>
        <div className="text-[#0F766E] text-xs flex items-center gap-1.5">
          <span>&#10003;</span> CPT codes validated
        </div>
        <div className="text-[#0F766E] text-xs flex items-center gap-1.5">
          <span>&#9888;</span> 1 issue found — see correction
        </div>
      </div>
    ),
  },
  {
    num: "04",
    title: "Submit with Confidence",
    description:
      "Get corrected codes with evidence citations, human actions required, and a clean claim ready to submit.",
    visual: (
      <div className="bg-[#0F172A] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#0F766E] flex items-center justify-center text-white text-xs font-bold">
            &#10003;
          </div>
          <span className="text-white/80 text-sm font-medium">
            Claim Optimized
          </span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-white/50">
            <span>ICD-10:</span>
            <span className="text-white/80 font-mono">J18.1, R05.9</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>CPT:</span>
            <span className="text-white/80 font-mono">99214, 71046</span>
          </div>
          <div className="flex justify-between text-white/50">
            <span>Denial Risk:</span>
            <span className="text-[#0F766E] font-semibold">Low</span>
          </div>
        </div>
      </div>
    ),
  },
];

export default function HowItWorksSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="how-it-works"
      className="relative py-24 sm:py-32 bg-[#F8FAFC]"
      ref={ref}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#0F766E] text-sm font-semibold uppercase tracking-widest">
            How It Works
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1E293B] mt-3">
            From Clinical Note to Clean Claim
          </h2>
          <p className="text-[#1E293B]/60 mt-4 max-w-2xl mx-auto">
            Four simple steps. No integrations, no onboarding calls, no
            contracts.
          </p>
        </motion.div>

        <div className="space-y-16 lg:space-y-24">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className={`flex flex-col ${
                i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              } items-center gap-12 lg:gap-20`}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              {/* Text */}
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-5xl font-serif font-bold text-[#1E293B]/10">
                    {step.num}
                  </span>
                  <div className="h-px flex-1 bg-[#1E293B]/10" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1E293B] mb-3">
                  {step.title}
                </h3>
                <p className="text-[#1E293B]/60 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Visual */}
              <div className="flex-1 w-full max-w-md">{step.visual}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
