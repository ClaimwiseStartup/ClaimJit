"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WindowPane, { StatusPill } from "./WindowPane";

const ease = [0.22, 1, 0.36, 1] as const;

// Highlight colors link a phrase in the note to the claim line it supports
const HL: Record<string, { mark: string; dot: string }> = {
  a: { mark: "bg-[#0F766E]/[0.13] decoration-[#0F766E]", dot: "bg-[#0F766E]" },
  b: { mark: "bg-[#1E293B]/[0.08] decoration-[#1E293B]", dot: "bg-[#1E293B]" },
  c: { mark: "bg-[#B45309]/[0.10] decoration-[#B45309]", dot: "bg-[#B45309]" },
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
  {
    id: "appendectomy",
    tab: "Operative note",
    specialty: "General surgery",
    encounter: "Outpatient surgery · Operative report",
    note: [
      { t: "Preop dx: acute appendicitis. " },
      { t: "Postop dx: acute appendicitis with localized peritonitis, no perforation or gangrene", h: "a" },
      { t: ". Procedure: " },
      { t: "laparoscopic appendectomy", h: "b" },
      { t: ". " },
      { t: "Diagnostic laparoscopy performed first to confirm", h: "c" },
      { t: "; inflamed appendix with localized purulent fluid in RLQ, no perforation. Appendix divided with endoscopic stapler and sent to pathology." },
    ],
    submitted: [
      { code: "44970", dx: "K35.80", desc: "Laparoscopic appendectomy" },
      { code: "49320", dx: "K35.80", desc: "Diagnostic laparoscopy" },
    ],
    outcome: {
      label: "Line denied",
      code: "CARC 97",
      detail: "Diagnostic laparoscopy is bundled into the surgical laparoscopy, and K35.80 ignores the documented peritonitis.",
    },
    corrected: [{ code: "44970", dx: "K35.30", desc: "Lap appendectomy · acute appendicitis w/ localized peritonitis", h: "b" }],
    why: [
      "A diagnostic laparoscopy is always included in a surgical laparoscopy of the same area, so 49320 comes off the claim.",
      "Code from the postoperative diagnosis. Localized peritonitis without perforation or gangrene is K35.30, not the unspecified K35.80.",
      "44970 carries a 90-day global period. Routine post-op visits aren't billable; an unrelated visit in that window needs modifier 24.",
    ],
    human: "Coder: reconcile with the pathology report. If it shows gangrene or perforation, update to K35.31 or K35.32 before submitting.",
  },
];

function ClaimTable({ lines, tone }: { lines: Line[]; tone: "bad" | "good" }) {
  const good = tone === "good";
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[9.5px] uppercase tracking-[0.12em] text-[#94A3B8]">
          <th className="font-semibold py-1.5 pr-3 w-[92px]">CPT/HCPCS</th>
          <th className="font-semibold py-1.5 pr-3 w-[118px]">ICD-10-CM</th>
          <th className="font-semibold py-1.5 hidden sm:table-cell">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E2E8F0]">
        {lines.map((l, i) => (
          <tr key={i} className="align-top">
            <td className="py-2.5 pr-3">
              <span className="flex items-center gap-1.5">
                {l.h && <span className={`w-1.5 h-1.5 rounded-full ${HL[l.h].dot}`} />}
                <span className={`font-mono text-[13px] font-semibold ${good ? "text-[#0F766E]" : "text-[#64748B]"}`}>{l.code || "·"}</span>
                {l.mod && (
                  <span className="font-mono text-[10px] text-[#B45309] bg-[#B45309]/10 rounded px-1 py-0.5">
                    {l.mod.startsWith("×") ? l.mod : `-${l.mod}`}
                  </span>
                )}
              </span>
            </td>
            <td className={`py-2.5 pr-3 font-mono text-[12px] ${good ? "text-[#1E293B]" : "text-[#991B1B]/70 line-through decoration-[#991B1B]/40"}`}>{l.dx}</td>
            <td className="py-2.5 text-[12px] text-[#64748B] hidden sm:table-cell">{l.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ScenariosSection() {
  const [active, setActive] = useState(0);
  const s = SCENARIOS[active];
  const isOp = s.id === "appendectomy";

  return (
    <section id="scenarios" className="bg-[#F1F5F9] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="max-w-2xl mb-10"
        >
          <span className="text-[#0F766E] text-xs font-semibold uppercase tracking-[0.2em]">Real coding scenarios</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1E293B] mt-4 leading-tight">
            From the clinical note to a claim that gets paid.
          </h2>
          <p className="mt-5 text-[#475569] leading-relaxed">
            Four encounters independent practices see every week. Each shows what usually gets submitted,
            why the payer pushes back, and the claim Prevo builds from the same documentation.
          </p>
        </motion.div>

        {/* Encounter queue, like a coder's worklist */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-6" role="tablist">
          {SCENARIOS.map((sc, i) => (
            <button
              key={sc.id}
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`relative text-left rounded-lg px-4 py-3 border transition-all cursor-pointer ${
                i === active
                  ? "bg-white border-[#0F766E]/40 shadow-[0_8px_24px_-16px_rgba(15,118,110,0.6)]"
                  : "bg-white/50 border-[#CBD5E1]/60 hover:bg-white"
              }`}
            >
              {i === active && <motion.span layoutId="scn-bar" className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-[#0F766E]" />}
              <span className="block font-mono text-[10px] text-[#94A3B8]">ENC-{48213 + i * 117}</span>
              <span className={`block text-[13.5px] font-semibold mt-0.5 ${i === active ? "text-[#1E293B]" : "text-[#475569]"}`}>{sc.tab}</span>
              <span className="block text-[11.5px] text-[#94A3B8] mt-0.5">{sc.specialty}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease }}
            className="grid lg:grid-cols-[1fr_1.05fr] gap-5"
          >
            <WindowPane
              title="Clinical Documentation"
              icon="doc"
              tabs={isOp ? ["Op report", "Pathology"] : ["Progress note", "Orders"]}
              meta={<StatusPill tone="ok">Signed</StatusPill>}
            >
              <div className="px-6 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] grid grid-cols-3 gap-4 text-[11px]">
                <div>
                  <p className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Patient</p>
                  <p className="font-mono text-[#334155] mt-0.5">MRN ••••{4821 + active * 137}</p>
                </div>
                <div>
                  <p className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Setting</p>
                  <p className="text-[#334155] mt-0.5">{s.encounter.split(" · ")[0]}</p>
                </div>
                <div>
                  <p className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Document</p>
                  <p className="text-[#334155] mt-0.5">{s.encounter.split(" · ")[1]}</p>
                </div>
              </div>
              <div className="px-6 py-6">
                <p className="text-[15px] leading-[1.9] text-[#334155] font-[family-name:var(--font-serif)]">
                  {s.note.map((seg, i) =>
                    seg.h ? (
                      <mark key={i} className={`${HL[seg.h].mark} text-[#1E293B] rounded-sm px-1 py-0.5 underline decoration-2 underline-offset-4`}>
                        {seg.t}
                      </mark>
                    ) : (
                      <span key={i}>{seg.t}</span>
                    )
                  )}
                </p>
                <p className="mt-6 pt-4 border-t border-dashed border-[#E2E8F0] text-[11px] text-[#94A3B8]">
                  De-identified example · underlined phrases map to the claim lines that cite them
                </p>
              </div>
            </WindowPane>

            <div className="space-y-5">
              <WindowPane
                title="Claim Scrubber · 837P"
                icon="claim"
                meta={<StatusPill tone="alert">{s.outcome.label}</StatusPill>}
                bodyClassName="divide-y divide-[#E2E8F0]"
              >
                <div className="px-5 py-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">As usually submitted</p>
                    <span className="font-mono text-[11px] text-[#991B1B]">{s.outcome.code}</span>
                  </div>
                  <ClaimTable lines={s.submitted} tone="bad" />
                  <div className="mt-3 rounded-md border-l-[3px] border-[#991B1B] bg-[#991B1B]/[0.05] px-3 py-2 text-[12.5px] text-[#7F1D1D] leading-relaxed">
                    {s.outcome.detail}
                  </div>
                </div>
                <div className="px-5 py-4 bg-[#0F766E]/[0.03]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0F766E]">Prevo corrected claim</p>
                    <StatusPill tone="ok">Clean</StatusPill>
                  </div>
                  <ClaimTable lines={s.corrected} tone="good" />
                </div>
              </WindowPane>

              <WindowPane title="Coder Notes" icon="book" tone="dark" bodyClassName="p-5 bg-[#1E293B]">
                <ul className="space-y-3">
                  {s.why.map((w, i) => (
                    <li key={i} className="flex gap-3 text-[13.5px] text-white/80 leading-relaxed">
                      <span className="font-mono text-[11px] text-[#5EEAD4] mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                      {w}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 rounded-md border-l-[3px] border-[#F59E0B] bg-[#B45309]/20 px-3 py-2.5 flex gap-3 items-start">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-[#FCD34D] shrink-0 mt-0.5">Human step</span>
                  <p className="text-[13px] text-white/80">{s.human}</p>
                </div>
              </WindowPane>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
