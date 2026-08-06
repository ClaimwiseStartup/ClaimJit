"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAYERS = ["BlueCross", "Medicare", "United", "Aetna"];

const EXAMPLE_NOTE =
  "Patient is a 45-year-old male presenting with right knee pain. Examination shows moderate effusion. Performed aspiration and injection of the right knee joint with corticosteroid. Also addressed elevated blood pressure during the visit.";

export default function Home() {
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("BlueCross");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyClaim = () => {
    if (!result?.corrected_claim) return;
    const c = result.corrected_claim;
    const text = [
      `CPT Codes: ${c.cpt_codes.join(", ")}`,
      `ICD-10 Codes: ${c.icd10_codes.join(", ")}`,
      c.modifiers.length ? `Modifiers: ${c.modifiers.map((m: string) => `-${m}`).join(", ")}` : null,
      `Payer: ${c.payer}`,
      `Date of Service: ${c.date_of_service}`,
    ].filter(Boolean).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analyze = async (overrideNote?: string) => {
    const noteToUse = overrideNote ?? note;
    if (!noteToUse.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: noteToUse,
          payer,
          date_of_service: new Date().toISOString().split("T")[0],
        }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setError("Could not connect to backend. Make sure it is running.");
    } finally {
      setLoading(false);
    }
  };

  const tryExample = () => {
    setNote(EXAMPLE_NOTE);
    analyze(EXAMPLE_NOTE);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] text-[#1C2321] font-[family-name:var(--font-sans)]">

      <header className="flex items-center justify-between px-8 py-5 border-b border-[#1C2321]/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#1F4B4C] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-[3px] bg-[#C9873A]" />
          </div>
          <span className="text-[15px] font-semibold tracking-tight font-[family-name:var(--font-serif)]">ClaimWise</span>
        </div>
        <span className="text-[10px] text-[#1C2321]/65 border border-[#1C2321]/12 rounded-full px-3 py-1 font-[family-name:var(--font-mono)] tracking-wider">
          MVP · INTERNAL USE ONLY
        </span>
      </header>

      <main className="max-w-6xl mx-auto px-8 pt-14 pb-24">

        {/* Hero with sourced stats, not invented ones */}
        <div className="mb-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-[#C9873A]" />
            <span className="text-[11px] font-[family-name:var(--font-mono)] text-[#8A5A24] tracking-widest uppercase">
              Denial Prevention
            </span>
          </div>
          <h1 className="text-[34px] leading-[1.2] font-semibold tracking-tight mb-3 font-[family-name:var(--font-serif)] text-[#1C2321]">
            Every denied claim is money a small clinic doesn't get back.
          </h1>
          <p className="text-[14.5px] text-[#1C2321]/70 leading-relaxed mb-5">
            Most denials come from small, fixable problems: a missing modifier, a non-covered code, a mismatched diagnosis. ClaimWise catches them before the claim ever leaves the building.
          </p>

          {/* Sourced stat strip */}
          <div className="flex items-stretch gap-4 mb-5 p-4 bg-[#1F4B4C]/[0.04] border border-[#1F4B4C]/10 rounded-xl">
            <div className="flex-1">
              <p className="text-[22px] font-semibold font-[family-name:var(--font-serif)] text-[#1F4B4C]">11.8%</p>
              <p className="text-[11px] text-[#1C2321]/50 leading-snug">of claims are denied on first submission, industry-wide</p>
            </div>
            <div className="w-px bg-[#1C2321]/10" />
            <div className="flex-1">
              <p className="text-[22px] font-semibold font-[family-name:var(--font-serif)] text-[#8A5A24]">65%</p>
              <p className="text-[11px] text-[#1C2321]/50 leading-snug">of denied claims are never reworked or resubmitted</p>
            </div>
          </div>
          <p className="text-[10px] text-[#1C2321]/55 font-[family-name:var(--font-mono)] -mt-3 mb-5">
            Source: Kodiak Solutions 2024 revenue cycle data; American Medical Association. Industry averages, not ClaimWise-specific results
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 text-[12px] text-[#1C2321]/70 font-[family-name:var(--font-mono)]">
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#1F4B4C]" />
              <span>Codes the claim from a plain-text note</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#1F4B4C]" />
              <span>Applies payer-specific rules automatically</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-[#1F4B4C]" />
              <span>Flags what still needs a human call</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#1C2321]/[0.08] rounded-2xl p-5 mb-8 shadow-[0_8px_30px_-15px_rgba(28,35,33,0.15)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-4 items-end">
            <div>
              <div className="flex items-center justify-between mb-2 px-3.5">
                <label className="text-[10px] font-semibold text-[#1C2321]/65 uppercase tracking-[0.12em]">
                  Clinical Note
                </label>
                {!note && (
                  <button
                    onClick={tryExample}
                    className="text-[11px] text-[#1F4B4C] font-medium underline decoration-[#1F4B4C]/30 underline-offset-2 hover:decoration-[#1F4B4C] transition-colors"
                  >
                    Try an example
                  </button>
                )}
              </div>
              <textarea
                className="w-full h-28 bg-[#FAF8F4] border border-[#1C2321]/[0.08] rounded-xl p-3.5 text-sm text-[#1C2321] placeholder-[#1C2321]/30 focus:outline-none focus:border-[#1F4B4C]/40 focus:ring-2 focus:ring-[#1F4B4C]/8 resize-none leading-relaxed transition-all"
                placeholder="Paste the doctor's clinical note here..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-[#1C2321]/65 uppercase tracking-[0.12em] mb-2 block px-3.5">
                Payer
              </label>
              <select
                className="w-full bg-[#FAF8F4] border border-[#1C2321]/[0.08] rounded-xl px-3.5 py-2.5 text-sm text-[#1C2321] focus:outline-none focus:border-[#1F4B4C]/40 transition-all h-[46px]"
                value={payer}
                onChange={(e) => setPayer(e.target.value)}
              >
                {PAYERS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <motion.button
              onClick={() => analyze()}
              disabled={loading || !note.trim()}
              whileTap={{ scale: 0.97 }}
              className="h-[46px] px-6 rounded-xl text-sm font-semibold transition-colors bg-[#1F4B4C] hover:bg-[#173939] text-white disabled:bg-[#1C2321]/10 disabled:text-[#1C2321]/55 whitespace-nowrap"
            >
              {loading ? "Analyzing..." : "Generate Claim"}
            </motion.button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-red-700 border border-red-200 bg-red-50 rounded-lg p-3 mt-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {!result && !loading && (
          <div className="border border-dashed border-[#1C2321]/15 rounded-2xl py-20 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 rounded-xl bg-[#1F4B4C]/5 border border-[#1F4B4C]/10 flex items-center justify-center mx-auto mb-4">
                <div className="w-4 h-4 rounded bg-[#C9873A]/50" />
              </div>
              <p className="text-sm text-[#1C2321]/60 mb-3">Your coded claim will appear here.</p>
              <button
                onClick={tryExample}
                className="text-[13px] text-[#1F4B4C] font-medium underline decoration-[#1F4B4C]/30 underline-offset-2 hover:decoration-[#1F4B4C] transition-colors"
              >
                See it work with an example note →
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="border border-[#1C2321]/10 rounded-2xl py-20 flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-[#1F4B4C] border-t-transparent rounded-full mx-auto mb-4"
              />
              <p className="text-sm text-[#1C2321]/50">Coding the claim and applying payer rules...</p>
            </div>
          </div>
        )}

        {result && !loading && result.corrected_claim && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-5"
          >

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.05 }}
              className={`flex items-center justify-between rounded-2xl px-6 py-4 border ${
                result.ready_to_submit
                  ? "bg-[#7A9B76]/10 border-[#7A9B76]/30"
                  : "bg-[#C9873A]/10 border-[#C9873A]/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-md font-[family-name:var(--font-mono)] ${
                    result.ready_to_submit
                      ? "bg-[#5C8558] text-white"
                      : "bg-[#C9873A] text-white"
                  }`}
                >
                  {result.ready_to_submit ? "Cleared" : "At risk"}
                </span>
                <span className="text-[15px] font-semibold text-[#1C2321]">
                  {result.ready_to_submit
                    ? "Claim ready for submission"
                    : `Needs ${result.remaining_issues} human action${result.remaining_issues > 1 ? "s" : ""} before submission`}
                </span>
              </div>
              {result.auto_fixed > 0 && (
                <span className="text-xs text-[#1C2321]/70 font-[family-name:var(--font-mono)]">
                  {result.auto_fixed} issue{result.auto_fixed > 1 ? "s" : ""} auto-corrected
                </span>
              )}
            </motion.div>

            {!result.ready_to_submit && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.08 }}
                className="text-[13px] text-[#8A5A24]/80 -mt-2 px-1"
              >
                Submitting this claim as-is would likely trigger a denial. Resolve the items below first.
              </motion.p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-2 bg-white border border-[#1C2321]/[0.08] rounded-2xl p-6 shadow-[0_8px_30px_-15px_rgba(28,35,33,0.1)]"
              >
                <div className="flex items-center justify-between mb-5">
                  <p className="text-[10px] font-semibold text-[#8A5A24] uppercase tracking-[0.14em]">
                    Corrected Claim
                  </p>
                  <button
                    onClick={copyClaim}
                    className="text-[11px] font-medium text-[#1F4B4C] hover:text-[#173939] transition-colors"
                  >
                    {copied ? "Copied" : "Copy claim"}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-5">
                  <div>
                    <p className="text-[10px] text-[#1C2321]/65 uppercase tracking-wider mb-2.5">CPT Codes (Procedures)</p>
                    <div className="flex flex-wrap gap-2">
                      {result.corrected_claim.cpt_codes.map((code: string, i: number) => (
                        <motion.span
                          key={code}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.06 }}
                          className="text-[13px] font-[family-name:var(--font-mono)] px-3 py-1.5 rounded-lg bg-[#1F4B4C]/8 border border-[#1F4B4C]/20 text-[#1F4B4C]"
                        >
                          {code}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#1C2321]/65 uppercase tracking-wider mb-2.5">ICD-10 Codes (Diagnoses)</p>
                    <div className="flex flex-wrap gap-2">
                      {result.corrected_claim.icd10_codes.map((code: string, i: number) => (
                        <motion.span
                          key={code}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + i * 0.06 }}
                          className="text-[13px] font-[family-name:var(--font-mono)] px-3 py-1.5 rounded-lg bg-[#8A5A24]/8 border border-[#8A5A24]/20 text-[#8A5A24]"
                        >
                          {code}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {result.corrected_claim.modifiers.length > 0 && (
                  <div className="pt-5 border-t border-[#1C2321]/[0.07] mb-5">
                    <div className="flex items-center justify-between mb-2.5">
                      <p className="text-[10px] text-[#1C2321]/65 uppercase tracking-wider">Modifiers Applied</p>
                      <span className="text-[10px] font-[family-name:var(--font-mono)] text-[#5C8558] bg-[#5C8558]/10 px-2 py-0.5 rounded">
                        Staged
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {result.corrected_claim.modifiers.map((mod: string, i: number) => (
                        <motion.span
                          key={mod}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.35 + i * 0.08 }}
                          className="text-[13px] font-[family-name:var(--font-mono)] px-3 py-1.5 rounded-lg bg-[#5C8558]/8 border border-[#5C8558]/25 text-[#4C7048]"
                        >
                          -{mod}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-5 border-t border-[#1C2321]/[0.07] grid grid-cols-2 gap-3 text-[11px] text-[#1C2321]/65 font-[family-name:var(--font-mono)]">
                  <div>PAYER <span className="text-[#1C2321]/65 ml-1">{result.corrected_claim.payer}</span></div>
                  <div>DATE <span className="text-[#1C2321]/65 ml-1">{result.corrected_claim.date_of_service}</span></div>
                </div>
              </motion.div>

              {result.original_codes.reasoning && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="bg-white border border-[#1C2321]/[0.08] rounded-2xl p-5 shadow-[0_8px_30px_-15px_rgba(28,35,33,0.1)]"
                >
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="w-3.5 h-3.5 rounded-sm border border-[#8A5A24]/40 flex items-center justify-center">
                      <div className="w-1 h-1 rounded-full bg-[#8A5A24]" />
                    </div>
                    <p className="text-[10px] font-semibold text-[#8A5A24] uppercase tracking-[0.14em]">
                      Coding Evidence
                    </p>
                  </div>
                  <p className="text-[13px] text-[#1C2321]/55 leading-relaxed border-l-2 border-[#8A5A24]/20 pl-3">
                    {result.original_codes.reasoning}
                  </p>
                  <p className="text-[10px] text-[#1C2321]/55 font-[family-name:var(--font-mono)] mt-3">
                    Source: submitted clinical note
                  </p>
                </motion.div>
              )}
            </div>

            {result.human_actions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-[#C9873A]/25 rounded-2xl p-6 shadow-[0_8px_30px_-15px_rgba(28,35,33,0.1)]"
              >
                <p className="text-[10px] font-semibold text-[#8A5A24] uppercase tracking-[0.14em] mb-4">
                  Required Before Submission
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.human_actions.map((action: any, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.06 }}
                      className="rounded-xl border border-[#1C2321]/[0.07] bg-[#FAF8F4] p-4"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-sm font-medium text-[#1C2321]">{action.action}</p>
                        <span className="text-[9px] font-[family-name:var(--font-mono)] text-[#C9873A] bg-[#C9873A]/10 px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ml-2">
                          Awaiting sign-off
                        </span>
                      </div>
                      <p className="text-[13px] text-[#1C2321]/55 leading-relaxed">{action.detail}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        )}
      </main>
    </div>
  );
}