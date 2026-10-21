"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function PhotoBand({
  src,
  alt,
  eyebrow,
  line,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  line: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15]);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[460px] overflow-hidden bg-[#0F172A]">
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ y, scale }}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-[#0B1220]/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-[#0B1220]/40" />
      <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-end pb-16 sm:pb-20">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[#5EEAD4] text-xs font-semibold uppercase tracking-[0.2em]"
        >
          {eyebrow}
        </motion.span>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-white text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1] mt-4 max-w-4xl"
        >
          {line}
        </motion.p>
      </div>
    </section>
  );
}
