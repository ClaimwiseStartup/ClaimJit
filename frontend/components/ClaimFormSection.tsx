"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import SectionHeader from "./SectionHeader";
import Mark from "./Mark";

const INK = "#C2362F"; // CMS-1500 drop-out red
const ease = [0.22, 1, 0.36, 1] as const;

// Typed value that appears when the fill sequence reaches its step
function V({ at, step, children, fix, className = "" }: { at: number; step: number; children: ReactNode; fix?: boolean; className?: string }) {
  const on = step >= at;
  return (
    <motion.span
      initial={false}
      animate={{ opacity: on ? 1 : 0, y: on ? 0 : 4 }}
      transition={{ duration: 0.25 }}
      className={`relative inline-block font-mono uppercase text-[#111827] ${className}`}
    >
      {fix && (
        <motion.span
          aria-hidden
          className="absolute -left-1 -right-1 bottom-0 h-[55%] -z-10 bg-[#5EEAD4]/55 origin-left rounded-[2px]"
          initial={false}
          animate={{ scaleX: on ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: [0.65, 0, 0.35, 1] }}
        />
      )}
      {children}
    </motion.span>
  );
}

// Coder's margin note, in "pen"
function Note({ at, step, children }: { at: number; step: number; children: ReactNode }) {
  return (
    <motion.span
      initial={false}
      animate={{ opacity: step >= at ? 1 : 0, x: step >= at ? 0 : -6 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="font-serif italic text-[15px] leading-none text-[#0F766E] whitespace-nowrap"
    >
      {children}
    </motion.span>
  );
}

function Box({ n, label, children, className = "" }: { n: string; label: string; children?: ReactNode; className?: string }) {
  return (
    <div className={`border-[#C2362F]/70 px-2 pt-1 pb-1.5 ${className}`}>
      <p className="text-[8.5px] leading-tight uppercase tracking-[0.04em]" style={{ color: INK }}>
        <b>{n}.</b> {label}
      </p>
      <div className="mt-1 min-h-[20px] text-[13px] isolate">{children}</div>
    </div>
  );
}

function Check({ on, label }: { on?: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 mr-3 text-[9px] uppercase" style={{ color: INK }}>
      <span className="w-3 h-3 border grid place-items-center text-[10px] font-mono text-[#111827]" style={{ borderColor: INK }}>
        {on ? "X" : ""}
      </span>
      {label}
    </span>
  );
}

const LINES = [
  { cpt: "99213", mod: "25", ptr: "B", chg: "135 00", note: "-25 added: separate E/M", fixMod: true },
  { cpt: "20610", mod: "RT", ptr: "A", chg: "210 00", note: "RT: payer needs laterality", fixMod: true },
  { cpt: "J1030", mod: "", ptr: "A", chg: "18 00", note: "added: drug was never billed", fixCpt: true },
];

export default function ClaimFormSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-25%" });
  const [step, setStep] = useState(0);
  const LAST = 24;

  useEffect(() => {
    if (!inView || step > LAST) return;
    const t = setTimeout(() => setStep((s) => s + 1), step === 0 ? 300 : 150);
    return () => clearTimeout(t);
  }, [inView, step]);

  return (
    <section id="claim-form" className="relative bg-[#EEF2F6] py-28 sm:py-36 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <SectionHeader
          index="1500"
          eyebrow="Health insurance claim form"
          title={
            <>
              The claim, <Mark>filled in right.</Mark>
            </>
          }
          lede="This is what leaves your office. Prevo fills every box from the note, corrects what would have been denied, and marks each change so your team can see why."
        />

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50, rotate: -0.6 }}
          whileInView={{ opacity: 1, y: 0, rotate: -0.4 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, ease }}
          className="mt-16 relative"
        >
          <div className="overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0">
            <div className="relative min-w-[880px] max-w-[1180px] mx-auto bg-[#FFFEFB] shadow-[0_2px_0_rgba(0,0,0,0.04),0_40px_80px_-30px_rgba(15,23,42,0.35)] px-6 pt-5 pb-6">
              {/* Form header */}
              <div className="flex items-end justify-between pb-3">
                <div>
                  <p className="text-[9px] tracking-[0.06em]" style={{ color: INK }}>
                    APPROVED BY NATIONAL UNIFORM CLAIM COMMITTEE (NUCC) 02/12
                  </p>
                  <p className="mt-1 text-[22px] font-bold tracking-[0.06em]" style={{ color: INK }}>
                    HEALTH INSURANCE CLAIM FORM
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px]" style={{ color: INK }}>PICA</span>
                  <span className="w-4 h-4 border" style={{ borderColor: INK }} />
                </div>
              </div>

              <div className="border-t-2 border-l border-r border-b" style={{ borderColor: INK }}>
                {/* Row 1 */}
                <div className="grid grid-cols-12 border-b" style={{ borderColor: INK }}>
                  <Box n="1" label="Medicare · Medicaid · Tricare · Champva · Group health plan · FECA · Other" className="col-span-8 border-r">
                    <span className="flex flex-wrap pt-0.5">
                      <Check label="Medicare" />
                      <Check label="Medicaid" />
                      <Check label="Tricare" />
                      <Check label="Champva" />
                      <Check label="Group health plan" on={step >= 1} />
                      <Check label="FECA" />
                      <Check label="Other" />
                    </span>
                  </Box>
                  <Box n="1a" label="Insured's I.D. number" className="col-span-4">
                    <V at={2} step={step}>XGP•••••4821</V>
                  </Box>
                </div>
                {/* Row 2 */}
                <div className="grid grid-cols-12 border-b" style={{ borderColor: INK }}>
                  <Box n="2" label="Patient's name (last, first, MI)" className="col-span-5 border-r">
                    <V at={3} step={step}>Doe, John</V>
                  </Box>
                  <Box n="3" label="Patient's birth date · sex" className="col-span-3 border-r">
                    <V at={4} step={step}>•• •• 1981 &nbsp; M</V>
                  </Box>
                  <Box n="4" label="Insured's name" className="col-span-4">
                    <V at={5} step={step}>Same</V>
                  </Box>
                </div>
                {/* Box 21 */}
                <div className="border-b" style={{ borderColor: INK }}>
                  <Box n="21" label="Diagnosis or nature of illness or injury · relate A–L to service line below (24E) · ICD Ind. 0">
                    <div className="grid grid-cols-4 gap-4 pt-1">
                      <span className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: INK }}>A.</span>
                        <V at={6} step={step} fix>M25.461</V>
                        <Note at={6} step={step}>was M25.561</Note>
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="text-[10px]" style={{ color: INK }}>B.</span>
                        <V at={7} step={step} fix>I10</V>
                        <Note at={7} step={step}>added</Note>
                      </span>
                      <span className="flex items-center gap-2"><span className="text-[10px]" style={{ color: INK }}>C.</span></span>
                      <span className="flex items-center gap-2"><span className="text-[10px]" style={{ color: INK }}>D.</span></span>
                    </div>
                  </Box>
                </div>

                {/* Box 24 */}
                <div className="border-b" style={{ borderColor: INK }}>
                  <div className="grid grid-cols-[110px_56px_150px_70px_64px_88px_56px_1fr] text-[8.5px] uppercase leading-tight border-b" style={{ color: INK, borderColor: INK }}>
                    {[
                      ["24. A.", "Date(s) of service"],
                      ["B.", "Place of service"],
                      ["D.", "CPT/HCPCS"],
                      ["", "Modifier"],
                      ["E.", "Diagnosis pointer"],
                      ["F.", "$ Charges"],
                      ["G.", "Days or units"],
                      ["", "Prevo"],
                    ].map(([a, b], k) => (
                      <div key={k} className={`px-2 py-1.5 ${k < 7 ? "border-r" : ""}`} style={{ borderColor: INK }}>
                        <b>{a}</b> {b}
                      </div>
                    ))}
                  </div>
                  {LINES.map((l, r) => {
                    const base = 8 + r * 4;
                    return (
                      <div
                        key={l.cpt}
                        className={`grid grid-cols-[110px_56px_150px_70px_64px_88px_56px_1fr] items-center ${r % 2 === 0 ? "bg-[#C2362F]/[0.035]" : ""} border-b last:border-b-0`}
                        style={{ borderColor: "rgba(194,54,47,0.35)" }}
                      >
                        <div className="isolate px-2 py-2.5 border-r" style={{ borderColor: INK }}><V at={base} step={step}>10 20 26</V></div>
                        <div className="isolate px-2 py-2.5 border-r" style={{ borderColor: INK }}><V at={base} step={step}>11</V></div>
                        <div className="isolate px-2 py-2.5 border-r" style={{ borderColor: INK }}><V at={base + 1} step={step} fix={l.fixCpt}>{l.cpt}</V></div>
                        <div className="isolate px-2 py-2.5 border-r" style={{ borderColor: INK }}>{l.mod && <V at={base + 2} step={step} fix={l.fixMod}>{l.mod}</V>}</div>
                        <div className="isolate px-2 py-2.5 border-r" style={{ borderColor: INK }}><V at={base + 2} step={step}>{l.ptr}</V></div>
                        <div className="isolate px-2 py-2.5 border-r text-right" style={{ borderColor: INK }}><V at={base + 3} step={step}>{l.chg}</V></div>
                        <div className="isolate px-2 py-2.5 border-r text-center" style={{ borderColor: INK }}><V at={base + 3} step={step}>1</V></div>
                        <div className="px-3 py-2.5"><Note at={base + 2} step={step}>{l.note}</Note></div>
                      </div>
                    );
                  })}
                </div>

                {/* Row 25-29 */}
                <div className="grid grid-cols-12 border-b" style={{ borderColor: INK }}>
                  <Box n="25" label="Federal tax I.D. number" className="col-span-3 border-r"><V at={20} step={step}>••-•••4512</V></Box>
                  <Box n="26" label="Patient's account no." className="col-span-3 border-r"><V at={20} step={step}>ENC-48213</V></Box>
                  <Box n="27" label="Accept assignment?" className="col-span-2 border-r"><V at={21} step={step}>X Yes</V></Box>
                  <Box n="28" label="Total charge" className="col-span-2 border-r"><V at={21} step={step} fix>$ 363 00</V></Box>
                  <Box n="29" label="Amount paid" className="col-span-2"><V at={21} step={step}>$ 0 00</V></Box>
                </div>
                {/* Row 31-33 */}
                <div className="grid grid-cols-12">
                  <Box n="31" label="Signature of physician or supplier" className="col-span-4 border-r">
                    <motion.span
                      initial={false}
                      animate={{ opacity: step >= 22 ? 1 : 0, clipPath: step >= 22 ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
                      transition={{ duration: 0.9, ease: "easeOut" }}
                      className="inline-block font-serif italic text-[22px] leading-none text-[#1E3A8A]"
                    >
                      A. Patel, MD
                    </motion.span>
                  </Box>
                  <Box n="32" label="Service facility location" className="col-span-3 border-r"><V at={22} step={step}>Same</V></Box>
                  <Box n="33" label="Billing provider info & ph #" className="col-span-5">
                    <V at={23} step={step}>Prevo Demo Family Practice · (614) 555-0142</V>
                  </Box>
                </div>
              </div>

              <div className="flex justify-between mt-2 text-[8.5px]" style={{ color: INK }}>
                <span>NUCC Instruction Manual available at: www.nucc.org</span>
                <span className="font-semibold">FORM 1500 (02-12)</span>
              </div>

              {/* Stamp */}
              <AnimatePresence>
                {step > LAST && (
                  <motion.div
                    initial={{ opacity: 0, scale: 2.2, rotate: -16 }}
                    animate={{ opacity: 1, scale: 1, rotate: -9 }}
                    transition={{ type: "spring", stiffness: 380, damping: 16 }}
                    className="absolute right-10 top-[38%] rounded-lg border-[5px] border-[#0F766E] px-5 py-3 text-[#0F766E] bg-[#FFFEFB]/80 shadow-[0_0_0_3px_#FFFEFB]"
                  >
                    <p className="font-mono text-[11px] tracking-[0.2em]">PREVO · CHECKED 10/20/26</p>
                    <p className="text-[30px] font-bold tracking-[0.06em] leading-none mt-1">CLEAN CLAIM</p>
                    <p className="font-mono text-[11px] tracking-[0.2em] mt-1">READY FOR 837P</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[11px] text-[#94A3B8]">
            Illustrative, de-identified claim. Teal marks are Prevo's corrections. <span className="lg:hidden">Scroll the form →</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
