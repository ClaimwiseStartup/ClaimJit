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
