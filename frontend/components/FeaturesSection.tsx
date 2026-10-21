"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Mark from "./Mark";

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  { title: "Worklist", body: "Every encounter, its claim status, and exactly who needs to act next." },
  { title: "Evidence", body: "Each code linked to the sentence in the note that supports it." },
  { title: "Edits engine", body: "NCCI PTP and MUE edits, modifier logic and global periods, applied per line." },
  { title: "Payer rules", body: "Medicare LCDs and commercial payer policy, checked against the claim's payer." },
  { title: "Provider queries", body: "Clear, non-leading questions when documentation can't support a code yet." },
  { title: "Audit trail", body: "Who changed what, when and why, ready for an appeal or an audit." },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-28 sm:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="24D"
          eyebrow="Procedures & modifiers"
          title={
            <>
              What Prevo checks, <Mark>on every claim.</Mark>
            </>
          }
          lede="Small practices don't have a coding department. Prevo gives them the checks one would run, without adding a step to anyone's day."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E2E8F0]">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: (i % 3) * 0.08, ease }}
              className="group relative border-r border-b border-[#E2E8F0] p-8 lg:p-10 min-h-[240px] flex flex-col overflow-hidden"
            >
              <span className="absolute inset-x-0 bottom-0 h-[2px] bg-[#0F766E] scale-x-0 origin-left transition-transform duration-500 group-hover:scale-x-100" />
              <span className="font-mono text-[11px] text-[#94A3B8]">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-auto pt-12 text-[26px] font-medium tracking-[-0.03em] text-[#0B1220]">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#64748B] max-w-[34ch]">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
