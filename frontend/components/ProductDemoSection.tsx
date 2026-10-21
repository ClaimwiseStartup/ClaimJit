"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const ease = [0.22, 1, 0.36, 1] as const;

// Must match the payer names the backend expects
const PAYERS = ["BlueCross", "Medicare", "United", "Aetna"];

const EXAMPLE_NOTE =
  "Patient is a 45-year-old male presenting with right knee pain. Examination shows moderate effusion. Performed aspiration and injection of the right knee joint with corticosteroid. Also addressed elevated blood pressure during the visit.";

type HumanAction = { action: string; detail: string };
type AnalyzeResult = {
  corrected_claim?: {
    cpt_codes: string[];
    icd10_codes: string[];
    modifiers: string[];
    payer: string;
    date_of_service: string;
  };
  original_codes?: { reasoning?: string };
  human_actions?: HumanAction[];
  ready_to_submit?: boolean;
  auto_fixed?: number;
  remaining_issues?: number;
};

function CodeChips({ label, codes, accent }: { label: string; codes: string[]; accent: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {codes.map((c, i) => (
          <motion.span
            key={c + i}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.06 }}
            className={`font-mono text-sm font-semibold rounded-lg px-3 py-1.5 bg-white/[0.06] border border-white/10 ${accent}`}
          >
            {c}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

export default function ProductDemoSection() {
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("BlueCross");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeResult | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const analyze = async (override?: string) => {
    const text = override ?? note;
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note: text,
          payer,
          date_of_service: new Date().toISOString().split("T")[0],
        }),
      });
      if (!res.ok) throw new Error(`The analyzer returned an error (${res.status}).`);
      setResult(await res.json());
    } catch (e) {
      setError(
        e instanceof TypeError
          ? "Couldn't reach the analyzer. Make sure the backend is running."
          : e instanceof Error
          ? e.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  const tryExample = () => {
    setNote(EXAMPLE_NOTE);
    analyze(EXAMPLE_NOTE);
  };

  const copyClaim = () => {
    const c = result?.corrected_claim;
    if (!c) return;
    const text = [
      `CPT Codes: ${c.cpt_codes.join(", ")}`,
      `ICD-10 Codes: ${c.icd10_codes.join(", ")}`,
      c.modifiers.length ? `Modifiers: ${c.modifiers.map((m) => `-${m}`).join(", ")}` : null,
      `Payer: ${c.payer}`,
      `Date of Service: ${c.date_of_service}`,
    ]
      .filter(Boolean)
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const claim = result?.corrected_claim;
  const actions = result?.human_actions ?? [];
  const ready = !!result?.ready_to_submit;

  return (
    <section id="demo" className="relative py-24 sm:py-32 bg-[#0B1220] overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#0F766E]/10 blur-[120px]" />

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease }}
          className="text-center mb-12"
        >
          <span className="text-[#5EEAD4] text-xs font-semibold uppercase tracking-[0.2em]">Live demo</span>
          <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-white mt-4">Run a note through Prevo.</h2>
          <p className="text-white/55 mt-4 max-w-xl mx-auto">
            Paste a de-identified clinical note, pick the payer, and get the corrected claim back with
            everything a human still needs to sign off on.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm overflow-hidden shadow-[0_40px_100px_-30px_rgba(0,0,0,0.6)]"
        >
          {/* Window chrome */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
              <span className="w-3 h-3 rounded-full bg-white/15" />
            </div>
            <span className="flex-1 text-center font-mono text-[10.5px] tracking-[0.08em] text-white/45">PREVO · CLAIM REVIEW WORKSTATION</span>
          </div>

          <div className="grid lg:grid-cols-2">
            {/* Input */}
            <div className="p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-white/[0.06] space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="demo-note" className="text-white/60 text-sm font-medium">Clinical note</label>
                  <button onClick={tryExample} className="text-[#5EEAD4]/80 text-xs hover:text-[#5EEAD4] transition-colors cursor-pointer">
                    Try the knee injection example →
                  </button>
                </div>
                <textarea
                  id="demo-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="S: … O: … A/P: …"
                  rows={11}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#0F766E]/50 resize-none font-mono leading-relaxed"
                />
                <p className="mt-2 text-[11px] text-white/30">Demo only. Don't paste real patient identifiers.</p>
              </div>

              <div>
                <p className="text-white/60 text-sm font-medium mb-2">Payer</p>
                <div className="grid grid-cols-4 gap-2">
                  {PAYERS.map((p) => (
                    <button
                      key={p}
                      onClick={() => setPayer(p)}
                      className={`py-2.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                        payer === p
                          ? "bg-[#0F766E]/20 border-[#0F766E]/50 text-white"
                          : "border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => analyze()}
                disabled={loading || !note.trim()}
                className="w-full py-4 rounded-xl bg-[#0F766E] text-white font-semibold text-sm hover:bg-[#115E59] transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? "Coding the claim and applying payer rules…" : "Analyze claim"}
              </button>
            </div>

            {/* Output */}
            <div className="p-6 sm:p-8 min-h-[420px]">
              <AnimatePresence mode="wait">
                {error ? (
                  <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
                    {error}
                  </motion.div>
                ) : loading ? (
                  <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                    {["Reading documentation", "Assigning ICD-10-CM and CPT", "Checking NCCI edits and modifiers", `Applying ${payer} policy`].map((s, i) => (
                      <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.35 }}
                        className="flex items-center gap-3 text-sm text-white/60">
                        <motion.span className="w-2 h-2 rounded-full bg-[#0F766E]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                        {s}
                      </motion.div>
                    ))}
                  </motion.div>
                ) : result && claim ? (
                  <motion.div key="res" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                    <div className={`flex flex-wrap items-center gap-3 rounded-xl px-4 py-3 border ${ready ? "bg-[#0F766E]/15 border-[#0F766E]/30" : "bg-[#B45309]/15 border-[#F59E0B]/30"}`}>
                      <span className={`text-sm font-semibold ${ready ? "text-[#99F6E4]" : "text-[#FCD34D]"}`}>
                        {ready ? "✓ Cleared for submission" : "At risk of denial"}
                      </span>
                      <span className="text-xs text-white/50">
                        {ready
                          ? "No human action needed"
                          : `${result.remaining_issues ?? actions.length} item${(result.remaining_issues ?? actions.length) === 1 ? "" : "s"} to resolve first`}
                      </span>
                      {!!result.auto_fixed && (
                        <span className="ml-auto font-mono text-[11px] text-white/50">{result.auto_fixed} auto-corrected</span>
                      )}
                    </div>

                    <CodeChips label="CPT / HCPCS" codes={claim.cpt_codes} accent="text-[#5EEAD4]" />
                    <CodeChips label="ICD-10-CM" codes={claim.icd10_codes} accent="text-[#CBD5E1]" />
                    {claim.modifiers.length > 0 && (
                      <CodeChips label="Modifiers" codes={claim.modifiers.map((m) => `-${m}`)} accent="text-[#99F6E4]" />
                    )}

                    <div className="flex items-center justify-between font-mono text-[11px] text-white/40">
                      <span>PAYER <span className="text-white/70 ml-1">{claim.payer}</span></span>
                      <span>DOS <span className="text-white/70 ml-1">{claim.date_of_service}</span></span>
                      <button onClick={copyClaim} className="text-[#5EEAD4]/80 hover:text-[#5EEAD4] cursor-pointer">
                        {copied ? "Copied ✓" : "Copy claim"}
                      </button>
                    </div>

                    {result.original_codes?.reasoning && (
                      <div className="rounded-xl bg-black/20 border border-white/[0.06] p-4">
                        <p className="text-[10px] uppercase tracking-[0.14em] text-white/40 mb-2">Coding rationale</p>
                        <p className="text-[13px] text-white/65 leading-relaxed">{result.original_codes.reasoning}</p>
                      </div>
                    )}

                    {actions.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.14em] text-[#FCD34D] mb-2">Required before submission</p>
                        <div className="space-y-2">
                          {actions.map((a, i) => (
                            <div key={i} className="rounded-lg border border-white/10 border-l-[3px] border-l-[#F59E0B] bg-[#B45309]/[0.08] p-3.5">
                              <p className="text-sm text-white/90 font-medium">{a.action}</p>
                              <p className="text-[12.5px] text-white/55 mt-1 leading-relaxed">{a.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ) : result ? (
                  <motion.div key="odd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/50">
                    The analyzer responded, but without a corrected claim. Try a more detailed note.
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4 font-mono text-[#5EEAD4]/70 text-sm">
                      Rx
                    </div>
                    <p className="text-white/35 text-sm max-w-[260px]">The corrected claim, codes and sign-off items show up here.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
