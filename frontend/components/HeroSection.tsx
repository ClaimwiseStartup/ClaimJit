"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiveVideo from "./LiveVideo";
import { VIDEOS, IMAGES } from "./images";

const ease = [0.22, 1, 0.36, 1] as const;

type Tick = { enc: string; codes: string; status: "clean" | "fixed" | "held"; note: string };

const TICKER: Tick[] = [
  { enc: "ENC-48213", codes: "99213-25 · 20610-RT · J1030", status: "fixed", note: "Modifier 25 added" },
  { enc: "ENC-48214", codes: "99396 · Z00.01 · M54.50", status: "clean", note: "Clean" },
  { enc: "ENC-48215", codes: "99214 · E11.22 · N18.31", status: "fixed", note: "E11.9 → E11.22" },
  { enc: "ENC-48216", codes: "44970 · K35.30", status: "fixed", note: "49320 removed (bundled)" },
  { enc: "ENC-48217", codes: "99213 · J06.9", status: "clean", note: "Clean" },
  { enc: "ENC-48218", codes: "99214 · E11.65", status: "held", note: "Provider query: control status" },
  { enc: "ENC-48219", codes: "93000 · R00.2", status: "clean", note: "Clean" },
  { enc: "ENC-48220", codes: "20611 · M17.11", status: "held", note: "Ultrasound image not saved" },
  { enc: "ENC-48221", codes: "99203 · M25.561", status: "fixed", note: "Laterality added" },
  { enc: "ENC-48222", codes: "G0438 · Z00.00", status: "clean", note: "Clean" },
];

const STATUS = {
  clean: { dot: "bg-[#5EEAD4]", text: "text-[#5EEAD4]", label: "CLEAN" },
  fixed: { dot: "bg-[#FBBF24]", text: "text-[#FCD34D]", label: "FIXED" },
  held: { dot: "bg-[#F87171]", text: "text-[#FCA5A5]", label: "HELD" },
};

function Ticker() {
  const row = [...TICKER, ...TICKER];
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#0B1220]/55 backdrop-blur-md">
      <div className="flex items-center h-14">
        <div className="shrink-0 flex items-center gap-2.5 pl-6 lg:pl-10 pr-5 h-full border-r border-white/10 bg-[#0B1220]/60">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#5EEAD4] opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#5EEAD4]" />
          </span>
          <span className="eyebrow text-white/70 !text-[10px] hidden sm:inline">Live claim queue</span>
          <span className="eyebrow text-white/70 !text-[10px] sm:hidden">Live</span>
        </div>
        <div className="relative flex-1 overflow-hidden h-full [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee flex w-max h-full items-center">
            {row.map((t, i) => (
              <div key={i} className="flex items-center gap-3 px-6 font-mono text-[12px] whitespace-nowrap">
                <span className="text-white/35">{t.enc}</span>
                <span className="text-white/80">{t.codes}</span>
                <span className={`flex items-center gap-1.5 ${STATUS[t.status].text}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${STATUS[t.status].dot}`} />
                  {STATUS[t.status].label}
                </span>
                <span className="text-white/40">{t.note}</span>
                <span className="text-white/15 pl-3">/</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative h-[100svh] min-h-[720px] overflow-hidden bg-[#0B1220] text-white">
      <motion.div className="absolute inset-0 grain" style={{ y: mediaY }}>
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.14, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 1 }}
          transition={{ duration: 2.6, ease }}
        >
          <LiveVideo
            src={VIDEOS.hero.src}
            poster={VIDEOS.hero.poster}
            fallback={IMAGES.hero}
            rate={0.85}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </motion.div>

      {/* Grade: cool teal cast, heavy base so type always reads */}
      <div className="absolute inset-0 bg-[#0B1220]/35 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/55 to-[#0B1220]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/70 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(15,118,110,0.25),transparent_55%)]" />

      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-end pb-32 sm:pb-36"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease }}
          className="eyebrow text-white/60 mb-7 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-white/30" />
          Pre-submission claim review for independent practices
        </motion.p>

        <h1 className="display text-[clamp(3.1rem,8.4vw,8.75rem)]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.55, ease }}
            >
              Stop claim denials
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.1em]">
            <motion.span
              className="block"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.68, ease }}
            >
              <span className="accent text-[#5EEAD4] pr-[0.08em]">before</span> they happen.
            </motion.span>
          </span>
        </h1>

        <div className="mt-10 grid lg:grid-cols-12 gap-8 items-end">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease }}
            className="lg:col-span-5 text-[17px] sm:text-[19px] leading-relaxed text-white/70 text-pretty"
          >
            Prevo reads the signed note the way a certified coder does, then checks every code, modifier
            and unit against NCCI edits and payer policy. Your claims leave clean, or they don't leave.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.12, ease }}
            className="lg:col-span-7 flex flex-col sm:flex-row lg:justify-end gap-3"
          >
            <a
              href="#demo"
              className="group inline-flex items-center justify-center gap-3 pl-7 pr-2.5 py-2.5 rounded-full bg-white text-[#0B1220] text-[15px] font-medium hover:bg-white/90 transition-colors"
            >
              Run a note through Prevo
              <span className="w-9 h-9 rounded-full bg-[#0F766E] text-white grid place-items-center transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#product"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/25 text-white text-[15px] hover:bg-white/10 transition-colors"
            >
              See it work on real notes
            </a>
          </motion.div>
        </div>
      </motion.div>

      <Ticker />
    </section>
  );
}
