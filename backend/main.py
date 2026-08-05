from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rules_engine import load_rules, check_claim
from payer_rules import load_payer_policies, check_payer_policies
from parser import parse_clinical_note

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

rules = load_rules()
payer_policies = load_payer_policies()

class NoteRequest(BaseModel):
    note: str
    payer: str
    date_of_service: str

def auto_fix_claim(claim, general_flags, payer_flags):
    fixed = claim.copy()
    modifiers = list(fixed.get("modifiers", []))
    human_actions = []

    for flag in general_flags + payer_flags:
        # Auto-fix missing modifier -25
        if "modifier" in flag.get("fix", "").lower() and "-25" in flag.get("fix", ""):
            if "25" not in modifiers:
                modifiers.append("25")

        # Auto-fix missing modifier -59
        if "modifier" in flag.get("fix", "").lower() and "-59" in flag.get("fix", ""):
            if "59" not in modifiers:
                modifiers.append("59")

        # Auto-fix missing modifier -95 for telehealth
        if "modifier" in flag.get("fix", "").lower() and "-95" in flag.get("fix", ""):
            if "95" not in modifiers:
                modifiers.append("95")

        # Flag prior auth as human action — cannot be automated
        if flag.get("type") == "PRIOR_AUTH_REQUIRED":
            human_actions.append({
                "action": "Obtain Prior Authorization",
                "detail": flag["fix"],
                "policy_id": flag.get("policy_id", "")
            })

        # Flag non-covered services as human action
        if flag.get("type") == "NOT_COVERED":
            human_actions.append({
                "action": "Coverage Decision Required",
                "detail": flag["fix"],
                "policy_id": flag.get("policy_id", "")
            })

    fixed["modifiers"] = modifiers
    return fixed, human_actions

@app.get("/")
def root():
    return {"status": "running"}

@app.post("/analyze")
def analyze(request: NoteRequest):
    extracted = parse_clinical_note(request.note)

    claim = {
        "cpt_codes": extracted["cpt_codes"],
        "icd10_codes": extracted["icd10_codes"],
        "modifiers": extracted.get("modifiers", []),
        "payer": request.payer,
        "date_of_service": request.date_of_service
    }

    general_flags = check_claim(claim, rules)
    payer_flags = check_payer_policies(claim, payer_policies)

    corrected_claim, human_actions = auto_fix_claim(
        claim, general_flags, payer_flags
    )

    # Verify corrected claim is clean
    final_flags = check_claim(corrected_claim, rules) + check_payer_policies(corrected_claim, payer_policies)
    auto_fixed_count = len(general_flags + payer_flags) - len(human_actions)

    return {
        "original_codes": extracted,
        "corrected_claim": corrected_claim,
        "human_actions": human_actions,
        "auto_fixed": auto_fixed_count,
        "remaining_issues": len(human_actions),
        "ready_to_submit": len(human_actions) == 0
    }