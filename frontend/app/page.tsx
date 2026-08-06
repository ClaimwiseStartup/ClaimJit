"use client";
import { useState } from "react";

const PAYERS = ["BlueCross", "Medicare", "United", "Aetna"];

export default function Home() {
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("BlueCross");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!note.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          note,
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

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">

      {/* Nav */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-[#C9A84C]" />
          <span className="text-sm font-semibold tracking-wide">ClaimGuard</span>
        </div>
        <span className="text-[11px] text-white/30 border border-white/10 rounded-full px-3 py-1">
          MVP · Internal Use Only
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel */}
        <div className="w-[420px] shrink-0 border-r border-white/5 flex flex-col p-6 gap-5">
          <div>
            <h1 className="text-lg font-semibold text-white">Claim Analyzer</h1>
            <p className="text-xs text-white/40 mt-1">
              Paste a clinical note. The AI codes the claim, applies corrections, and flags anything requiring human action.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Clinical Note</label>
            <textarea
              className="w-full h-64 bg-[#111111] border border-white/8 rounded-lg p-3.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 resize-none leading-relaxed transition"
              placeholder="Paste the doctor's clinical note here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Insurance Payer</label>
            <select
              className="w-full bg-[#111111] border border-white/8 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#C9A84C]/50 transition"
              value={payer}
              onChange={(e) => setPayer(e.target.value)}
            >
              {PAYERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <button
            onClick={analyze}
            disabled={loading || !note.trim()}
            className="w-full py-2.5 rounded-lg text-sm font-semibold transition bg-[#C9A84C] hover:bg-[#b89640] text-black disabled:bg-white/5 disabled:text-white/20"
          >
            {loading ? "Analyzing..." : "Generate Clean Claim"}
          </button>

          {error && (
            <p className="text-xs text-red-400 border border-red-900/50 bg-red-950/20 rounded-lg p-3">
              {error}
            </p>
          )}
        </div>

        {/* Right Panel */}
        <div className="flex-1 overflow-y-auto p-6">

          {!result && !loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <div className="w-5 h-5 rounded bg-[#C9A84C]/30" />
                </div>
                <p className="text-sm text-white/30">AI-coded claim will appear here.</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm text-white/40">Coding the claim and applying payer rules...</p>
              </div>
            </div>
          )}

          {result && !loading && result.corrected_claim && (
            <div className="space-y-4 max-w-2xl">

              {/* Status */}
              <div className={`flex items-center justify-between rounded-lg px-5 py-3.5 border ${
                result.ready_to_submit
                  ? "bg-green-950/20 border-green-800/40"
                  : "bg-yellow-950/20 border-yellow-800/40"
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${result.ready_to_submit ? "bg-green-500" : "bg-yellow-500"}`} />
                  <span className="text-sm font-semibold">
                    {result.ready_to_submit
                      ? "Claim Ready for Submission"
                      : `Needs ${result.remaining_issues} Human Action${result.remaining_issues > 1 ? "s" : ""} Before Submission`}
                  </span>
                </div>
                {result.auto_fixed > 0 && (
                  <span className="text-xs text-white/30">
                    {result.auto_fixed} issue{result.auto_fixed > 1 ? "s" : ""} auto-corrected
                  </span>
                )}
              </div>

              {/* Corrected Claim */}
              <div className="bg-[#111111] border border-white/5 rounded-xl p-5">
                <p className="text-[11px] font-semibold text-[#C9A84C] uppercase tracking-widest mb-4">
                  Corrected Claim — Ready to Submit
                </p>
                <div className="grid grid-cols-2 gap-5 mb-4">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">CPT — Procedures</p>
                    <div className="flex flex-wrap gap-2">
                      {result.corrected_claim.cpt_codes.map((code: string) => (
                        <span key={code} className="text-xs font-mono px-2.5 py-1 rounded-md bg-blue-950/40 border border-blue-800/40 text-blue-300">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">ICD-10 — Diagnoses</p>
                    <div className="flex flex-wrap gap-2">
                      {result.corrected_claim.icd10_codes.map((code: string) => (
                        <span key={code} className="text-xs font-mono px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-800/40 text-purple-300">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {result.corrected_claim.modifiers.length > 0 && (
                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Modifiers Applied</p>
                    <div className="flex flex-wrap gap-2">
                      {result.corrected_claim.modifiers.map((mod: string) => (
                        <span key={mod} className="text-xs font-mono px-2.5 py-1 rounded-md bg-green-950/40 border border-green-800/40 text-green-300">
                          -{mod}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-white/5 mt-4 grid grid-cols-2 gap-3 text-xs text-white/30">
                  <div>Payer: <span className="text-white/50">{result.corrected_claim.payer}</span></div>
                  <div>Date: <span className="text-white/50">{result.corrected_claim.date_of_service}</span></div>
                </div>
              </div>

              {/* Reasoning */}
              {result.original_codes.reasoning && (
                <div className="bg-[#111111] border border-white/5 rounded-xl p-5">
                  <p className="text-[11px] font-semibold text-[#C9A84C] uppercase tracking-widest mb-3">
                    Coding Rationale
                  </p>
                  <p className="text-xs text-white/40 leading-relaxed">
                    {result.original_codes.reasoning}
                  </p>
                </div>
              )}

              {/* Human Actions */}
              {result.human_actions.length > 0 && (
                <div className="bg-[#111111] border border-yellow-800/30 rounded-xl p-5">
                  <p className="text-[11px] font-semibold text-yellow-500 uppercase tracking-widest mb-4">
                    Required Before Submission
                  </p>
                  <div className="space-y-3">
                    {result.human_actions.map((action: any, i: number) => (
                      <div key={i} className="rounded-lg border border-white/5 bg-[#0d0d0d] p-4">
                        <p className="text-sm font-medium text-white mb-1">{action.action}</p>
                        <p className="text-xs text-white/40 leading-relaxed">{action.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}