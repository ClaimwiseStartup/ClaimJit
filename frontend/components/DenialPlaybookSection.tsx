"use client";

import { motion } from "framer-motion";
import { IMAGES } from "./images";
import WindowPane from "./WindowPane";

const ease = [0.22, 1, 0.36, 1] as const;

const CARCS = [
  { code: "97", name: "Bundled into another service", check: "NCCI PTP edits, modifier 25 / 59 / X{EPSU} eligibility" },
  { code: "4", name: "Modifier missing or inconsistent", check: "Laterality, -25 placement, payer-required modifiers" },
  { code: "11", name: "Diagnosis inconsistent with procedure", check: "Each CPT line linked to a diagnosis that supports it" },
  { code: "16", name: "Claim lacks information", check: "Missing NDC, units, referring provider, required fields" },
  { code: "50", name: "Not medically necessary", check: "Diagnosis against Medicare LCD/NCD coverage lists" },
  { code: "197", name: "Precertification absent", check: "Prior-auth requirements by payer and CPT" },
];

const CALENDAR = [
  { when: "Jan 1", what: "CPT and HCPCS annual update" },
  { when: "Quarterly", what: "NCCI edits, MUEs and HCPCS changes" },
  { when: "Apr 1", what: "ICD-10-CM mid-year additions, when CMS issues them" },
  { when: "Oct 1", what: "ICD-10-CM fiscal-year code set" },
];

const TIPS = [
  {
    title: "Code to the highest specificity the note supports",
    body: "Laterality, stage, type and complication all live in the code. If the provider documented it, an unspecified code is leaving information off the claim.",
  },
  {
    title: "Never code from labs or imaging alone",
    body: "An A1c of 9% isn't 'hyperglycemia' until the provider says so. Prevo raises a provider query instead of guessing.",
  },
  {
    title: "Treat modifier 25 and 59 as audit magnets",
    body: "They're correct often, and scrutinized just as often. Prevo only adds them when the documentation can stand on its own.",
  },
  {
    title: "Fix it before submission, not after",
    body: "Reworking a denied claim costs staff time on every claim, and a large share are never resubmitted. Medicare's filing window is 12 months from the date of service.",
  },
];

export default function DenialPlaybookSection() {
  return (
    <section id="playbook" className="relative bg-[#0F172A] py-24 sm:py-32 overflow-hidden">
      {/* Faint photo texture */}
      <img
        src={IMAGES.workspace}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-[0.08] mix-blend-luminosity"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="max-w-2xl mb-14"
        >
          <span className="text-[#5EEAD4] text-xs font-semibold uppercase tracking-[0.2em]">Denial prevention playbook</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-white mt-4 leading-tight">
            The denial codes we stop before the payer sends them.
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
          {/* CARC list */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
          >
            <WindowPane
              title="Denial Monitor · 835 Remittance"
              icon="pulse"
              tone="dark"
              meta={<span className="font-mono text-[10px] text-[#FCD34D]/80">6 watched CARCs</span>}
            >
            <div className="grid grid-cols-[64px_1fr] sm:grid-cols-[72px_1fr_1.2fr] gap-4 px-6 py-3.5 border-b border-white/10 text-[10px] uppercase tracking-[0.16em] text-white/40 font-semibold">
              <span>CARC</span>
              <span>What the payer says</span>
              <span className="hidden sm:block">What Prevo checks first</span>
            </div>
            {CARCS.map((c, i) => (
              <motion.div
                key={c.code}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease }}
                className="grid grid-cols-[64px_1fr] sm:grid-cols-[72px_1fr_1.2fr] gap-x-4 gap-y-1 px-6 py-4 border-b border-white/[0.06] last:border-0 hover:bg-white/[0.03] transition-colors"
              >
                <span className="font-mono text-[15px] font-semibold text-[#FCD34D] bg-[#B45309]/20 ring-1 ring-inset ring-[#F59E0B]/25 rounded px-2 py-1 self-center justify-self-start">{c.code}</span>
                <span className="text-[14px] text-white/85 self-center">{c.name}</span>
                <span className="col-start-2 sm:col-start-3 text-[13px] text-white/50 self-center">{c.check}</span>
              </motion.div>
            ))}
            </WindowPane>
          </motion.div>

          {/* Coding calendar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease }}
          >
            <WindowPane title="Code Set Calendar" icon="calendar" className="h-full" bodyClassName="p-7 bg-[#F8FAFC]">
            <h3 className="font-serif text-2xl font-semibold text-[#1E293B]">Code sets change. Prevo keeps up.</h3>
            <p className="text-[13px] text-[#1E293B]/55 mt-2 leading-relaxed">
              A code that was valid last quarter can reject today. Every claim is validated against the
              code set in effect on its date of service.
            </p>
            <div className="mt-6 relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[#1E293B]/10" />
              {CALENDAR.map((c) => (
                <div key={c.when} className="relative flex gap-4 py-2.5">
                  <span className="mt-1.5 w-[15px] h-[15px] rounded-full border-2 border-[#0F766E] bg-[#F8FAFC] shrink-0" />
                  <div>
                    <p className="font-mono text-[12px] font-semibold text-[#1E293B]">{c.when}</p>
                    <p className="text-[13px] text-[#1E293B]/65">{c.what}</p>
                  </div>
                </div>
              ))}
            </div>
            </WindowPane>
          </motion.div>
        </div>

        {/* Audit tips */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIPS.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease }}
              className="rounded-xl border border-white/10 border-l-[3px] border-l-[#F59E0B]/70 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-colors"
            >
              <span className="font-mono text-[11px] text-[#FCD34D]">Audit risk {String(i + 1).padStart(2, "0")}</span>
              <h4 className="text-white font-semibold mt-3 leading-snug">{t.title}</h4>
              <p className="text-white/50 text-[13.5px] mt-2 leading-relaxed">{t.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
