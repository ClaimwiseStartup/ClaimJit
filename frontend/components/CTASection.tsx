"use client";

import { motion } from "framer-motion";
import LiveVideo from "./LiveVideo";
import { VIDEOS, IMAGES } from "./images";
import FieldLabel from "./FieldLabel";
import Mark from "./Mark";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CTASection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#0B1220] text-white">
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.6, ease }}
        className="absolute inset-0 grain"
      >
        <LiveVideo src={VIDEOS.waiting.src} poster={VIDEOS.waiting.poster} fallback={IMAGES.closing} rate={0.7} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[#0B1220]/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1220]/95 via-[#0B1220]/60 to-[#0B1220]/20" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 py-36 sm:py-48">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease }}>
          <FieldLabel box="31" label="Signature of physician or supplier" tone="dark" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease }}
          className="display mt-8 text-[clamp(3rem,8vw,8rem)]"
        >
          Send us a week <br className="hidden sm:block" />of <Mark tone="dark">notes.</Mark>
        </motion.h2>
        <div className="mt-12 grid lg:grid-cols-12 gap-10 items-end">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="lg:col-span-5 text-[18px] leading-relaxed text-white/70"
          >
            A free claim audit. Send a week of de-identified notes and we'll return every claim that would
            have been denied, why, and the corrected version. No setup, no contract.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.25, ease }}
            className="lg:col-span-7 flex flex-col sm:flex-row lg:justify-end gap-3"
          >
            <a
              href="mailto:team@prevo.ai?subject=Prevo%20claim%20review"
              className="group inline-flex items-center justify-center gap-3 pl-7 pr-2.5 py-2.5 rounded-full bg-white text-[#0B1220] text-[15px] font-medium hover:bg-white/90 transition-colors"
            >
              Get a free claim audit
              <span className="w-9 h-9 rounded-full bg-[#0F766E] text-white grid place-items-center transition-transform group-hover:translate-x-0.5">→</span>
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/25 text-white text-[15px] hover:bg-white/10 transition-colors"
            >
              Try the live demo
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
