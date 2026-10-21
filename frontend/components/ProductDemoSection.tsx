"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

const payers = [
  "Medicare",
  "Medicaid",
  "Blue Cross Blue Shield",
  "Aetna",
  "UnitedHealthcare",
  "Cigna",
  "Humana",
  "Other",
];

const sampleNote = `Patient is a 58-year-old male presenting with chest pain radiating to the left arm for 2 hours. History of hypertension and type 2 diabetes. ECG shows ST-segment changes. Troponin elevated at 0.8 ng/mL. Started on aspirin, heparin drip, and nitroglycerin. Cardiology consulted for emergent catheterization.`;

interface AnalysisResult {
  corrected_codes: Array<{
    code: string;
    description: string;
    original_code: string | null;
    correction_reason: string | null;
  }>;
  coding_evidence: Array<{
    evidence: string;
    source_text: string;
    supporting_codes: string[];
  }>;
  human_actions_required: string[];
}

export default function ProductDemoSection() {
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("Medicare");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleAnalyze = async () => {
    if (!note.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinical_note: note, payer }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Failed to analyze. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="demo"
      className="relative py-24 sm:py-32 bg-[#0f2e2f] overflow-hidden"
      ref={ref}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#C9873A] text-sm font-semibold uppercase tracking-widest">
            Live Demo
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mt-3">
            Try It Right Now
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Paste a clinical note below and see how Prevo analyzes and optimizes
            your claim in real-time.
          </p>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Toolbar */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-white/5 bg-white/[0.02]">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
              <div className="w-3 h-3 rounded-full bg-green-400/60" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-white/30 text-xs font-mono">
                prevo.ai/analyzer
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input side */}
              <div className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm mb-2 font-medium">
                    Clinical Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Paste your clinical documentation here..."
                    rows={10}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9873A]/50 focus:ring-1 focus:ring-[#C9873A]/20 resize-none transition-all font-mono"
                  />
                  <button
                    onClick={() => setNote(sampleNote)}
                    className="mt-2 text-[#C9873A]/70 text-xs hover:text-[#C9873A] transition-colors cursor-pointer"
                  >
                    &#8594; Load sample note
                  </button>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2 font-medium">
                    Payer
                  </label>
                  <select
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/90 text-sm focus:outline-none focus:border-[#C9873A]/50 transition-all appearance-none cursor-pointer"
                  >
                    {payers.map((p) => (
                      <option key={p} value={p} className="bg-[#1F4B4C] text-white">
                        {p}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  onClick={handleAnalyze}
                  disabled={loading || !note.trim()}
                  className="w-full py-4 rounded-xl bg-[#C9873A] text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#b5772e] transition-all relative overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="w-4 h-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                          className="opacity-20"
                        />
                        <path
                          d="M12 2a10 10 0 019.95 9"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    "Analyze Claim"
                  )}
                </motion.button>
              </div>

              {/* Output side */}
              <div className="min-h-[300px]">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm"
                    >
                      {error}
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      {/* Corrected Codes */}
                      <div>
                        <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#5C8558]" />
                          Corrected Claim Codes
                        </h4>
                        <div className="space-y-2">
                          {result.corrected_codes.map((code, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-lg bg-white/5 border border-white/5"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <span className="font-mono text-[#C9873A] text-sm font-semibold">
                                  {code.code}
                                </span>
                                {code.original_code && (
                                  <span className="text-xs text-white/30 line-through font-mono">
                                    {code.original_code}
                                  </span>
                                )}
                              </div>
                              <p className="text-white/50 text-xs mt-1">
                                {code.description}
                              </p>
                              {code.correction_reason && (
                                <p className="text-[#C9873A]/70 text-xs mt-1 italic">
                                  {code.correction_reason}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Evidence */}
                      {result.coding_evidence?.length > 0 && (
                        <div>
                          <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#C9873A]" />
                            Coding Evidence
                          </h4>
                          <div className="space-y-2">
                            {result.coding_evidence.map((ev, i) => (
                              <div
                                key={i}
                                className="p-3 rounded-lg bg-white/5 border border-white/5"
                              >
                                <p className="text-white/60 text-xs">
                                  {ev.evidence}
                                </p>
                                <p className="text-white/30 text-xs mt-1 font-mono">
                                  &ldquo;{ev.source_text}&rdquo;
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Human Actions */}
                      {result.human_actions_required?.length > 0 && (
                        <div>
                          <h4 className="text-white/80 text-sm font-semibold mb-3 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-yellow-400" />
                            Actions Required
                          </h4>
                          <ul className="space-y-1.5">
                            {result.human_actions_required.map((action, i) => (
                              <li
                                key={i}
                                className="text-white/50 text-xs flex items-start gap-2"
                              >
                                <span className="text-yellow-400 mt-0.5">
                                  &#9679;
                                </span>
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center py-16"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        >
                          <path d="M9 12l2 2 4-4" />
                          <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-white/30 text-sm">
                        Paste a clinical note and click Analyze
                        <br />
                        to see results here.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
