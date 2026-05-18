# RaceMind AI — Langflow Workflow Architecture

## Overview

The Langflow workflow orchestrates the full AI pipeline from raw telemetry
ingestion to IBM Granite-powered strategy output. Each node is a discrete,
replaceable component.

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                        LANGFLOW PIPELINE                            │
│                                                                     │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐   │
│  │  Telemetry   │────▶│  Analytics   │────▶│    Strategy      │   │
│  │    Input     │     │   Engine     │     │   Evaluator      │   │
│  └──────────────┘     └──────────────┘     └──────────────────┘   │
│         │                    │                       │              │
│         ▼                    ▼                       ▼              │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────────┐   │
│  │   Context    │     │  Risk Score  │     │  Granite Prompt  │   │
│  │  Formatter   │     │  Calculator  │     │    Builder       │   │
│  └──────────────┘     └──────────────┘     └──────────────────┘   │
│         │                    │                       │              │
│         └────────────────────┴───────────────────────┘             │
│                                      │                              │
│                                      ▼                              │
│                          ┌──────────────────────┐                  │
│                          │   IBM Granite LLM    │                  │
│                          │  (granite-13b-inst)  │                  │
│                          └──────────────────────┘                  │
│                                      │                              │
│                                      ▼                              │
│                          ┌──────────────────────┐                  │
│                          │   AI Recommendation  │                  │
│                          │       Output         │                  │
│                          └──────────────────────┘                  │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Node Definitions

### Node 1 — Telemetry Input
- **Type**: Data Loader
- **Source**: CSV file / REST API (`/telemetry/laps`)
- **Output**: Raw DataFrame with fields: `lap`, `speed`, `tire_wear`, `fuel`,
  `brake_temperature`, `lap_time`
- **Langflow Component**: `CSVLoader` or `APILoader`

### Node 2 — Analytics Engine
- **Type**: Python Function Node
- **Inputs**: Raw telemetry DataFrame
- **Operations**:
  - `analyze_tire_wear()` → wear rate, laps remaining, status
  - `detect_performance_drop()` → delta, cause, severity
  - `calculate_risk_score()` → composite risk (tire 40%, brake 25%, fuel 15%, perf 20%)
- **Output**: Structured analytics dict
- **Langflow Component**: `PythonFunctionComponent`

### Node 3 — Strategy Evaluator
- **Type**: Decision Node
- **Inputs**: Analytics output
- **Logic**:
  - If `tire_wear > 70%` → trigger pit recommendation
  - If `risk_level == critical` → escalate confidence weight
  - If `performance_drop.detected` → include cause in prompt context
- **Output**: Strategy flags + enriched context
- **Langflow Component**: `ConditionalRouter`

### Node 4 — Context Formatter
- **Type**: Text Transformer
- **Inputs**: Raw telemetry + analytics output
- **Operations**: Formats telemetry into human-readable prompt context string
- **Output**: `telemetry_context` string
- **Langflow Component**: `PromptTemplate` (partial fill)

### Node 5 — Granite Prompt Builder
- **Type**: Prompt Template Node
- **Inputs**: `telemetry_context`, strategy flags, question (optional)
- **Template Selection**:
  - `STRATEGY_PROMPT` — for pit/strategy decisions
  - `COACHING_PROMPT` — for driver behavior analysis
  - `QA_PROMPT` — for free-form telemetry questions
- **Output**: Fully formatted prompt string
- **Langflow Component**: `PromptTemplate`

### Node 6 — IBM Granite LLM
- **Type**: LLM Node
- **Model**: `ibm/granite-13b-instruct-v2` via watsonx.ai
- **Parameters**:
  - `decoding_method`: greedy
  - `max_new_tokens`: 512
  - `temperature`: 0.2
  - `stop_sequences`: `["<|user|>"]`
- **Auth**: IAM token via IBM API key
- **Output**: Raw JSON string
- **Langflow Component**: `WatsonxLLM` (custom)

### Node 7 — AI Recommendation Output
- **Type**: JSON Parser + Response Formatter
- **Inputs**: Raw LLM output string
- **Operations**:
  - Parse JSON
  - Validate against `GraniteResponse` Pydantic model
  - Fallback to mock response on parse failure
- **Output**: `{ recommendation, explanation, confidence_score, what_if_analysis }`
- **Langflow Component**: `JSONParser` + `OutputComponent`

---

## Data Flow

```
telemetry.csv
    │
    ▼
DataFrame (20 laps × 6 fields)
    │
    ├──▶ context_formatter.py ──▶ telemetry_context: str
    │
    ├──▶ analytics_service.py ──▶ { tire_status, risk_score, pit_strategy }
    │
    └──▶ strategy_evaluator ──▶ strategy_flags: dict
              │
              ▼
        prompts.py (template selection + fill)
              │
              ▼
        IBM Granite API (watsonx.ai)
              │
              ▼
        JSON parse + validate
              │
              ▼
        GraniteResponse { recommendation, explanation,
                          confidence_score, what_if_analysis }
```

---

## Telemetry Context Handling

The context formatter (`context_formatter.py`) converts the DataFrame into a
single-line string that fits within the Granite prompt token budget:

```
Current Lap: 20 | Lap Time: 94.187s (trend: degrading) |
Speed: 283.4 km/h | Tire Wear: 91.2% (rate: +4.8%/lap) |
Fuel: 14.9 kg | Brake Temp: 531°C |
Recent lap times: [91.243, 91.876, 92.543, 93.312, 94.187] |
Recent tire wear: [75.8, 79.3, 83.1, 87.4, 91.2]
```

This format is:
- Token-efficient (fits in ~120 tokens)
- Human-readable for prompt debugging
- Deterministic — same input always produces same context string

---

## AI Orchestration Design

| Concern | Approach |
|---|---|
| Prompt versioning | Templates in `prompts.py`, imported by service |
| Fallback | `_mock_response()` on any API/parse failure |
| Auth | IAM token fetched per-request (short-lived) |
| Async | All Granite calls are `async/await` via `httpx.AsyncClient` |
| Offline dev | `IBM_API_KEY=mock` in `.env` bypasses all API calls |
| Extensibility | New prompt types = new template constant + service function |
