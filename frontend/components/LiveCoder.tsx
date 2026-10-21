"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// A note types itself, evidence phrases get highlighted, codes snap in, and the claim is stamped.
type Code = { code: string; mod?: string; kind: "CPT" | "HCPCS" | "ICD-10"; desc: string; fixed?: string };
type Encounter = {
  enc: string;
  specialty: string;
  text: string;
  evidence: string[];
  codes: Code[];
  stamp: { label: string; tone: "clean" | "held" };
};

const ENCOUNTERS: Encounter[] = [
  {
    enc: "ENC-48213",
    specialty: "Family medicine · Est. patient",
    text: "45M, 3 wks right knee pain. Moderate effusion R knee. Aspirated and injected methylprednisolone 40 mg, R knee. BP 152/96 x2, dx essential HTN, start lisinopril 10 mg.",
    evidence: ["Moderate effusion R knee", "Aspirated and injected methylprednisolone 40 mg", "dx essential HTN, start lisinopril"],
    codes: [
      { code: "20610", mod: "RT", kind: "CPT", desc: "Arthrocentesis, major joint" },
      { code: "J1030", mod: "×1", kind: "HCPCS", desc: "Methylprednisolone 40 mg", fixed: "added" },
      { code: "99213", mod: "25", kind: "CPT", desc: "Separate E/M", fixed: "-25 added" },
      { code: "M25.461", kind: "ICD-10", desc: "Effusion, right knee", fixed: "was M25.561" },
      { code: "I10", kind: "ICD-10", desc: "Essential hypertension" },
    ],
    stamp: { label: "Clean claim", tone: "clean" },
  },
  {
    enc: "ENC-48330",
    specialty: "Internal medicine · Follow-up",
    text: "62F T2DM f/u. A1c 8.9%, up from 7.6. eGFR 48, CKD 3a due to diabetes. On metformin and glargine. Poorly controlled; increase glargine to 24 units.",
    evidence: ["CKD 3a due to diabetes", "On metformin and glargine", "Poorly controlled"],
    codes: [
      { code: "99214", kind: "CPT", desc: "Office visit, moderate MDM", fixed: "was 99213" },
      { code: "E11.22", kind: "ICD-10", desc: "T2DM with diabetic CKD", fixed: "was E11.9" },
      { code: "N18.31", kind: "ICD-10", desc: "CKD stage 3a" },
      { code: "E11.65", kind: "ICD-10", desc: "T2DM with hyperglycemia" },
      { code: "Z79.4", kind: "ICD-10", desc: "Long-term insulin use" },
    ],
    stamp: { label: "Sign-off needed", tone: "held" },
  },
];

type Phase = "typing" | "coding" | "stamped";

export default function LiveCoder() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const e = ENCOUNTERS[i];

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (typed < e.text.length) t = setTimeout(() => setTyped((n) => Math.min(e.text.length, n + 2)), 22);
      else t = setTimeout(() => setPhase("coding"), 350);
    } else if (phase === "coding") {
      if (shown < e.codes.length) t = setTimeout(() => setShown((n) => n + 1), 380);
      else t = setTimeout(() => setPhase("stamped"), 450);
    } else {
      t = setTimeout(() => {
        setI((x) => (x + 1) % ENCOUNTERS.length);
        setTyped(0);
        setShown(0);
        setPhase("typing");
      }, 3200);
    }
    return () => clearTimeout(t);
  }, [phase, typed, shown, e]);

  // Split note into plain/evidence segments
  const segs = useMemo(() => {
    const out: { t: string; ev: boolean; start: number }[] = [];
    let pos = 0;
    const marks = e.evidence
      .map((p) => ({ p, at: e.text.indexOf(p) }))
      .filter((m) => m.at >= 0)
      .sort((a, b) => a.at - b.at);
    for (const m of marks) {
      if (m.at > pos) out.push({ t: e.text.slice(pos, m.at), ev: false, start: pos });
      out.push({ t: m.p, ev: true, start: m.at });
      pos = m.at + m.p.length;
    }
    if (pos < e.text.length) out.push({ t: e.text.slice(pos), ev: false, start: pos });
    return out;
  }, [e]);

  const status =
    phase === "typing" ? { t: "Reading note", c: "text-white/60" } : phase === "coding" ? { t: "Coding · checking edits", c: "text-[#FCD34D]" } : { t: "Checked", c: "text-[#5EEAD4]" };

  return (
    <div className="relative w-full max-w-[480px] rounded-2xl border border-white/15 bg-[#0B1220]/70 backdrop-blur-xl shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 h-12 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#5EEAD4] opacity-60 animate-ping" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-[#5EEAD4]" />
          </span>
          <span className="font-mono text-[11px] text-white/80">{e.enc}</span>
          <span className="text-[11px] text-white/40 hidden sm:inline">{e.specialty}</span>
        </div>
        <span className={`font-mono text-[10.5px] ${status.c}`}>{status.t}</span>
      </div>

      {/* Note */}
      <div className="px-5 pt-4 pb-5 min-h-[132px]">
        <p className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/35 mb-2">Signed note · A/P</p>
        <p className="text-[14px] leading-[1.75] text-white/85">
          {segs.map((sg, k) => {
            const visible = Math.max(0, Math.min(sg.t.length, typed - sg.start));
            if (!visible) return null;
            const done = visible === sg.t.length && phase !== "typing" ? true : visible === sg.t.length;
            return sg.ev ? (
              <span
                key={k}
                className="bg-no-repeat bg-left-bottom transition-[background-size] duration-700 ease-out rounded-sm"
                style={{
                  backgroundImage: "linear-gradient(transparent 55%, rgba(94,234,212,0.38) 55%)",
                  backgroundSize: done ? "100% 100%" : "0% 100%",
                }}
              >
                {sg.t.slice(0, visible)}
              </span>
            ) : (
              <span key={k}>{sg.t.slice(0, visible)}</span>
            );
          })}
          {phase === "typing" && <span className="inline-block w-[7px] h-[15px] -mb-[2px] ml-0.5 bg-[#5EEAD4] animate-pulse" />}
        </p>
      </div>

      {/* Codes */}
      <div className="relative border-t border-white/10 bg-white/[0.02] px-5 py-4 min-h-[236px]">
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {e.codes.slice(0, shown).map((c) => (
              <motion.div
                key={e.enc + c.code}
                initial={{ opacity: 0, x: -14, filter: "blur(4px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-lg px-3 py-2 bg-white/[0.04] border border-white/[0.07]"
              >
                <span className="font-mono text-[9.5px] text-white/35 w-11">{c.kind}</span>
                <span className="font-mono text-[13px] text-white">{c.code}</span>
                {c.mod && (
                  <span className="font-mono text-[10px] text-[#FCD34D] bg-[#B45309]/25 rounded px-1.5 py-0.5">
                    {c.mod.startsWith("×") ? c.mod : `-${c.mod}`}
                  </span>
                )}
                <span className="text-[11.5px] text-white/45 truncate">{c.desc}</span>
                {c.fixed && <span className="ml-auto shrink-0 font-mono text-[9.5px] text-[#5EEAD4]">{c.fixed}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Stamp */}
        <AnimatePresence>
          {phase === "stamped" && (
            <motion.div
              key={"stamp" + e.enc}
              initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -9 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className={`absolute right-5 bottom-5 rounded-md border-[3px] px-3 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] backdrop-blur-sm ${
                e.stamp.tone === "clean" ? "border-[#5EEAD4] text-[#5EEAD4] bg-[#0B1220]/70" : "border-[#FBBF24] text-[#FCD34D] bg-[#0B1220]/70"
              }`}
            >
              {e.stamp.tone === "clean" ? "✓ " : "! "}
              {e.stamp.label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
