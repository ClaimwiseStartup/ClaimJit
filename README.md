# ClaimJit

**Intelligent medical claims validation and auto-correction engine** that uses AI-powered clinical note parsing and rule-based policy enforcement to detect and fix billing compliance issues before claims are submitted.

ClaimJit reduces claim denials by automatically validating claims against general billing rules and payer-specific policies, extracting billing codes from unstructured clinical notes, and auto-correcting fixable issues like missing modifiers. What would take hours of manual review now happens in seconds.

## Stack

- **Language:** Python
- **Framework / Runtime:** FastAPI (backend API), Python scripts (rules engine)
- **Notable libraries:** 
  - [Anthropic Claude API](https://www.anthropic.com/) — LLM-powered clinical note parsing
  - [Pydantic](https://docs.pydantic.dev/) — request validation and type safety
  - [FastAPI](https://fastapi.tiangolo.com/) — high-performance async web framework

## How it's organized

ClaimJit/ main.py Entry point with test cases for denial rules and payer policies parser.py Claude-based clinical note parser; extracts CPT, ICD-10, modifiers rules_engine.py General denial-prevention rules (bundling, modifiers, diagnosis validity) payer_rules.py Payer-specific policy checker (BlueCross, Medicare, United)

backend/ main.py FastAPI server with /analyze endpoint; orchestrates parsing and checking requirements.txt (empty; dependencies to be added)

data/ denial_rules.json Rule definitions for R001–R005 (modifier -25, diagnosis support, coverage) payer_policies.json Payer-specific policies for BlueCross, Medicare, United


**How it fits together:**

1. **Clinical note parsing** — `parser.py` sends unstructured clinical text to Claude and extracts structured billing codes (CPT, ICD-10, modifiers).
2. **Claims validation** — `rules_engine.py` applies five denial-prevention rules (R001–R005) checking for missing modifiers, bundled codes, and coverage gaps.
3. **Payer policy enforcement** — `payer_rules.py` applies payer-specific constraints from `payer_policies.json` (e.g., BlueCross modifier -59, Medicare coverage gaps).
4. **Auto-fixing** — `backend/main.py` auto-corrects fixable issues (missing modifiers) and flags items requiring human action (prior auth, coverage decisions).
5. **Result reporting** — Claims are returned with corrected codes, human-action flags, and a ready-to-submit status.

## How to run it

### Local testing (scripts)

```bash
# Run test cases against denial rules and payer policies
python main.py

This runs three test claims and demonstrates:

Claims that fail validation (missing modifier -25)
Claims that pass validation
Clinical note parsing and full validation pipeline

## Try asking

How does the parser extract codes from clinical notes? — See parser.py and the Claude prompt; it uses the Anthropic Haiku model to convert unstructured text into structured JSON billing codes.
What happens when a claim fails the bundling check? — Rule R004 in rules_engine.py detects bundled code pairs (e.g., 99213 + 99212 on same date) and flags them as severity: HIGH; the fix removes the lower-level code.
Can I add new payer policies? — Yes. Add a new payer object to data/payer_policies.json with policies matching the schema (affected_cpt, required_modifier, covered, requires_auth, etc.). The checker in payer_rules.py will apply them.
What claims are auto-fixed vs. human-reviewed? — Auto-fixed: missing modifiers (-25, -59, -95). Human-reviewed: prior auth required, non-covered services, diagnosis-code mismatches (see backend/main.py:auto_fix_claim()).
Is the Anthropic API key safe? — No. The key is hardcoded in parser.py. Move it to environment variables or a secrets manager before deploying.
