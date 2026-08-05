import json
from rules_engine import load_rules, check_claim, print_report
from parser import parse_clinical_note
from payer_rules import load_payer_policies, check_payer_policies

payer_policies = load_payer_policies()

rules = load_rules()

# Test claim 1 - missing modifier -25 (should flag)
claim1 = {
    "cpt_codes": ["99213", "20610"],
    "icd10_codes": ["M79.3"],
    "modifiers": [],
    "payer": "BlueCross",
    "date_of_service": "2026-08-01"
}

# Test claim 2 - clean claim (should pass)
claim2 = {
    "cpt_codes": ["99213", "20610"],
    "icd10_codes": ["M79.3"],
    "modifiers": ["25"],
    "payer": "BlueCross",
    "date_of_service": "2026-08-01"
}

# Test claim 3 - Medicare non-covered service (should flag)
claim3 = {
    "cpt_codes": ["99211"],
    "icd10_codes": ["Z00.00"],
    "modifiers": [],
    "payer": "Medicare",
    "date_of_service": "2026-08-01"
}

for claim in [claim1, claim2, claim3]:
    flags = check_claim(claim, rules)
    print_report(claim, flags)
    
from parser import parse_clinical_note

# Test with a fake doctor note
note = """
Patient is a 45-year-old male presenting with right knee pain.
Examination shows moderate effusion. Performed aspiration and 
injection of the right knee joint with corticosteroid.
Also addressed elevated blood pressure during the visit.
"""

print("\n" + "="*60)
print("CLINICAL NOTE PARSER TEST")
print("="*60)
print("Input note:", note)

extracted = parse_clinical_note(note)
print("Extracted codes:", json.dumps(extracted, indent=2))

flags = check_claim({
    "cpt_codes": extracted["cpt_codes"],
    "icd10_codes": extracted["icd10_codes"],
    "modifiers": extracted["modifiers"],
    "payer": "BlueCross",
    "date_of_service": "2026-08-01"
}, rules)

payer_flags = check_payer_policies({
    "cpt_codes": extracted["cpt_codes"],
    "icd10_codes": extracted["icd10_codes"],
    "modifiers": extracted["modifiers"],
    "payer": "BlueCross",
    "date_of_service": "2026-08-01"
}, payer_policies)

all_flags = flags + payer_flags
print(f"\nTotal issues found (general + payer-specific): {len(all_flags)}")
for f in payer_flags:
    print(f"  [{f['type']}] {f['policy_id']}: {f['issue']}")
    print(f"  Fix: {f['fix']}\n")

print_report({
    "cpt_codes": extracted["cpt_codes"],
    "icd10_codes": extracted["icd10_codes"],
    "modifiers": extracted["modifiers"],
    "payer": "BlueCross",
    "date_of_service": "2026-08-01"
}, flags)