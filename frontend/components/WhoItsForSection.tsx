"use client";

import { motion } from "framer-motion";
import LiveVideo from "./LiveVideo";
import SectionHeader from "./SectionHeader";
import { VIDEOS, IMAGES } from "./images";
import Mark from "./Mark";

const ease = [0.22, 1, 0.36, 1] as const;

const audiences = [
  {
    media: { ...VIDEOS.practice, fallback: IMAGES.practice },
    tag: "Physicians & practice owners",
    title: "Independent practices",
    body: "Your providers document the visit. Prevo makes sure the note supports what gets billed, so you stop writing off revenue you already earned.",
    points: ["Missing modifier 25 and bundling edits", "E/M level the note can't support", "No coder on staff required"],
    href: "#product",
    cta: "See a practice encounter",
  },
  {
    media: { ...VIDEOS.laptop, fallback: IMAGES.coder },
    tag: "Coders & billing teams",
    title: "Coding and RCM teams",
    body: "A second set of eyes on every chart before it reaches the clearinghouse, with the exact sentence behind each code so review takes seconds.",
    points: ["Evidence linked to every code", "Specificity and laterality checks", "Medicare and commercial payer rules"],
    href: "#code-guide",
    cta: "Browse the code guide",
  },
];

export default function WhoItsForSection() {
  return (
    <section id="who-its-for" className="bg-white py-28 sm:py-36">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="33"
          eyebrow="Billing provider"
          title={
            <>
              Built for the people who get the claim <Mark>out the door.</Mark>
            </>
          }
        />

        <div className="mt-16 grid md:grid-cols-2 gap-10 lg:gap-8">
          {audiences.map((a, i) => (
            <motion.a
              href={a.href}
              key={a.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, delay: i * 0.12, ease }}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#0B1220] grain">
                <LiveVideo
                  src={a.media.src}
                  poster={a.media.poster}
                  fallback={a.media.fallback}
                  rate={0.9}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/75 via-[#0B1220]/10 to-transparent" />
                <div className="absolute left-6 right-6 bottom-6 flex items-end justify-between">
                  <span className="eyebrow text-white/80">{a.tag}</span>
                  <span className="w-11 h-11 rounded-full bg-white/15 backdrop-blur grid place-items-center text-white transition-all group-hover:bg-white group-hover:text-[#0B1220]">
                    →
                  </span>
                </div>
              </div>
              <h3 className="display mt-8 text-[clamp(1.9rem,2.8vw,2.6rem)] text-[#0B1220]">{a.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-[#475569] max-w-[46ch]">{a.body}</p>
              <ul className="mt-6 border-t border-[#E2E8F0]">
                {a.points.map((p) => (
                  <li key={p} className="flex items-center justify-between py-3 border-b border-[#E2E8F0] text-[14.5px] text-[#1E293B]">
                    {p}
                    <span className="font-mono text-[11px] text-[#0F766E]">✓</span>
                  </li>
                ))}
              </ul>
              <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-[#0B1220]">
                {a.cta}
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
