"use client";

import { motion } from "framer-motion";
import { IMAGES } from "./images";

const ease = [0.22, 1, 0.36, 1] as const;

export default function CTASection() {
  return (
    <section id="contact" className="relative overflow-hidden bg-[#0f2e2f]">
      <motion.img
        src={IMAGES.closing}
        alt="Billing staff member reviewing a claim at a workstation"
        loading="lazy"
        initial={{ scale: 1.12 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0b2324]/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b2324]/90 via-[#0b2324]/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 py-32 sm:py-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="max-w-2xl"
        >
          <h2 className="font-serif text-4xl sm:text-6xl font-semibold text-white leading-[1.05]">
            Get to know Prevo.
          </h2>
          <p className="text-white/70 mt-6 text-lg leading-relaxed max-w-xl">
            Send us a week of de-identified notes and we'll show you which claims would have been denied,
            and what they should have looked like.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:team@prevo.ai?subject=Prevo%20claim%20review"
              className="px-8 py-4 rounded-full bg-[#C9873A] text-white font-semibold text-center hover:bg-[#b5772e] transition-all hover:shadow-xl hover:shadow-[#C9873A]/25"
            >
              Book a call
            </a>
            <a
              href="#demo"
              className="px-8 py-4 rounded-full border border-white/25 text-white font-medium text-center hover:bg-white/10 transition-all"
            >
              Try the live demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
