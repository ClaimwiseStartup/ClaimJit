import json

def load_rules(path="data/denial_rules.json"):
    with open(path, "r") as f:
        return json.load(f)["rules"]

def check_claim(claim, rules):
    """
    claim = {
        "cpt_codes": ["99213", "20610"],
        "icd10_codes": ["M54.5"],
        "modifiers": [],
        "payer": "Medicare",
        "date_of_service": "2026-08-01"
    }
    """
    flags = []

    for rule in rules:

        # Rule R001 - missing modifier -25
        if rule["id"] == "R001":
            for pair in rule["affected_cpt_pairs"]:
                if pair[0] in claim["cpt_codes"] and pair[1] in claim["cpt_codes"]:
                    if rule["required_modifier"] not in claim.get("modifiers", []):
                        flags.append({
                            "rule_id": rule["id"],
                            "carc_code": rule["carc_code"],
                            "issue": rule["description"],
                            "fix": rule["fix"],
                            "severity": "HIGH"
                        })

        # Rule R002 - diagnosis does not support procedure
        if rule["id"] == "R002":
            for pair in rule["common_pairs"]:
                if pair["cpt"] in claim["cpt_codes"]:
                    for icd in claim["icd10_codes"]:
                        for invalid_prefix in pair["invalid_icd10_prefix"]:
                            if icd.startswith(invalid_prefix):
                                flags.append({
                                    "rule_id": rule["id"],
                                    "carc_code": rule["carc_code"],
                                    "issue": rule["description"],
                                    "fix": rule["fix"],
                                    "severity": "HIGH"
                                })

        # Rule R003 - non covered service
        if rule["id"] == "R003":
            if claim.get("payer") == "Medicare":
                for cpt in claim["cpt_codes"]:
                    if cpt in rule["non_covered_cpt"]:
                        flags.append({
                            "rule_id": rule["id"],
                            "carc_code": rule["carc_code"],
                            "issue": rule["description"],
                            "fix": rule["fix"],
                            "severity": "MEDIUM"
                        })

        # Rule R004 - bundled codes
        if rule["id"] == "R004":
            for pair in rule["bundled_pairs"]:
                if pair[0] in claim["cpt_codes"] and pair[1] in claim["cpt_codes"]:
                    flags.append({
                        "rule_id": rule["id"],
                        "carc_code": rule["carc_code"],
                        "issue": rule["description"],
                        "fix": rule["fix"],
                        "severity": "HIGH"
                    })

        # Rule R005 - missing prior auth
        if rule["id"] == "R005":
            for cpt in claim["cpt_codes"]:
                if cpt in rule["requires_auth_cpt"]:
                    if not claim.get("prior_auth_number"):
                        flags.append({
                            "rule_id": rule["id"],
                            "carc_code": rule["carc_code"],
                            "issue": rule["description"],
                            "fix": rule["fix"],
                            "severity": "HIGH"
                        })

    return flags


def print_report(claim, flags):
    print("\n" + "="*60)
    print("CLAIM REVIEW REPORT")
    print("="*60)
    print(f"CPT Codes:    {', '.join(claim['cpt_codes'])}")
    print(f"ICD-10 Codes: {', '.join(claim['icd10_codes'])}")
    print(f"Payer:        {claim.get('payer', 'Unknown')}")
    print(f"Date:         {claim.get('date_of_service', 'Unknown')}")
    print("-"*60)

    if not flags:
        print("✓ No denial risks detected")
    else:
        print(f"⚠ {len(flags)} issue(s) found:\n")
        for i, flag in enumerate(flags, 1):
            print(f"  Issue {i} — [{flag['severity']}]")
            print(f"  CARC Code: {flag['carc_code']}")
            print(f"  Problem:   {flag['issue']}")
            print(f"  Fix:       {flag['fix']}")
            print()

    print("="*60)