import os
from dotenv import load_dotenv
load_dotenv()
import anthropic
import json

client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))

def parse_clinical_note(note: str) -> dict:
    prompt = f"""You are a medical coding assistant. Read the clinical note below and extract the billing codes.

Return ONLY a JSON object with this exact structure. No explanation, no markdown, no code blocks, just raw JSON:
{{
  "cpt_codes": ["code1", "code2"],
  "icd10_codes": ["code1", "code2"],
  "modifiers": [],
  "reasoning": "brief explanation of why you chose these codes"
}}

Clinical note:
{note}"""

    response = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=1024,
        messages=[{"role": "user", "content": prompt}]
    )

    raw = response.content[0].text.strip()
    
    # Strip markdown code blocks if model adds them
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    
    return json.loads(raw)