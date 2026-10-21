"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS: { n: string; label: string; title: string; body: string; console: ReactNode }[] = [
  {
    n: "01",
    label: "Note in",
    title: "The signed note comes in.",
    body: "Paste it, upload it, or drop in your EHR export. Prevo reads the whole narrative, assessment and plan included, not just the problem list.",
    console: (
      <div>
        <div className="flex items-center justify-between font-mono text-[10px] text-white/35 mb-3">
          <span>PROGRESS NOTE · SIGNED 09:42</span>
          <span>EHR export · 214 words</span>
        </div>
        <p className="text-[15px] leading-[1.8] text-white/80">
          S: 45M, 3 weeks of right knee pain and swelling. O: moderate effusion R knee. BP 152/96, repeat 150/94. A/P: (1) R knee effusion:{" "}
          <span className="bg-[#5EEAD4]/15 text-white rounded px-1">aspirated 30 mL, injected methylprednisolone 40 mg</span>. (2){" "}
          <span className="bg-[#FBBF24]/15 text-white rounded px-1">elevated BP on two readings, dx essential hypertension, start lisinopril</span>.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 font-mono text-[10.5px]">
          {["Subjective", "Objective", "Assessment & plan", "2 problems", "1 procedure", "1 drug"].map((t, i) => (
            <motion.span key={t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-white/60">
              ✓ {t}
            </motion.span>
          ))}
        </div>
      </div>
    ),
  },
  {
    n: "02",
    label: "Coded",
    title: "Coded the way a certified coder would.",
    body: "ICD-10-CM to the highest specificity the documentation supports. CPT and HCPCS with units. Every code tied back to the sentence that justifies it.",
    console: (
      <div className="space-y-2">
        {[
          ["20610", "RT", "M25.461", "Arthrocentesis, major joint"],
          ["J1030", "×1", "M25.461", "Methylprednisolone 40 mg"],
          ["99213", "25", "I10", "Separately identifiable E/M"],
        ].map(([c, m, d, t], i) => (
          <motion.div
            key={c}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.15, ease }}
            className="flex items-center gap-3 rounded-lg bg-white/[0.05] border border-white/[0.08] px-3 py-2.5 font-mono text-[12.5px]"
          >
            <span className="text-[#5EEAD4] w-12">{c}</span>
            <span className="text-[#FCD34D] w-8">{m.startsWith("×") ? m : `-${m}`}</span>
            <span className="text-white/80 w-20">{d}</span>
            <span className="text-white/40 font-sans text-[12px] truncate">{t}</span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    n: "03",
    label: "Checked",
    title: "Checked the way the payer will.",
    body: "NCCI procedure-to-procedure and MUE edits, modifier logic, global periods, Medicare LCD coverage, payer-specific policy, and code validity on the date of service.",
    console: (
      <div className="space-y-1.5 font-mono text-[12.5px]">
        {[
          ["NCCI PTP 20610 / 99213", "pass with -25", "ok"],
          ["MUE 20610 (1 per side)", "1 unit", "ok"],
          ["Global period 20610", "0 days", "ok"],
          ["J1030 units vs. dose", "40 mg = 1", "ok"],
          ["Laterality on 20610", "RT required", "warn"],
          ["Code set (DOS)", "FY2027 valid", "ok"],
        ].map(([k, v, s], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-center justify-between border-b border-white/[0.06] py-2"
          >
            <span className="text-white/70">{k}</span>
            <span className={s === "ok" ? "text-[#5EEAD4]" : "text-[#FCD34D]"}>
              {s === "ok" ? "✓" : "!"} {v}
            </span>
          </motion.div>
        ))}
      </div>
    ),
  },
  {
    n: "04",
    label: "Cleared",
    title: "Cleared, or one clear human step.",
    body: "Clean claims go straight out. Anything that needs judgment becomes a single, specific task: a provider query, a sign-off, a missing document. Nothing vague.",
    console: (
      <div>
        <div className="flex items-center justify-between rounded-lg bg-[#0F766E]/20 border border-[#5EEAD4]/25 px-4 py-3">
          <span className="text-[14px] text-white">Claim ENC-48213</span>
          <span className="font-mono text-[12px] text-[#5EEAD4]">✓ READY · 837P</span>
        </div>
        <div className="mt-3 rounded-lg border-l-[3px] border-[#F59E0B] bg-[#B45309]/15 px-4 py-3">
          <p className="font-mono text-[10px] text-[#FCD34D] mb-1">HUMAN STEP · PROVIDER</p>
          <p className="text-[13px] text-white/80">Confirm the hypertension work is documented apart from the decision to inject.</p>
        </div>
      </div>
    ),
  },
];

function Console({ active }: { active: number }) {
  const step = STEPS[active];
  return (
    <div className="rounded-2xl bg-[#0B1220] border border-white/10 overflow-hidden shadow-[0_40px_80px_-40px_rgba(11,18,32,0.7)]">
      <div className="flex items-center gap-3 h-11 px-4 border-b border-white/[0.07]">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/15" />)}
        </div>
        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-white/50">Prevo pipeline</span>
      </div>
      {/* Pipeline rail */}
      <div className="px-6 pt-6">
        <div className="relative flex justify-between">
          <div className="absolute left-3 right-3 top-3 h-px bg-white/10" />
          <motion.div
            className="absolute left-3 top-3 h-px bg-[#5EEAD4] origin-left"
            animate={{ width: `calc(${(active / (STEPS.length - 1)) * 100}% - ${active === 0 ? 0 : 24}px)` }}
            transition={{ duration: 0.7, ease }}
          />
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative flex flex-col items-center gap-2">
              <span
                className={`w-6 h-6 rounded-full grid place-items-center font-mono text-[10px] border transition-colors duration-500 ${
                  i <= active ? "bg-[#5EEAD4] border-[#5EEAD4] text-[#0B1220]" : "bg-[#0B1220] border-white/20 text-white/40"
                }`}
              >
                {i < active ? "✓" : s.n.slice(1)}
              </span>
              <span className={`text-[11px] ${i === active ? "text-white" : "text-white/40"}`}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="p-6 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4, ease }}
          >
            {step.console}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="how-it-works" className="bg-[#F8FAFC] py-28 sm:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="04"
          eyebrow="How it works"
          title={
            <>
              From signed note to clean claim in <span className="accent text-[#0F766E]">four moves.</span>
            </>
          }
        />

        <div className="mt-16 lg:mt-24 grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Sticky console (desktop) */}
          <div className="hidden lg:block lg:col-span-6">
            <div className="sticky top-28">
              <Console active={active} />
            </div>
          </div>

          {/* Steps */}
          <div className="lg:col-span-6">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                onViewportEnter={() => setActive(i)}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                className="lg:min-h-[62vh] flex flex-col justify-center py-10 lg:py-0 border-t border-[#E2E8F0] first:border-t-0"
              >
                <p className={`font-mono text-[12px] transition-colors ${active === i ? "text-[#0F766E]" : "text-[#94A3B8]"}`}>
                  {s.n} — {s.label}
                </p>
                <h3
                  className={`display mt-4 text-[clamp(2rem,3.4vw,3.25rem)] transition-colors duration-500 ${
                    active === i ? "text-[#0B1220]" : "text-[#0B1220]/30"
                  }`}
                >
                  {s.title}
                </h3>
                <p className={`mt-5 text-[17px] leading-relaxed max-w-[44ch] transition-colors duration-500 ${active === i ? "text-[#475569]" : "text-[#475569]/40"}`}>
                  {s.body}
                </p>
                {/* Mobile: inline console */}
                <div className="lg:hidden mt-8 rounded-2xl bg-[#0B1220] p-5">{s.console}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
