"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Row = {
  kind: "Diagnosis" | "Procedure" | "Modifier" | "Drug";
  item: string;
  code: string;
  guideline: string;
  pitfall: string;
};

const ROWS: Row[] = [
  {
    kind: "Diagnosis",
    item: "Type 2 diabetes with diabetic CKD",
    code: "E11.22 + N18.3x",
    guideline: "The 'with' convention presumes the link. Add a second code for the CKD stage (N18.30–N18.32 for stage 3).",
    pitfall: "Billing E11.9 alongside a CKD code. E11.9 says 'without complications'.",
  },
  {
    kind: "Diagnosis",
    item: "Type 2 diabetes with hyperglycemia",
    code: "E11.65",
    guideline: "Assign when the provider documents 'poorly controlled', 'out of control' or 'hyperglycemia'.",
    pitfall: "Coding it from an elevated A1c with no provider statement.",
  },
  {
    kind: "Diagnosis",
    item: "Long-term drug therapy for diabetes",
    code: "Z79.4 / Z79.84",
    guideline: "Z79.4 for insulin, Z79.84 for oral hypoglycemics. If the patient is on both, report both.",
    pitfall: "Using Z79.4 for insulin given only temporarily to bring glucose under control.",
  },
  {
    kind: "Diagnosis",
    item: "Hypertension with CKD",
    code: "I12.9 + N18.x",
    guideline: "Presumed causal link. I12.9 for CKD stages 1–4, I12.0 for stage 5 or ESRD.",
    pitfall: "Reporting I10 when CKD is also documented.",
  },
  {
    kind: "Diagnosis",
    item: "Low back pain",
    code: "M54.50",
    guideline: "M54.50 is unspecified, M54.51 vertebrogenic and M54.59 other low back pain.",
    pitfall: "Still billing M54.5, which was deleted in FY2022 and now rejects as invalid.",
  },
  {
    kind: "Diagnosis",
    item: "Effusion, right knee",
    code: "M25.461",
    guideline: "Laterality lives in the 6th character: 1 right, 2 left, 9 unspecified.",
    pitfall: "Unspecified laterality (M25.469) when the note names the side.",
  },
  {
    kind: "Procedure",
    item: "Arthrocentesis / injection, major joint",
    code: "20610 / 20611",
    guideline: "20611 includes ultrasound guidance with a permanent image and report.",
    pitfall: "Billing 76942 on top of 20611 (bundled), or 20611 without a saved image.",
  },
  {
    kind: "Procedure",
    item: "Preventive visit, est. patient 40–64",
    code: "99396",
    guideline: "Age-banded (99395 for 18–39, 99397 for 65+). Pair with Z00.00 or Z00.01.",
    pitfall: "Using Z00.00 when a new problem was found. That calls for Z00.01 plus the finding.",
  },
  {
    kind: "Modifier",
    item: "Significant, separately identifiable E/M",
    code: "-25",
    guideline: "Goes on the E/M, same day as a minor procedure or preventive visit, with its own documentation.",
    pitfall: "Putting it on the procedure, or using it when the E/M was just the decision to do the procedure.",
  },
  {
    kind: "Modifier",
    item: "Distinct procedural service",
    code: "-59 / XE XS XP XU",
    guideline: "Use only to bypass an NCCI PTP edit when services really are distinct. X-modifiers are more specific.",
    pitfall: "Reaching for -59 to get past every edit. It's one of the most audited modifiers.",
  },
  {
    kind: "Modifier",
    item: "Laterality",
    code: "-RT / -LT / -50",
    guideline: "Many payers require them on joint and extremity procedures. -50 for bilateral, per payer policy.",
    pitfall: "Billing RT and LT on separate lines when the payer wants a single line with -50.",
  },
  {
    kind: "Drug",
    item: "Methylprednisolone acetate",
    code: "J1020 / J1030 / J1040",
    guideline: "Per 20, 40 or 80 mg. Pick the code that fits the dose and bill units accordingly.",
    pitfall: "Billing 80 mg as J1030 × 1, or forgetting the drug line entirely.",
  },
];

const KINDS = ["All", "Diagnosis", "Procedure", "Modifier", "Drug"] as const;

const KIND_STYLE: Record<Row["kind"], string> = {
  Diagnosis: "bg-[#1F4B4C]/10 text-[#1F4B4C]",
  Procedure: "bg-[#C9873A]/12 text-[#8A5A24]",
  Modifier: "bg-[#5C8558]/15 text-[#3d6b3a]",
  Drug: "bg-[#6B5B95]/12 text-[#54467a]",
};

export default function CodeGuideSection() {
  const [filter, setFilter] = useState<(typeof KINDS)[number]>("All");
  const rows = filter === "All" ? ROWS : ROWS.filter((r) => r.kind === filter);

  return (
    <section id="code-guide" className="bg-[#FAF8F4] py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="grid lg:grid-cols-[1fr_auto] gap-8 items-end mb-10"
        >
          <div className="max-w-2xl">
            <span className="text-[#C9873A] text-xs font-semibold uppercase tracking-[0.2em]">Code guide</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-[#1C2321] mt-4 leading-tight">
              The rules Prevo checks on every claim.
            </h2>
            <p className="mt-5 text-[#1C2321]/60 leading-relaxed">
              A working reference of the specificity and modifier rules behind the most common
              outpatient denials. Prevo applies these automatically; this is what it's looking for.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-full text-sm transition-all cursor-pointer border ${
                  filter === k
                    ? "bg-[#1C2321] text-white border-[#1C2321]"
                    : "bg-white text-[#1C2321]/60 border-[#1C2321]/10 hover:border-[#1C2321]/25"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
          className="rounded-3xl bg-white border border-[#1C2321]/[0.07] shadow-[0_30px_60px_-40px_rgba(28,35,33,0.35)] overflow-hidden"
        >
          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[1.3fr_0.8fr_1.6fr_1.6fr] gap-6 px-7 py-4 bg-[#1F4B4C] text-[10px] uppercase tracking-[0.16em] text-white/60 font-semibold">
            <span>Diagnosis / procedure</span>
            <span>Code</span>
            <span>Guideline & specificity</span>
            <span>Common pitfall</span>
          </div>

          <div className="divide-y divide-[#1C2321]/[0.06]">
            <AnimatePresence initial={false}>
              {rows.map((r) => (
                <motion.div
                  key={r.item}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.8fr_1.6fr_1.6fr] gap-2 lg:gap-6 px-6 lg:px-7 py-5 hover:bg-[#FAF8F4] transition-colors"
                >
                  <div>
                    <span className={`inline-block text-[9px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 mb-1.5 ${KIND_STYLE[r.kind]}`}>
                      {r.kind}
                    </span>
                    <p className="text-[14px] font-medium text-[#1C2321]">{r.item}</p>
                  </div>
                  <p className="font-mono text-[14px] font-semibold text-[#1F4B4C] lg:pt-5">{r.code}</p>
                  <p className="text-[13px] text-[#1C2321]/65 leading-relaxed lg:pt-5">{r.guideline}</p>
                  <p className="text-[13px] text-[#9a3d2f]/85 leading-relaxed lg:pt-5 flex gap-2">
                    <span className="lg:hidden font-semibold">Pitfall:</span>
                    {r.pitfall}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="mt-5 text-[12px] text-[#1C2321]/40 max-w-3xl">
          Reference only, not a substitute for the current code books or payer policy. CPT® is a registered trademark of the American Medical Association.
        </p>
      </div>
    </section>
  );
}
