"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiveVideo from "./LiveVideo";

// Full-bleed cinematic band: video (or still) with parallax and a big line of type.
export default function PhotoBand({
  video,
  poster,
  fallback,
  eyebrow,
  line,
  caption,
}: {
  video: string;
  poster: string;
  fallback?: string;
  eyebrow: string;
  line: ReactNode;
  caption?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.06, 1.18]);
  const textY = useTransform(scrollYProgress, [0, 1], ["30%", "-20%"]);

  return (
    <section ref={ref} className="relative h-[92svh] min-h-[560px] overflow-hidden bg-[#0B1220]">
      <motion.div style={{ y, scale }} className="absolute inset-0 grain">
        <LiveVideo src={video} poster={poster} fallback={fallback} rate={0.6} className="w-full h-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-[#0B1220]/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/10 to-[#0B1220]/50" />

      <motion.div style={{ y: textY }} className="relative h-full max-w-[1400px] mx-auto px-6 lg:px-10 flex flex-col justify-end pb-20 sm:pb-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="eyebrow text-[#5EEAD4] flex items-center gap-3"
        >
          <span className="h-px w-8 bg-[#5EEAD4]/50" />
          {eyebrow}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="display text-white text-[clamp(2.6rem,7vw,7rem)] mt-6 max-w-[16ch]"
        >
          {line}
        </motion.p>
        {caption && <p className="mt-8 font-mono text-[11px] text-white/40">{caption}</p>}
      </motion.div>
    </section>
  );
}
