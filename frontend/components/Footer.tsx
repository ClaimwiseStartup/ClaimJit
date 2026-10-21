"use client";

import { Logo } from "./Navigation";

const COLS = [
  {
    h: "Product",
    links: [
      ["Worklist", "#product"],
      ["Claim form", "#claim-form"],
      ["Denial calculator", "#calculator"],
      ["How it works", "#how-it-works"],
      ["Code guide", "#code-guide"],
      ["Denial playbook", "#playbook"],
      ["Live demo", "#demo"],
    ],
  },
  {
    h: "Company",
    links: [
      ["About", "#"],
      ["Careers", "#"],
      ["Contact", "#contact"],
    ],
  },
  {
    h: "Legal",
    links: [
      ["Privacy", "#"],
      ["Terms", "#"],
      ["Security", "#"],
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#0B1220] text-white overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20">
        <div className="grid lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          <div className="lg:col-span-5">
            <Logo light />
            <p className="mt-6 text-[15px] leading-relaxed text-white/50 max-w-sm">
              Pre-submission claim review for independent practices. Clean claims, before they leave the building.
            </p>
          </div>
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {COLS.map((c) => (
              <div key={c.h}>
                <p className="eyebrow text-white/35 mb-5">{c.h}</p>
                <ul className="space-y-3">
                  {c.links.map(([l, href]) => (
                    <li key={l}>
                      <a href={href} className="text-[14px] text-white/70 hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 text-[12px] text-white/35">
          <p>© {new Date().getFullYear()} Prevo Health, Inc.</p>
          <p className="font-mono">CPT® is a registered trademark of the American Medical Association.</p>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="relative select-none pointer-events-none" aria-hidden>
        <p className="display text-center text-[clamp(7rem,30vw,30rem)] !leading-[0.78] text-transparent bg-clip-text bg-gradient-to-b from-white/[0.12] to-white/[0.01] -mb-[0.08em]">
          prevo
        </p>
      </div>
    </footer>
  );
}
