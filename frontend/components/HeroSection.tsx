"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { IMAGES } from "./images";

const ease = [0.22, 1, 0.36, 1] as const;

// The live chart-review card cycles through these stages
const CODE_CHIPS = [
  { code: "99213", tag: "CPT", mod: "25", note: "E/M, separately identifiable" },
  { code: "20610", tag: "CPT", mod: "RT", note: "Arthrocentesis, major joint" },
  { code: "J1030", tag: "HCPCS", mod: "×1", note: "Methylprednisolone 40 mg" },
  { code: "M25.461", tag: "ICD-10", mod: "", note: "Effusion, right knee" },
  { code: "I10", tag: "ICD-10", mod: "", note: "Essential hypertension" },
];

function ChartReviewCard() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => (s + 1) % (CODE_CHIPS.length + 3)), 1100);
    return () => clearInterval(t);
  }, []);

  const shown = Math.min(step, CODE_CHIPS.length);
  const done = step > CODE_CHIPS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 1.5 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 1.1, delay: 0.7, ease }}
      className="w-[420px] rounded-2xl bg-[#FAF8F4]/95 backdrop-blur-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)] border border-white/40 overflow-hidden"
    >
      {/* EHR header */}
      <div className="flex items-center justify-between px-5 py-3 bg-[#1F4B4C] text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C9873A] animate-pulse" />
          <span className="font-mono text-[11px] tracking-wider">CHART REVIEW · ENC 48213</span>
        </div>
        <span className="font-mono text-[10px] text-white/60">Ortho · Est. pt</span>
      </div>

      {/* Note excerpt */}
      <div className="px-5 pt-4 pb-3 border-b border-[#1C2321]/[0.07]">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1C2321]/40 mb-2">
          Progress note · Assessment & Plan
        </p>
        <p className="text-[12.5px] leading-relaxed text-[#1C2321]/75">
          45M, <mark className="bg-[#C9873A]/15 text-[#1C2321] rounded px-0.5">right knee pain with moderate effusion</mark>.{" "}
          <mark className="bg-[#1F4B4C]/10 text-[#1C2321] rounded px-0.5">Aspirated and injected R knee</mark>, methylprednisolone 40 mg.{" "}
          <mark className="bg-[#5C8558]/15 text-[#1C2321] rounded px-0.5">BP 152/96, start lisinopril</mark>.
        </p>
      </div>

      {/* Codes */}
      <div className="px-5 py-4 space-y-2 min-h-[232px]">
        <AnimatePresence>
          {CODE_CHIPS.slice(0, shown).map((c) => (
            <motion.div
              key={c.code}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease }}
              className="flex items-center gap-3 rounded-lg bg-white border border-[#1C2321]/[0.06] px-3 py-2"
            >
              <span className="text-[9px] font-mono text-[#1C2321]/40 w-11">{c.tag}</span>
              <span className="font-mono text-[13px] font-semibold text-[#1F4B4C]">{c.code}</span>
              {c.mod && (
                <span className="font-mono text-[10px] text-[#C9873A] bg-[#C9873A]/10 rounded px-1.5 py-0.5">
                  {c.mod.startsWith("×") ? c.mod : `-${c.mod}`}
                </span>
              )}
              <span className="ml-auto text-[11px] text-[#1C2321]/50 truncate">{c.note}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-[#1C2321]/[0.07]">
        <span className="text-[11px] text-[#1C2321]/50 font-mono">NCCI · payer rules · LCD</span>
        <motion.span
          key={done ? "clean" : "review"}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-[11px] font-semibold rounded-full px-3 py-1 ${
            done ? "bg-[#5C8558]/15 text-[#3d6b3a]" : "bg-[#C9873A]/12 text-[#8A5A24]"
          }`}
        >
          {done ? "✓ Clean claim" : "Reviewing…"}
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[720px] overflow-hidden bg-[#0f2e2f]">
      {/* Photo background with slow Ken Burns zoom + parallax */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <motion.img
          src={IMAGES.hero}
          alt="Clinician reviewing patient records across two monitors"
          className="w-full h-[118%] object-cover object-center"
          initial={{ scale: 1.18 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 3.2, ease }}
        />
      </motion.div>

      {/* Overlays: tint, left-side legibility, bottom fade */}
      <div className="absolute inset-0 bg-[#0f2e2f]/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b2324]/95 via-[#0f2e2f]/70 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0b2324] to-transparent" />
      {/* Fine scanline texture, like a monitor up close */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 3px)",
        }}
      />

      <motion.div
        style={{ y: contentY, opacity: fade }}
        className="relative z-10 h-full max-w-7xl mx-auto px-6 flex items-center"
      >
        <div className="grid lg:grid-cols-[1.1fr_auto] gap-16 items-center w-full pt-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur px-4 py-1.5 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9873A]" />
              <span className="text-white/80 text-xs tracking-wide">
                Pre-submission claim review for independent practices
              </span>
            </motion.div>

            <h1 className="font-serif text-white text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-7xl font-semibold tracking-tight">
              {["Stop claim denials", "before they happen."].map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1">
                  <motion.span
                    className={`block ${i === 1 ? "text-[#E0A862]" : ""}`}
                    initial={{ y: "105%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.35 + i * 0.12, ease }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75, ease }}
              className="mt-7 text-lg text-white/70 leading-relaxed max-w-xl"
            >
              Prevo reads the signed note the way a certified coder does: it assigns ICD-10-CM, CPT and
              HCPCS codes, checks modifiers against NCCI edits and payer policy, and flags what a human
              needs to fix before the claim goes out.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9, ease }}
              className="mt-10 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#demo"
                className="px-7 py-3.5 rounded-full bg-[#C9873A] text-white font-semibold text-center hover:bg-[#b5772e] transition-all hover:shadow-xl hover:shadow-[#C9873A]/25"
              >
                Run a note through Prevo
              </a>
              <a
                href="#scenarios"
                className="px-7 py-3.5 rounded-full border border-white/25 text-white font-medium text-center hover:bg-white/10 transition-all"
              >
                See real coding scenarios
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-14"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">Checks every claim against</p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[13px] text-white/65">
                <span>ICD-10-CM</span>
                <span>CPT®</span>
                <span>HCPCS II</span>
                <span>NCCI PTP & MUE</span>
                <span>Payer LCDs</span>
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <ChartReviewCard />
          </div>
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Scroll</span>
        <motion.span
          className="block w-px h-10 bg-gradient-to-b from-white/50 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4], originY: 0 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
