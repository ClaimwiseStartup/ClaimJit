import json

def load_payer_policies(path="data/payer_policies.json"):
    with open(path, "r") as f:
        return json.load(f)["payers"]

def check_payer_policies(claim, payer_policies):
    payer = claim.get("payer")
    flags = []

    if payer not in payer_policies:
        return flags

    policies = payer_policies[payer]["policies"]

    for policy in policies:

        if "affected_cpt" in policy and "required_modifier" in policy:
            for cpt in claim["cpt_codes"]:
                if cpt in policy["affected_cpt"]:
                    if policy["required_modifier"] not in claim.get("modifiers", []):
                        flags.append({
                            "policy_id": policy["id"],
                            "issue": policy["description"],
                            "fix": policy["fix"],
                            "severity": "HIGH",
                            "type": "PAYER_SPECIFIC"
                        })

        if "covered" in policy and policy["covered"] is False:
            if "affected_cpt" in policy:
                for cpt in claim["cpt_codes"]:
                    if cpt in policy["affected_cpt"]:
                        flags.append({
                            "policy_id": policy["id"],
                            "issue": policy["description"],
                            "fix": policy["fix"],
                            "severity": "HIGH",
                            "type": "NOT_COVERED"
                        })

        if policy.get("requires_auth") is True:
            if "affected_cpt" in policy:
                for cpt in claim["cpt_codes"]:
                    if cpt in policy["affected_cpt"]:
                        if not claim.get("prior_auth_number"):
                            flags.append({
                                "policy_id": policy["id"],
                                "issue": policy["description"],
                                "fix": policy["fix"],
                                "severity": "HIGH",
                                "type": "PRIOR_AUTH_REQUIRED"
                            })

        if "affected_cpt_pairs" in policy and "required_modifier" in policy:
            for pair in policy["affected_cpt_pairs"]:
                if pair[0] in claim["cpt_codes"] and pair[1] in claim["cpt_codes"]:
                    if policy["required_modifier"] not in claim.get("modifiers", []):
                        flags.append({
                            "policy_id": policy["id"],
                            "issue": policy["description"],
                            "fix": policy["fix"],
                            "severity": "HIGH",
                            "type": "PAYER_SPECIFIC"
                        })

    return flags