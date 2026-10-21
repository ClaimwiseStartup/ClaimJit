"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

// Highlight colors link a phrase in the note to the claim line it supports
const HL: Record<string, { mark: string; dot: string }> = {
  a: { mark: "bg-[#C9873A]/18", dot: "bg-[#C9873A]" },
  b: { mark: "bg-[#1F4B4C]/12", dot: "bg-[#1F4B4C]" },
  c: { mark: "bg-[#5C8558]/20", dot: "bg-[#5C8558]" },
};

type Seg = { t: string; h?: keyof typeof HL };
type Line = { code: string; mod?: string; dx: string; desc: string; h?: keyof typeof HL };

type Scenario = {
  id: string;
  tab: string;
  specialty: string;
  encounter: string;
  note: Seg[];
  submitted: Line[];
  outcome: { label: string; code: string; detail: string };
  corrected: Line[];
  why: string[];
  human: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "knee",
    tab: "Injection + E/M same day",
    specialty: "Family medicine",
    encounter: "Established patient · Office visit",
    note: [
      { t: "S: 45M, established, 3 weeks of " },
      { t: "right knee pain and swelling", h: "a" },
      { t: ". O: Moderate effusion R knee, ROM limited by pain. BP 152/96, repeat 150/94. A/P: (1) R knee effusion: " },
      { t: "aspirated 30 mL clear fluid and injected methylprednisolone acetate 40 mg, right knee", h: "b" },
      { t: ". (2) " },
      { t: "Elevated BP on two readings, dx essential hypertension; start lisinopril 10 mg daily", h: "c" },
      { t: ", recheck in 4 weeks." },
    ],
    submitted: [
      { code: "99213", dx: "M25.561", desc: "Office visit, est. pt" },
      { code: "20610", dx: "M25.561", desc: "Arthrocentesis, major joint" },
    ],
    outcome: {
      label: "Denied",
      code: "CARC 97",
      detail: "E/M bundled into the injection: no modifier 25. Drug supply never billed.",
    },
    corrected: [
      { code: "99213", mod: "25", dx: "I10", desc: "Separately identifiable E/M", h: "c" },
      { code: "20610", mod: "RT", dx: "M25.461", desc: "Arthrocentesis, R knee, no US", h: "b" },
      { code: "J1030", mod: "×1", dx: "M25.461", desc: "Methylprednisolone acetate 40 mg", h: "b" },
    ],
    why: [
      "20610 has a 0-day global, so a same-day E/M is only payable if it's significant and separately identifiable. The new hypertension diagnosis with prescription management is. Modifier 25 goes on the E/M, not the procedure.",
      "Effusion (M25.461) is documented and more specific than knee pain (M25.561). Laterality is captured in the 6th character.",
      "The injected drug is billed separately: J1030 covers 40 mg, so 1 unit.",
    ],
    human: "Provider sign-off: confirm the hypertension work is documented apart from the decision to inject.",
  },
  {
    id: "diabetes",
    tab: "Diabetes with CKD",
    specialty: "Internal medicine",
    encounter: "Established patient · Chronic care follow-up",
    note: [
      { t: "62F, follow-up for " },
      { t: "type 2 diabetes. A1c 8.9% today, up from 7.6%", h: "a" },
      { t: ". " },
      { t: "eGFR 48, consistent with CKD stage 3a due to diabetes", h: "b" },
      { t: ". " },
      { t: "On metformin 1000 mg BID and insulin glargine 20 units nightly", h: "c" },
      { t: ". " },
      { t: "Diabetes poorly controlled with hyperglycemia", h: "a" },
      { t: ": increase glargine to 24 units. Renal panel in 3 months." },
    ],
    submitted: [{ code: "99213", dx: "E11.9, N18.9", desc: "Office visit, est. pt" }],
    outcome: {
      label: "Underpaid",
      code: "Specificity lost",
      detail: "E11.9 means 'without complications', which contradicts the documented CKD. Stage left unspecified.",
    },
    corrected: [
      { code: "99214", dx: "E11.22", desc: "T2DM with diabetic CKD", h: "b" },
      { code: "", dx: "N18.31", desc: "CKD stage 3a", h: "b" },
      { code: "", dx: "E11.65", desc: "T2DM with hyperglycemia", h: "a" },
      { code: "", dx: "Z79.4, Z79.84", desc: "Long-term insulin + oral hypoglycemic", h: "c" },
    ],
    why: [
      "ICD-10-CM's 'with' convention presumes a link between diabetes and CKD, so E11.22 is assigned, plus N18.31 for the stage.",
      "'Poorly controlled' indexes to hyperglycemia (E11.65). A coder can't assign this from the A1c value alone; the provider's words make it codable.",
      "On both insulin and an oral agent, so both Z79.4 and Z79.84 are reported.",
      "A worsening chronic illness plus prescription drug management supports moderate MDM: 99214.",
    ],
    human: "Provider sign-off: approve the E/M level change from 99213 to 99214.",
  },
  {
    id: "preventive",
    tab: "Physical + problem visit",
    specialty: "Primary care",
    encounter: "Established patient · Preventive + problem",
    note: [
      { t: "52M, established, " },
      { t: "annual preventive exam; age-appropriate counseling, screening labs ordered", h: "b" },
      { t: ". Also reports " },
      { t: "2 weeks of low back pain after lifting", h: "a" },
      { t: ", no red flags. " },
      { t: "Focused lumbar exam, SLR negative. Start naproxen 500 mg BID, home exercise program", h: "c" },
      { t: ", follow up if not improved in 4 weeks." },
    ],
    submitted: [
      { code: "99396", dx: "Z00.00", desc: "Preventive visit, 40–64" },
      { code: "99213", dx: "Z00.00", desc: "Office visit, est. pt" },
    ],
    outcome: {
      label: "Denied",
      code: "CARC 97 · CARC 11",
      detail: "Problem visit bundled into the physical, and a wellness diagnosis can't support a problem-oriented E/M.",
    },
    corrected: [
      { code: "99396", dx: "Z00.01, M54.50", desc: "Preventive visit, 40–64", h: "b" },
      { code: "99213", mod: "25", dx: "M54.50", desc: "Problem-oriented E/M", h: "c" },
    ],
    why: [
      "The back pain workup is significant and separately identifiable from the preventive service, so the problem E/M gets modifier 25.",
      "Z00.01 (with abnormal findings) replaces Z00.00 once a new problem is found, with the finding coded alongside it.",
      "Low back pain is M54.50. The old M54.5 was deleted in FY2022 and is no longer a valid code.",
    ],
    human: "Front desk: let the patient know the problem-visit portion may carry a copay or coinsurance.",
  },
];

function ClaimLines({ lines, tone }: { lines: Line[]; tone: "bad" | "good" }) {
  return (
    <div className="divide-y divide-[#1C2321]/[0.06]">
      {lines.map((l, i) => (
        <div key={i} className="grid grid-cols-[64px_1fr] sm:grid-cols-[72px_120px_1fr] gap-x-3 gap-y-0.5 py-2.5 items-center">
          <div className="flex items-center gap-1.5">
            {l.h && <span className={`w-1.5 h-1.5 rounded-full ${HL[l.h].dot}`} />}
            <span className={`font-mono text-[13px] font-semibold ${tone === "good" ? "text-[#1F4B4C]" : "text-[#1C2321]/55"}`}>
              {l.code || "·"}
            </span>
            {l.mod && (
              <span className="font-mono text-[10px] text-[#C9873A] bg-[#C9873A]/10 rounded px-1 py-0.5">
                {l.mod.startsWith("×") ? l.mod : `-${l.mod}`}
              </span>
            )}
          </div>
          <span className={`font-mono text-[12px] ${tone === "good" ? "text-[#1C2321]/80" : "text-[#1C2321]/45 line-through decoration-[#b54a3a]/40"}`}>
            {l.dx}
          </span>
          <span className="col-span-2 sm:col-span-1 text-[12px] text-[#1C2321]/50">{l.desc}</span>
        </div>
      ))}
    </div>
  );
}

export default function ScenariosSection() {
  const [active, setActive] = useState(0);
  const s = SCENARIOS[active];

  return (
    <section id="scenarios" className="bg-[#F1EEE7] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12"
        >
          <div className="max-w-2xl">
            <span className="text-[#C9873A] text-xs font-semibold uppercase tracking-[0.2em]">Real coding scenarios</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1C2321] mt-4 leading-tight">
              From the progress note to a claim that gets paid.
            </h2>
            <p className="mt-5 text-[#1C2321]/60 leading-relaxed">
              Three encounters small practices see every week. Each one shows what usually gets submitted,
              why the payer pushes back, and the claim Prevo builds from the same note.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((sc, i) => (
              <button
                key={sc.id}
                onClick={() => setActive(i)}
                className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                  i === active ? "text-white" : "text-[#1C2321]/65 hover:text-[#1C2321] bg-white/60"
                }`}
              >
                {i === active && (
                  <motion.span layoutId="scenario-pill" className="absolute inset-0 rounded-full bg-[#1F4B4C]" transition={{ duration: 0.5, ease }} />
                )}
                <span className="relative">{sc.tab}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease }}
            className="grid lg:grid-cols-[1fr_1.05fr] gap-6"
          >
            {/* EHR note panel */}
            <div className="rounded-3xl bg-white border border-[#1C2321]/[0.06] shadow-[0_30px_60px_-35px_rgba(28,35,33,0.35)] overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3.5 bg-[#1F4B4C]">
                <span className="font-mono text-[11px] tracking-wider text-white/90">PROGRESS NOTE · SIGNED</span>
                <span className="text-[11px] text-white/55">{s.specialty}</span>
              </div>
              <div className="px-6 py-4 border-b border-[#1C2321]/[0.06] grid grid-cols-3 gap-4 text-[11px]">
                <div>
                  <p className="text-[#1C2321]/35 uppercase tracking-wider text-[9px]">Patient</p>
                  <p className="font-mono text-[#1C2321]/70 mt-0.5">MRN ••••{4821 + active * 137}</p>
                </div>
                <div>
                  <p className="text-[#1C2321]/35 uppercase tracking-wider text-[9px]">Encounter</p>
                  <p className="text-[#1C2321]/70 mt-0.5">{s.encounter.split(" · ")[1]}</p>
                </div>
                <div>
                  <p className="text-[#1C2321]/35 uppercase tracking-wider text-[9px]">Status</p>
                  <p className="text-[#3d6b3a] mt-0.5">Ready to code</p>
                </div>
              </div>
              <div className="px-6 py-6">
                <p className="text-[15px] leading-[1.85] text-[#1C2321]/80 font-[family-name:var(--font-serif)]">
                  {s.note.map((seg, i) =>
                    seg.h ? (
                      <mark key={i} className={`${HL[seg.h].mark} text-[#1C2321] rounded px-1 py-0.5`}>
                        {seg.t}
                      </mark>
                    ) : (
                      <span key={i}>{seg.t}</span>
                    )
                  )}
                </p>
                <p className="mt-6 text-[11px] text-[#1C2321]/35">De-identified example. Highlights link each phrase to the claim line it supports.</p>
              </div>
            </div>

            {/* Claim comparison */}
            <div className="space-y-4">
              <div className="rounded-2xl bg-white border border-[#b54a3a]/15 p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1C2321]/45">As usually submitted</p>
                  <span className="text-[11px] font-semibold rounded-full px-2.5 py-1 bg-[#b54a3a]/10 text-[#9a3d2f]">
                    {s.outcome.label} · {s.outcome.code}
                  </span>
                </div>
                <ClaimLines lines={s.submitted} tone="bad" />
                <p className="mt-3 text-[12.5px] text-[#9a3d2f]/85 leading-relaxed">{s.outcome.detail}</p>
              </div>

              <div className="rounded-2xl bg-white border border-[#5C8558]/25 p-5 shadow-[0_20px_40px_-30px_rgba(92,133,88,0.6)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1C2321]/45">Prevo corrected claim</p>
                  <span className="text-[11px] font-semibold rounded-full px-2.5 py-1 bg-[#5C8558]/15 text-[#3d6b3a]">✓ Clean</span>
                </div>
                <ClaimLines lines={s.corrected} tone="good" />
              </div>

              <div className="rounded-2xl bg-[#1F4B4C] text-white p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#E0A862] mb-3">Why it changed</p>
                <ul className="space-y-3">
                  {s.why.map((w, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-white/80 leading-relaxed">
                      <span className="font-mono text-[11px] text-white/35 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      {w}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 pt-4 border-t border-white/10 flex gap-3 items-start">
                  <span className="text-[9px] font-mono uppercase tracking-wider bg-[#C9873A]/25 text-[#F0C38A] rounded px-2 py-1 shrink-0">
                    Human step
                  </span>
                  <p className="text-[13px] text-white/70">{s.human}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
