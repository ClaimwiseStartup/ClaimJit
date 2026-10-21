"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

// Prevo's signature: the evidence highlighter. Swipes in behind a phrase when it scrolls into view.
export default function Mark({
  children,
  tone = "light",
  delay = 0.35,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  delay?: number;
}) {
  return (
    <span className="relative inline-block isolate">
      <motion.span
        aria-hidden
        className={`absolute -left-[0.06em] -right-[0.1em] bottom-[0.04em] h-[0.5em] -z-10 rounded-[0.14em] origin-left ${
          tone === "dark" ? "bg-[#14B8A6]/45" : "bg-[#5EEAD4]/60"
        }`}
        style={{ rotate: -1.2, skewX: -8 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, delay, ease: [0.65, 0, 0.35, 1] }}
      />
      {children}
    </span>
  );
}
