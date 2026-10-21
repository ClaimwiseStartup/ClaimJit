"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Worklist", href: "#product" },
  { label: "Claim form", href: "#claim-form" },
  { label: "Calculator", href: "#calculator" },
  { label: "Code guide", href: "#code-guide" },
  { label: "Demo", href: "#demo" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className={`relative w-7 h-7 rounded-[7px] grid place-items-center ${light ? "bg-white" : "bg-[#0B1220]"}`}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M3 7.5l2.5 2.5L11 4" stroke={light ? "#0F766E" : "#5EEAD4"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className={`text-[19px] font-semibold tracking-[-0.04em] ${light ? "text-white" : "text-[#0B1220]"}`}>prevo</span>
    </span>
  );
}

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = !scrolled && !open;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-500 ${
        light ? "bg-transparent" : "bg-[#F8FAFC]/85 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.06)]"
      }`}
    >
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-10 h-[72px]">
        <a href="#top" aria-label="Prevo home">
          <Logo light={light} />
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                light ? "text-white/75 hover:text-white hover:bg-white/10" : "text-[#475569] hover:text-[#0B1220] hover:bg-[#0B1220]/[0.04]"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
          <a
            href="#contact"
            className={`group inline-flex items-center gap-2 pl-5 pr-2 py-2 rounded-full text-[14px] font-medium transition-all ${
              light ? "bg-white text-[#0B1220] hover:bg-white/90" : "bg-[#0B1220] text-white hover:bg-[#1E293B]"
            }`}
          >
            Free claim audit
            <span className={`w-7 h-7 rounded-full grid place-items-center transition-transform group-hover:translate-x-0.5 ${light ? "bg-[#0F766E] text-white" : "bg-white/15 text-white"}`}>
              →
            </span>
          </a>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden w-10 h-10 grid place-items-center"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span className="relative w-5 h-3">
            <span className={`absolute left-0 right-0 h-[1.5px] transition-all ${light ? "bg-white" : "bg-[#0B1220]"} ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 right-0 h-[1.5px] transition-all ${light ? "bg-white" : "bg-[#0B1220]"} ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-[#F8FAFC] border-t border-[#E2E8F0]"
          >
            <div className="px-6 py-6 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="display text-3xl text-[#0B1220] py-2">
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-4 px-5 py-3.5 rounded-full bg-[#0B1220] text-white text-[15px] font-medium text-center"
              >
                Get a free claim audit
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
