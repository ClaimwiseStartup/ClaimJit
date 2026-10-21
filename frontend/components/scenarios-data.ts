// De-identified, realistic outpatient encounters used across the product showcase.
export type HLKey = "a" | "b" | "c";
export type Seg = { t: string; h?: HLKey };
export type Line = { code: string; mod?: string; dx: string; desc: string; h?: HLKey };

export type Scenario = {
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

export const HL: Record<HLKey, { mark: string; dot: string }> = {
  a: { mark: "bg-[#0F766E]/[0.13] decoration-[#0F766E]", dot: "bg-[#0F766E]" },
  b: { mark: "bg-[#1E293B]/[0.08] decoration-[#1E293B]", dot: "bg-[#1E293B]" },
  c: { mark: "bg-[#B45309]/[0.10] decoration-[#B45309]", dot: "bg-[#B45309]" },
};

export const SCENARIOS: Scenario[] = [
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
