"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import FieldLabel from "./FieldLabel";

// Words light up as you scroll through the section.
type W = { w: string; accent?: boolean };
const words = (s: string): W[] => s.split(" ").map((w) => ({ w }));
const TEXT: W[] = [
  ...words("Most denials start as something"),
  { w: "small.", accent: true },
  ...words("A modifier left off. A code that isn't specific enough. A line the payer bundles away. Prevo catches them in the note,"),
  { w: "before", accent: true },
  ...words("the claim leaves the building."),
];

function Word({ w, accent, progress, range }: { w: string; accent?: boolean; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const hlStart = Math.min(range[1], 0.94);
  const hl = useTransform(progress, [hlStart, hlStart + 0.06], ["0% 100%", "100% 100%"]);
  return (
    <motion.span
      style={accent ? { opacity, backgroundSize: hl } : { opacity }}
      className={`inline-block mr-[0.24em] ${
        accent ? "bg-no-repeat bg-left-bottom bg-[linear-gradient(transparent_52%,rgba(94,234,212,0.6)_52%,rgba(94,234,212,0.6)_92%,transparent_92%)] px-[0.04em]" : ""
      }`}
    >
      {w}
    </motion.span>
  );
}

export default function StatementSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.55"] });
  const n = TEXT.length;

  return (
    <section className="bg-[#F8FAFC] py-28 sm:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-3">
          <FieldLabel box="19" label="Additional claim info" />
        </div>
        <div ref={ref} className="lg:col-span-9">
          <p className="display text-[clamp(2rem,4.2vw,3.9rem)] !leading-[1.08] text-[#0B1220]">
            {TEXT.map((t, i) => (
              <Word key={i} w={t.w} accent={t.accent} progress={scrollYProgress} range={[i / n, Math.min(1, (i + 2) / n)]} />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
