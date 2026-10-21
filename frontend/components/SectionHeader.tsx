"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import FieldLabel from "./FieldLabel";

const ease = [0.22, 1, 0.36, 1] as const;

// Section opener: CMS-1500 field label, big display title, optional lede/aside.
export default function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  tone = "light",
  aside,
  className = "",
}: {
  index: string; // CMS-1500 box number
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "light" | "dark";
  aside?: ReactNode;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`grid lg:grid-cols-12 gap-x-8 gap-y-8 items-end ${className}`}>
      <div className="lg:col-span-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease }}
        >
          <FieldLabel box={index} label={eyebrow} tone={tone} />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.05, ease }}
          className={`display mt-7 text-[clamp(2.6rem,5.6vw,5.25rem)] text-balance ${dark ? "text-white" : "text-[#0B1220]"}`}
        >
          {title}
        </motion.h2>
      </div>
      {(lede || aside) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease }}
          className="lg:col-span-4 lg:pb-3"
        >
          {lede && <p className={`text-[17px] leading-relaxed text-pretty ${dark ? "text-white/60" : "text-[#475569]"}`}>{lede}</p>}
          {aside}
        </motion.div>
      )}
    </div>
  );
}
