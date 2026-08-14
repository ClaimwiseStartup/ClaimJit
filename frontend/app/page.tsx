"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const PAYERS = ["BlueCross", "Medicare", "United", "Aetna"];

const EXAMPLES = [
  {
    id: "pcp",
    label: "Primary care",
    payer: "BlueCross",
    note:
      "Patient is a 45-year-old male presenting with right knee pain. Exam shows moderate effusion. Performed aspiration and injection of the right knee joint with corticosteroid. Also addressed elevated blood pressure during the visit.",
  },
  {
    id: "bh",
    label: "Behavioral health",
    payer: "Medicare",
    note:
      "30-year-old female attended a 50-minute psychotherapy session for recurrent depression and anxiety. Discussed medication adherence, CBT techniques, and safety planning. No acute safety concerns.",
  },
  {
    id: "complex",
    label: "Complex multi-dx",
    payer: "United",
    note:
      "67-year-old male with type 2 diabetes, chronic kidney disease stage 3, and coronary artery disease. Presented with shortness of breath and chest tightness. Performed EKG, troponin labs ordered, started IV aspirin and nitroglycerin, and arranged cardiology consult. Also adjusted insulin dosing for hyperglycemia.",
  },
];

const formatFloat = (value: number) => `${value.toFixed(1)}%`;

export default function Home() {
  const [note, setNote] = useState("");
  const [payer, setPayer] = useState("BlueCross");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [claimDenied, setClaimDenied] = useState(0);
  const [neverReworked, setNeverReworked] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");

  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.45 });

  useEffect(() => {
    if (!statsInView) return;

    let frame: number;
    const start = performance.now();
    const duration = 900;

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      setClaimDenied(parseFloat((11.8 * progress).toFixed(1)));
      setNeverReworked(parseFloat((65 * progress).toFixed(1)));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [statsInView]);

  useEffect(() => {
    if (!result || loading) return;

    const fullText = [
      `CPT Codes: ${result.corrected_claim.cpt_codes.join(", ")}`,
      `ICD-10 Codes: ${result.corrected_claim.icd10_codes.join(", ")}`,
      result.corrected_claim.modifiers.length
        ? `Modifiers: ${result.corrected_claim.modifiers.map((m: string) => `-${m}`).join(", ")}`
        : null,
      `Payer: ${result.corrected_claim.payer}`,
      `Date of Service: ${result.corrected_claim.date_of_service}`,
    ]
      .filter(Boolean)
      .join("\n");

    let index = 0;
    let timeout: number;
    setTypewriterText("");

    const tick = () => {
      setTypewriterText(fullText.slice(0, index));
      index += 2;
      if (index <= fullText.length) {
        timeout = window.setTimeout(tick, 18);
      }
    };

    tick();
    return () => window.clearTimeout(timeout);
  }, [result, loading]);

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

  const analyze = async (overrideNote?: string, overridePayer?: string) => {
    const noteToUse = overrideNote ?? note;
    const payerToUse = overridePayer ?? payer;
    if (!noteToUse.trim()) {
      setValidationError("Please paste a clinical note to generate a claim.");
      return;
    }
    setLoading(true);
    setError("");
    setValidationError("");
    setResult(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const controller = new AbortController();
    const timeoutMs = 18000; // 18 seconds
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(`${apiUrl}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          note: noteToUse,
          payer: payerToUse,
          date_of_service: new Date().toISOString().split("T")[0],
        }),
      });

      if (!res.ok) {
        let errMsg = "Something went wrong generating this claim. Please try again.";
        try {
          const errBody = await res.json();
          if (errBody?.detail) errMsg = errBody.detail;
          else if (errBody?.message) errMsg = errBody.message;
        } catch (e) {
          // ignore JSON parse errors and fall back to generic message
        }
        setError(errMsg);
        return;
      }

      let data: any;
      try {
        data = await res.json();
      } catch (e) {
        setError("Received unexpected response from backend. Please try again.");
        return;
      }

      // Basic validation of expected response shape
      if (!data || !data.corrected_claim || !Array.isArray(data.corrected_claim.cpt_codes) || !Array.isArray(data.corrected_claim.icd10_codes)) {
        setError("Received unexpected response from backend. Please try again.");
        return;
      }

      setResult(data);
    } catch (e: any) {
      if (e && e.name === "AbortError") {
        setError("Request timed out. The backend is taking too long. Please try again.");
      } else {
        setError("Something went wrong generating this claim. Please try again.");
      }
    } finally {
      window.clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const tryExample = (example: any) => {
    setNote(example.note);
    setPayer(example.payer);
    analyze(example.note, example.payer);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F8FAF2] text-[#14221F] font-[family-name:var(--font-sans)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_top,_rgba(31,75,76,0.18),_transparent_45%)]" />

      <header className="relative z-10 flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <a href="/" className="inline-flex items-center" aria-label="Prevo home">
            <img
              src="/prevo_transparent_background_logo.png"
              alt="Prevo"
              className="h-10 w-auto max-w-[220px] object-contain sm:h-11 md:h-12"
            />
          </a>
        </div>
        <span className="inline-flex items-center justify-center rounded-full border border-[rgba(31,75,76,0.2)] bg-white/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F4B4C] shadow-sm backdrop-blur-sm">
          MVP · Internal Use Only
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-6 sm:px-8 lg:px-10">

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
          className="mb-16 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_40px_120px_-50px_rgba(31,75,76,0.25)] backdrop-blur-xl"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#E8F1EE] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#1F4B4C] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#C9873A]" />
                Denial Prevention
              </div>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#14221F] sm:text-5xl">
                Every denied claim is money a small clinic doesn't get back.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-8 text-slate-700 sm:text-lg">
                Most denials come from small, fixable problems: a missing modifier, a non-covered code, a mismatched diagnosis. Prevo catches them before the claim ever leaves the building.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[#1F4B4C]/10 bg-[#F7F6F2] p-4 shadow-sm">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#5F6C68]">Quick focus</p>
              <p className="mt-3 text-lg font-semibold text-[#14221F]">Demo workflow</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#1F4B4C]" />
                  Enter a plain-text clinical note.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#1F4B4C]" />
                  Choose the payer and apply rules automatically.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#1F4B4C]" />
                  See a polished, claim-ready output panel.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div className="rounded-[1.75rem] border border-[#1C2321]/[0.08] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(31,75,76,0.18)]">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#E8F1EE] text-[#1F4B4C]">
                  <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
                    <rect x="5" y="16" width="5" height="11" rx="1.5" fill="currentColor" opacity="0.35" />
                    <rect x="13.5" y="12" width="5" height="15" rx="1.5" fill="currentColor" opacity="0.65" />
                    <rect x="22" y="8" width="5" height="19" rx="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1C2321]/65">First-pass denials</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-[#1C2321]/60">
                    <span className="inline-flex h-2 rounded-full bg-[#1F4B4C]/30 w-10" />
                    <span className="inline-flex h-2 rounded-full bg-[#1F4B4C] w-4" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[26px] font-semibold text-[#1F4B4C]">11.8%</p>
                <p className="mt-3 max-w-xs text-sm leading-7 text-[#1C2321]/70">of claims are denied on first submission, industry-wide</p>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-[#1C2321]/[0.08] bg-white p-5 shadow-[0_16px_40px_-30px_rgba(31,75,76,0.18)]">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-3xl bg-[#FFF3DE] text-[#8A5A24]">
                  <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none" aria-hidden="true">
                    <rect x="5" y="14" width="5" height="13" rx="1.5" fill="currentColor" opacity="0.35" />
                    <rect x="13.5" y="9" width="5" height="18" rx="1.5" fill="currentColor" opacity="0.65" />
                    <rect x="22" y="6" width="5" height="21" rx="1.5" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1C2321]/65">Never reworked</p>
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-[#1C2321]/60">
                    <span className="inline-flex h-2 rounded-full bg-[#8A5A24]/30 w-10" />
                    <span className="inline-flex h-2 rounded-full bg-[#8A5A24] w-6" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-[26px] font-semibold text-[#8A5A24]">65%</p>
                <p className="mt-3 max-w-xs text-sm leading-7 text-[#1C2321]/70">of denied claims are never reworked or resubmitted</p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-[#1C2321]/45 mt-1 mb-10">
            Source: Kodiak Solutions 2024 revenue cycle data; American Medical Association. Industry averages, not Prevo-specific results
          </p>

          <section className="grid gap-6 lg:grid-cols-[minmax(260px,320px)_1fr] mb-10">
            <div className="rounded-[2rem] border border-[#1C2321]/[0.08] bg-[#F7F6F2] p-6 shadow-[0_18px_40px_-30px_rgba(31,75,76,0.12)]">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#5F6C68]">Capture workflow</p>
              <p className="mt-4 text-lg font-semibold text-[#14221F]">From note to claim in one flow</p>
              <p className="mt-3 text-sm leading-7 text-slate-700">
                Paste the clinical note, select the payer, and Prevo generates a payment-ready claim that reflects payer-specific rules.
              </p>
              <div className="mt-6 space-y-3 text-sm text-[#1C2321]/75">
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#1F4B4C]" />
                  <span>Extracts CPT, ICD-10, and modifier guidance from plain text.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#1F4B4C]" />
                  <span>Applies payer-specific policy checks automatically.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-[#1F4B4C]" />
                  <span>Delivers a clean claim-ready summary for easy review.</span>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#1C2321]/[0.08] bg-white p-6 shadow-[0_20px_60px_-36px_rgba(31,75,76,0.16)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#5F6C68]">Claim input</p>
                  <p className="mt-2 text-lg font-semibold text-[#14221F]">Build a clean claim-ready note</p>
                </div>
                {!note && (
                  <button
                    onClick={() => tryExample(EXAMPLES[0])}
                    className="self-start text-[11px] text-[#1F4B4C] font-medium underline decoration-[#1F4B4C]/30 underline-offset-2 hover:decoration-[#1F4B4C] transition-colors"
                  >
                    Try an example
                  </button>
                )}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1fr_200px]">
                <div>
                  <label className="text-[9px] font-bold text-[#1C2321]/75 uppercase tracking-[0.22em] mb-2 block px-3.5">
                    Clinical Note
                  </label>
                  <div className="mb-3 flex gap-2 flex-wrap">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex.id}
                        onClick={() => tryExample(ex)}
                        className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${ex.note === note ? 'bg-[#1F4B4C] text-white border-[#1F4B4C]' : 'bg-white text-[#1C2321] border-[#E6E6E6] hover:bg-[#F3F7F3]'}`}
                      >
                        {ex.label}
                      </button>
                    ))}
                  </div>

                  <textarea
                    className="w-full min-h-[11.5rem] bg-[#FAF8F4] border border-[#1C2321]/[0.12] rounded-2xl p-4 text-sm text-[#1C2321] placeholder-[#1C2321]/35 focus:outline-none focus:border-[#C9873A]/60 focus:ring-2 focus:ring-[#C9873A]/15 resize-none leading-relaxed transition-all"
                    placeholder="Paste the doctor's clinical note here..."
                    value={note}
                    onChange={(e) => { setNote(e.target.value); setValidationError(""); setError(""); }}
                  />

                  {validationError && (
                    <p className="text-xs text-red-700 mt-2">{validationError}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <label className="text-[9px] font-bold text-[#1C2321]/75 uppercase tracking-[0.22em] block px-3.5">
                    Payer
                  </label>
                  <select
                    className="w-full appearance-none bg-[#FAF8F4] border border-[#1C2321]/[0.12] rounded-2xl px-4 py-3 text-sm text-[#1C2321] shadow-sm focus:outline-none focus:border-[#C9873A]/60 focus:ring-2 focus:ring-[#C9873A]/15 transition-all h-[48px]"
                    value={payer}
                    onChange={(e) => setPayer(e.target.value)}
                  >
                    {PAYERS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <div className="flex gap-3">
                    <motion.button
                      onClick={() => analyze()}
                      disabled={loading}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 h-[48px] rounded-2xl text-xs font-medium px-4 transition-all duration-200 bg-[#C9873A] text-white shadow-[0_16px_30px_-18px_rgba(201,135,58,0.45)] hover:bg-[#b5802f] active:scale-[0.98] active:bg-[#9f6d26] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap items-center justify-center inline-flex"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        "Generate Claim"
                      )}
                    </motion.button>

                    <button
                      onClick={() => { setNote(""); setPayer(PAYERS[0]); setResult(null); setError(""); setValidationError(""); setCopied(false); }}
                      disabled={loading}
                      className="w-28 h-[48px] rounded-2xl text-sm font-semibold transition-all duration-200 bg-white text-[#1C2321] border border-[#E6E6E6] shadow-sm hover:bg-[#F8FBF8] disabled:opacity-50"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

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

        {!result && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="border border-dashed border-[#1C2321]/25 rounded-3xl bg-[#FCFDFA] py-20 px-6 flex items-center justify-center mb-8"
          >
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E8F1EE] shadow-sm mb-4">
                <svg viewBox="0 0 32 32" className="h-8 w-8 text-[#1F4B4C]" fill="none" aria-hidden="true">
                  <path d="M10 5h12a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M13 15h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M13 19h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-base font-semibold text-[#14221F] mb-2">Your coded claim will appear here.</p>
              <p className="text-sm text-[#1C2321]/65 mb-5">Enter a clinical note and click Generate Claim to see your claim-ready output instantly.</p>
              <button
                onClick={tryExample}
                className="inline-flex items-center justify-center rounded-2xl border border-[#1F4B4C]/20 bg-white px-5 py-3 text-sm font-semibold text-[#1F4B4C] shadow-sm transition duration-200 hover:border-[#1F4B4C] hover:bg-[#F8FBF8] hover:text-[#173939]"
              >
                See it work with an example note →
              </button>
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="border border-[#1C2321]/10 rounded-2xl py-20 flex items-center justify-center mb-8">
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