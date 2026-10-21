"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Mark from "./Mark";

const ease = [0.22, 1, 0.36, 1] as const;

// Sourced industry rates
const DENIAL_RATE = 0.1181; // Kodiak Solutions, 2024 initial denial rate
const AVOIDABLE = 0.86; // Change Healthcare 2020 Denials Index
const REWORK = 25.2; // Change Healthcare, cost to work a denial

const usd = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function Rolling({ value, format }: { value: number; format: (n: number) => string }) {
  const [v, setV] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const c = animate(prev.current, value, { duration: 0.6, ease, onUpdate: setV });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span className="tabular-nums">{format(v)}</span>;
}

function Field({
  box,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  box: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block border border-[#C2362F]/35 bg-white">
      <span className="flex items-center justify-between border-b border-[#C2362F]/25 px-3 py-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#C2362F]">
          <b className="mr-2">{box}</b>
          {label}
        </span>
      </span>
      <span className="block px-4 pt-3 pb-4">
        <span className="block font-mono text-[34px] leading-none tracking-tight text-[#0B1220]">{display}</span>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="mt-4 w-full h-1.5 appearance-none rounded-full cursor-pointer accent-[#0F766E]"
          style={{ background: `linear-gradient(90deg, #0F766E ${pct}%, #E2E8F0 ${pct}%)` }}
          aria-label={label}
        />
      </span>
    </label>
  );
}

export default function DenialCalculator() {
  const [claims, setClaims] = useState(600);
  const [avg, setAvg] = useState(140);

  const denied = claims * DENIAL_RATE;
  const heldUp = denied * avg;
  const rework = denied * REWORK;
  const avoidableYear = denied * AVOIDABLE * 12 * avg;

  return (
    <section
      id="calculator"
      className="relative bg-[#F8FAFC] pb-28 sm:pb-36 pt-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(194,54,47,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(194,54,47,0.05) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="28"
          eyebrow="Total charge"
          title={
            <>
              What are denials <Mark>costing you?</Mark>
            </>
          }
          lede="Move the two sliders to match your practice. The math uses published industry rates, so you can see the size of the problem before you talk to anyone."
        />

        <div className="mt-14 grid lg:grid-cols-12 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease }}
            className="lg:col-span-5 grid gap-4 content-start"
          >
            <Field box="24" label="Claims per month" value={claims} min={50} max={3000} step={10} display={claims.toLocaleString()} onChange={setClaims} />
            <Field box="24F" label="Average allowed per claim" value={avg} min={40} max={600} step={5} display={usd(avg)} onChange={setAvg} />
            <p className="font-mono text-[10.5px] leading-relaxed text-[#94A3B8]">
              Rates: 11.81% initial denial rate (Kodiak Solutions, 2024). 86% of denials potentially avoidable and
              $25.20 to work each one (Change Healthcare, 2020 Denials Index). Estimates, not a guarantee.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
            className="lg:col-span-7 rounded-2xl bg-[#0B1220] text-white p-7 sm:p-10 relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#14B8A6]/20 blur-3xl" />
            <p className="relative font-mono text-[10.5px] uppercase tracking-[0.14em] text-white/45">Avoidable denials, per year</p>
            <p className="relative display mt-4 text-[clamp(3.25rem,7vw,6.5rem)] text-[#5EEAD4]">
              <Rolling value={avoidableYear} format={usd} />
            </p>
            <p className="relative mt-3 text-[15px] text-white/55 max-w-md">
              in claim revenue delayed or lost to denials that a pre-submission check could have caught.
            </p>

            <div className="relative mt-10 grid sm:grid-cols-3 border-t border-white/10">
              {[
                { k: "Denied each month", v: denied, f: (n: number) => Math.round(n).toLocaleString() },
                { k: "Revenue held up / mo", v: heldUp, f: usd },
                { k: "Staff cost to rework / mo", v: rework, f: usd },
              ].map((r, i) => (
                <div key={r.k} className={`pt-5 pb-1 ${i > 0 ? "sm:pl-6 sm:border-l border-white/10" : ""} ${i > 0 ? "border-t sm:border-t-0 border-white/10 mt-4 sm:mt-0" : ""}`}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">{r.k}</p>
                  <p className="mt-2 text-[28px] font-medium tracking-[-0.03em]">
                    <Rolling value={r.v} format={r.f} />
                  </p>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              className="relative mt-10 inline-flex items-center gap-3 pl-6 pr-2 py-2 rounded-full bg-white text-[#0B1220] text-[14px] font-medium hover:bg-white/90 transition-colors group"
            >
              See your real number with a free claim audit
              <span className="w-8 h-8 rounded-full bg-[#0F766E] text-white grid place-items-center transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
