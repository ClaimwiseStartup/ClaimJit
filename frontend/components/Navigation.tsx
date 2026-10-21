"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Who it's for", href: "#who-its-for" },
  { label: "Scenarios", href: "#scenarios" },
  { label: "Code guide", href: "#code-guide" },
  { label: "Demo", href: "#demo" },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#FAF8F4]/90 backdrop-blur-xl shadow-[0_1px_0_rgba(31,75,76,0.08)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#1F4B4C] flex items-center justify-center group-hover:scale-105 transition-transform">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L2 6v6l7 4 7-4V6L9 2z" stroke="#C9873A" strokeWidth="1.5" fill="none" />
              <path d="M9 8v4M6 10l3 2 3-2" stroke="#C9873A" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span
            className={`font-serif text-xl font-bold transition-colors ${
              scrolled ? "text-[#1F4B4C]" : "text-white"
            }`}
          >
            Prevo
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#C9873A] ${
                scrolled ? "text-[#1C2321]/70" : "text-white/80"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#demo"
            className="px-5 py-2.5 rounded-full bg-[#C9873A] text-white text-sm font-semibold hover:bg-[#b5772e] transition-all hover:shadow-lg hover:shadow-[#C9873A]/20"
          >
            Try Prevo Free
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`block w-5 h-0.5 rounded transition-all ${
                scrolled ? "bg-[#1C2321]" : "bg-white"
              }`}
            />
          ))}
        </button>
      </nav>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#FAF8F4] border-t border-[#1F4B4C]/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-[#1C2321]/70 text-sm font-medium py-2"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#demo"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-5 py-2.5 rounded-full bg-[#C9873A] text-white text-sm font-semibold text-center"
              >
                Try Prevo Free
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
