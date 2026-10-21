"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import SectionHeader from "./SectionHeader";

const ease = [0.22, 1, 0.36, 1] as const;

const STATS = [
  {
    to: 11.81,
    decimals: 1,
    prefix: "",
    suffix: "%",
    label: "of claims were denied on first submission in 2024, and the rate is still climbing.",
    fn: 1,
  },
  {
    to: 86,
    decimals: 0,
    prefix: "",
    suffix: "%",
    label: "of denials are potentially avoidable, caught before the claim ever goes out.",
    fn: 2,
  },
  {
    to: 25.2,
    decimals: 2,
    prefix: "$",
    suffix: "",
    label: "average cost to rework a single denied claim, before you know if it gets paid.",
    fn: 2,
  },
];

const SOURCES = [
  "Kodiak Solutions, proprietary revenue cycle data, May 2025 release (2024 initial denial rate: 11.81%).",
  "Change Healthcare, 2020 Revenue Cycle Denials Index; 102M claim remits analyzed.",
];

function Counter({ to, decimals, prefix, suffix }: { to: number; decimals: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.8, ease, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {val.toFixed(decimals)}
      <span className="text-[#0F766E]">{suffix}</span>
    </span>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-[#F8FAFC] pb-28 sm:pb-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="01"
          eyebrow="By the numbers"
          title={
            <>
              Every denial gets <span className="accent text-[#0F766E]">paid for</span> twice.
            </>
          }
          lede="Once in the revenue you wait on, and again in the staff hours spent chasing it. For a practice without a billing department, that second cost lands on the people seeing patients."
        />

        <div className="mt-16 grid md:grid-cols-3 border-t border-[#CBD5E1]">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.1, ease }}
              className={`pt-10 pb-6 md:pr-10 ${i > 0 ? "md:pl-10 md:border-l border-[#CBD5E1]" : ""} ${i > 0 ? "border-t md:border-t-0 border-[#CBD5E1]" : ""}`}
            >
              <p className="display text-[clamp(3.75rem,7vw,6.75rem)] text-[#0B1220]">
                <Counter to={s.to} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                <sup className="font-mono text-[12px] text-[#94A3B8] align-top ml-1 tracking-normal">{s.fn}</sup>
              </p>
              <p className="mt-5 text-[16px] leading-relaxed text-[#475569] max-w-[34ch]">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <ol className="mt-10 space-y-1.5 font-mono text-[11px] text-[#94A3B8] max-w-3xl">
          {SOURCES.map((s, i) => (
            <li key={i}>
              <span className="text-[#64748B]">{i + 1}.</span> {s}
            </li>
          ))}
          <li className="pt-1">Industry figures, not Prevo results.</li>
        </ol>
      </div>
    </section>
  );
}
