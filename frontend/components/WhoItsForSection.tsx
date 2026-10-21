"use client";

import { motion } from "framer-motion";
import { IMAGES } from "./images";

const ease = [0.22, 1, 0.36, 1] as const;

const audiences = [
  {
    img: IMAGES.practice,
    alt: "Physician documenting a visit at a clinic workstation",
    eyebrow: "For physicians & practice owners",
    title: "Independent practices",
    body: "Your providers document the visit. Prevo makes sure the note actually supports what gets billed, so you stop writing off revenue you already earned.",
    points: ["Catches missing modifier 25 and bundling edits", "Flags notes that don't support the E/M level", "No coder on staff required"],
    link: "See a practice scenario",
  },
  {
    img: IMAGES.coder,
    alt: "Medical coder working in a billing system",
    eyebrow: "For coders & billing teams",
    title: "Coding and RCM teams",
    body: "A second set of eyes on every chart before it hits the clearinghouse. Prevo shows the exact sentence behind every code so your review takes seconds.",
    points: ["Evidence linked to each code", "ICD-10-CM specificity and laterality checks", "Payer-specific rules for Medicare and commercial plans"],
    link: "Browse the code guide",
  },
];

export default function WhoItsForSection() {
  return (
    <section id="who-its-for" className="bg-[#FAF8F4] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="max-w-2xl mb-14"
        >
          <span className="text-[#C9873A] text-xs font-semibold uppercase tracking-[0.2em]">Who it's for</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1C2321] mt-4 leading-tight">
            Built for the people who get the claim out the door.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {audiences.map((a, i) => (
            <motion.article
              key={a.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease }}
              className="group rounded-3xl bg-white border border-[#1C2321]/[0.06] overflow-hidden shadow-[0_20px_50px_-30px_rgba(28,35,33,0.25)]"
            >
              <div className="relative h-72 overflow-hidden bg-[#1F4B4C]">
                <img
                  src={a.img}
                  alt={a.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f2e2f]/70 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-6 text-white/85 text-xs tracking-wide">{a.eyebrow}</span>
              </div>
              <div className="p-8">
                <h3 className="font-serif text-2xl font-semibold text-[#1C2321]">{a.title}</h3>
                <p className="mt-3 text-[#1C2321]/60 leading-relaxed">{a.body}</p>
                <ul className="mt-6 space-y-2.5">
                  {a.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-[#1C2321]/75">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C9873A] shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <a
                  href={i === 0 ? "#scenarios" : "#code-guide"}
                  className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#1F4B4C] group/link"
                >
                  {a.link}
                  <span className="transition-transform group-hover/link:translate-x-1">→</span>
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
