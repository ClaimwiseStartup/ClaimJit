"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import SectionHeader from "./SectionHeader";
import { StatusPill } from "./WindowPane";
import { SCENARIOS, HL, type Line } from "./scenarios-data";

const ease = [0.22, 1, 0.36, 1] as const;

const QUEUE_STATUS: Record<string, { tone: "ok" | "warn"; label: string }> = {
  knee: { tone: "ok", label: "Fixed" },
  diabetes: { tone: "warn", label: "Sign-off" },
  preventive: { tone: "ok", label: "Fixed" },
  appendectomy: { tone: "warn", label: "Path. check" },
};

const NAV = [
  { label: "Worklist", d: "M4 6h16M4 12h16M4 18h10", active: true },
  { label: "Claims", d: "M6 3h9l3 3v15H6zM9 10h6M9 14h6" },
  { label: "Denials", d: "M12 3l9 16H3zM12 10v4M12 17h.01" },
  { label: "Payer rules", d: "M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM9 9h5M9 13h5" },
  { label: "Reports", d: "M4 20V10M10 20V4M16 20v-7M22 20H2" },
];

function ClaimTable({ lines, tone }: { lines: Line[]; tone: "bad" | "good" }) {
  const good = tone === "good";
  return (
    <table className="w-full text-left">
      <thead>
        <tr className="text-[9.5px] uppercase tracking-[0.12em] text-[#94A3B8]">
          <th className="font-medium py-1.5 pr-3 w-[96px]">CPT/HCPCS</th>
          <th className="font-medium py-1.5 pr-3 w-[118px]">ICD-10-CM</th>
          <th className="font-medium py-1.5 hidden sm:table-cell">Description</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#E2E8F0]">
        {lines.map((l, i) => (
          <tr key={i} className="align-top">
            <td className="py-2.5 pr-3">
              <span className="flex items-center gap-1.5">
                {l.h && <span className={`w-1.5 h-1.5 rounded-full ${HL[l.h].dot}`} />}
                <span className={`font-mono text-[13px] font-medium ${good ? "text-[#0F766E]" : "text-[#64748B]"}`}>{l.code || "·"}</span>
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

export default function ProductShowcase() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);
  const inView = useInView(shellRef, { margin: "-20%" });
  const s = SCENARIOS[active];
  const isOp = s.id === "appendectomy";

  // Walk the worklist on its own until someone clicks
  useEffect(() => {
    if (!auto || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % SCENARIOS.length), 9000);
    return () => clearTimeout(t);
  }, [active, auto, inView]);

  const pick = (i: number) => {
    setAuto(false);
    setActive(i);
  };

  return (
    <section id="product" className="relative bg-[#0B1220] py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(15,118,110,0.22),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="03"
          eyebrow="See Prevo at work"
          tone="dark"
          title={
            <>
              One worklist. Every claim, <span className="accent text-[#5EEAD4]">explained.</span>
            </>
          }
          lede="Four encounters independent practices see every week: what usually gets submitted, why the payer pushes back, and the claim Prevo builds from the same note."
        />

        <motion.div
          ref={shellRef}
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.1, ease }}
          className="mt-16 rounded-2xl border border-white/10 bg-[#0F172A] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* App top bar */}
          <div className="flex items-center gap-4 h-12 px-4 border-b border-white/[0.07] bg-[#0B1220]/60">
            <div className="flex gap-1.5" aria-hidden>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-2.5 h-2.5 rounded-full bg-white/15" />
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-white/40">
              <span className="text-white/70">prevo</span>/<span>worklist</span>/<span className="text-[#5EEAD4]">ENC-{48213 + active * 117}</span>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-2 h-7 px-3 rounded-md bg-white/[0.05] border border-white/[0.07] text-[11px] text-white/35 w-56">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3-3" /></svg>
              Search encounters, codes…
              <span className="ml-auto font-mono text-[10px] border border-white/10 rounded px-1">⌘K</span>
            </div>
            <span className="ml-auto md:ml-0 w-7 h-7 rounded-full bg-[#0F766E] text-white text-[10px] font-semibold grid place-items-center">AB</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[248px_1fr]">
            {/* Sidebar */}
            <aside className="min-w-0 border-b lg:border-b-0 lg:border-r border-white/[0.07] bg-[#0B1220]/40 p-3">
              <nav className="hidden lg:block space-y-0.5 mb-5">
                {NAV.map((n) => (
                  <div
                    key={n.label}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] ${n.active ? "bg-white/[0.07] text-white" : "text-white/45"}`}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={n.d} /></svg>
                    {n.label}
                    {n.label === "Denials" && <span className="ml-auto font-mono text-[10px] text-[#FCA5A5]">0</span>}
                  </div>
                ))}
              </nav>
              <div className="flex items-center justify-between px-3 mb-2">
                <span className="eyebrow !text-[9.5px] text-white/35">Today · {SCENARIOS.length} encounters</span>
                {auto && inView && <span className="w-1.5 h-1.5 rounded-full bg-[#5EEAD4] animate-pulse" aria-label="Auto-playing" />}
              </div>
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible -mx-1 px-1 pb-1 lg:pb-0">
                {SCENARIOS.map((sc, i) => {
                  const st = QUEUE_STATUS[sc.id];
                  const on = i === active;
                  return (
                    <button
                      key={sc.id}
                      onClick={() => pick(i)}
                      className={`relative shrink-0 w-[220px] lg:w-auto text-left rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${on ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"}`}
                    >
                      {on && (
                        <motion.span layoutId="queue-bar" className="absolute left-0 top-2 bottom-2 w-[2px] rounded bg-[#5EEAD4]" />
                      )}
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[10.5px] text-white/40">ENC-{48213 + i * 117}</span>
                        <span className={`text-[9.5px] font-semibold rounded px-1.5 py-0.5 ${st.tone === "ok" ? "bg-[#0F766E]/25 text-[#5EEAD4]" : "bg-[#B45309]/25 text-[#FCD34D]"}`}>
                          {st.label}
                        </span>
                      </div>
                      <p className={`mt-1 text-[13px] ${on ? "text-white" : "text-white/70"}`}>{sc.tab}</p>
                      <p className="text-[11px] text-white/35">{sc.specialty}</p>
                      {on && auto && inView && (
                        <motion.span
                          key={`p-${active}`}
                          className="absolute left-3 right-3 bottom-1 h-px bg-[#5EEAD4]/60 origin-left"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 9, ease: "linear" }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Main */}
            <div className="min-w-0 bg-[#F1F5F9] min-h-[620px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease }}
                  className="p-4 sm:p-6"
                >
                  {/* Encounter header */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-5 border-b border-[#E2E8F0]">
                    <div>
                      <p className="text-[11px] text-[#94A3B8]">{s.specialty}</p>
                      <p className="text-[19px] font-semibold tracking-[-0.02em] text-[#0B1220]">{s.tab}</p>
                    </div>
                    <div className="flex gap-5 text-[11px] ml-auto">
                      <div>
                        <p className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Patient</p>
                        <p className="font-mono text-[#334155] mt-0.5">MRN ••••{4821 + active * 137}</p>
                      </div>
                      <div>
                        <p className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Setting</p>
                        <p className="text-[#334155] mt-0.5">{s.encounter.split(" · ")[0]}</p>
                      </div>
                      <div className="hidden sm:block">
                        <p className="text-[#94A3B8] uppercase tracking-wider text-[9px]">Payer</p>
                        <p className="text-[#334155] mt-0.5">{["BlueCross", "Medicare", "Aetna", "United"][active]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-1 xl:grid-cols-[1fr_1.05fr] gap-4 [&>*]:min-w-0">
                    {/* Note */}
                    <div className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden">
                      <div className="flex items-center justify-between px-4 h-10 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                        <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#334155]">{isOp ? "Operative report" : "Progress note"}</span>
                        <StatusPill tone="ok">Signed</StatusPill>
                      </div>
                      <p className="px-5 py-5 text-[15px] leading-[1.9] text-[#334155]">
                        {s.note.map((seg, i) =>
                          seg.h ? (
                            <mark key={i} className={`${HL[seg.h].mark} text-[#0B1220] rounded-sm px-1 py-0.5 underline decoration-2 underline-offset-4`}>
                              {seg.t}
                            </mark>
                          ) : (
                            <span key={i}>{seg.t}</span>
                          )
                        )}
                      </p>
                    </div>

                    {/* Claim + notes */}
                    <div className="space-y-4">
                      <div className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden">
                        <div className="flex items-center justify-between px-4 h-10 border-b border-[#E2E8F0] bg-[#F8FAFC]">
                          <span className="font-mono text-[10.5px] uppercase tracking-[0.08em] text-[#334155]">Claim scrubber · 837P</span>
                          <StatusPill tone="alert">{s.outcome.label}</StatusPill>
                        </div>
                        <div className="px-4 py-3">
                          <div className="flex justify-between mb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#64748B]">As usually submitted</span>
                            <span className="font-mono text-[11px] text-[#991B1B]">{s.outcome.code}</span>
                          </div>
                          <ClaimTable lines={s.submitted} tone="bad" />
                          <p className="mt-2 rounded-md border-l-[3px] border-[#991B1B] bg-[#991B1B]/[0.05] px-3 py-2 text-[12.5px] text-[#7F1D1D] leading-relaxed">
                            {s.outcome.detail}
                          </p>
                        </div>
                        <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#0F766E]/[0.035]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#0F766E]">Prevo corrected</span>
                            <StatusPill tone="ok">Clean</StatusPill>
                          </div>
                          <ClaimTable lines={s.corrected} tone="good" />
                        </div>
                      </div>

                      <div className="rounded-xl bg-[#1E293B] p-5">
                        <p className="eyebrow !text-[10px] text-[#5EEAD4] mb-3">Coder notes</p>
                        <ul className="space-y-2.5">
                          {s.why.map((w, i) => (
                            <li key={i} className="flex gap-3 text-[13px] text-white/80 leading-relaxed">
                              <span className="font-mono text-[10.5px] text-white/35 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action bar */}
                  <div className="mt-4 flex flex-col md:flex-row md:items-center gap-3 rounded-xl border border-[#F59E0B]/40 bg-[#FFFBEB] px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#B45309] shrink-0">Human step</span>
                    <p className="text-[13px] text-[#78350F] flex-1">{s.human}</p>
                    <div className="flex gap-2 shrink-0">
                      <span className="px-3 py-1.5 rounded-md border border-[#CBD5E1] bg-white text-[12px] text-[#334155]">Send query</span>
                      <span className="px-3 py-1.5 rounded-md bg-[#0F766E] text-[12px] text-white font-medium">Approve & submit</span>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
