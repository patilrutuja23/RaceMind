# 🏎️ RaceMind AI

> **AI-powered Formula 1 race strategy and telemetry intelligence platform**
> Built with IBM Granite · FastAPI · React · Recharts

---

## Problem Statement

Modern Formula 1 race strategy is decided in seconds. Engineers process
thousands of telemetry data points per lap — tire degradation, brake
temperatures, fuel loads, sector times — and must translate that into
split-second pit stop decisions. Human analysis at this speed and volume
is error-prone, and the cost of a wrong call can be the difference between
a podium and a points loss.

**There is no accessible, AI-augmented tool that combines real-time telemetry
analytics with explainable AI strategy recommendations for race engineers.**

---

## Solution

RaceMind AI is a full-stack telemetry intelligence platform that:

- **Ingests** lap-by-lap telemetry data (speed, tire wear, fuel, brake temperature, lap times)
- **Analyzes** degradation patterns, performance drops, and risk scores using an explainable analytics engine
- **Generates** AI-powered strategy recommendations via IBM Granite instruct models
- **Simulates** what-if scenarios (rain, delayed pit, aggressive driving) with projected race impact
- **Explains** every recommendation in plain language through an AI Copilot chat interface

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        RACEMIND AI                              │
│                                                                 │
│  React Frontend (Vite + Tailwind + Recharts)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │Dashboard │  │Telemetry │  │AI Copilot│  │  Simulation  │  │
│  │  Charts  │  │Stat Cards│  │  Chat    │  │  What-If     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘  │
│                         │ Axios API Layer                       │
├─────────────────────────┼───────────────────────────────────────┤
│  FastAPI Backend        │                                       │
│  ┌──────────────────────▼──────────────────────────────────┐   │
│  │  /telemetry  /analytics  /ai  /simulation               │   │
│  └──────────────────────┬──────────────────────────────────┘   │
│           ┌─────────────┼──────────────┐                       │
│           ▼             ▼              ▼                        │
│  ┌──────────────┐ ┌──────────┐ ┌────────────────────────┐     │
│  │  Telemetry   │ │Analytics │ │  IBM Granite Service   │     │
│  │  Service     │ │ Engine   │ │  (watsonx.ai API)      │     │
│  │  (pandas)    │ │          │ │  granite-13b-instruct  │     │
│  └──────────────┘ └──────────┘ └────────────────────────┘     │
│                                         │                       │
│                              ┌──────────▼──────────┐           │
│                              │  Simulation Engine  │           │
│                              │  (What-If Scenarios)│           │
│                              └─────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
```

---

## IBM Technologies Used

| Technology | Role |
|---|---|
| **IBM Granite 13B Instruct v2** | Core LLM for strategy recommendations, driver coaching, and telemetry Q&A |
| **IBM watsonx.ai** | Model hosting, IAM authentication, and inference API |
| **IBM Prompt Engineering** | Structured `<\|system\|>/<\|user\|>/<\|assistant\|>` prompt templates for consistent JSON output |

### Why IBM Granite?

Granite instruct models are optimized for structured, instruction-following
tasks — exactly what race strategy requires. The model reliably outputs
valid JSON with `recommendation`, `explanation`, `confidence_score`, and
`what_if_analysis` fields, enabling deterministic frontend rendering without
post-processing heuristics.

---

## Telemetry Analytics Engine

The analytics engine (`analytics_service.py`) uses explainable rule-based
logic — no black-box ML — so every output can be traced to a specific
telemetry threshold:

| Function | Logic | Output |
|---|---|---|
| `analyze_tire_wear()` | Wear rate from last 3 laps, projects laps-to-critical | `status`, `laps_remaining`, `confidence` |
| `detect_performance_drop()` | Lap delta > 0.8s threshold, root cause attribution | `drop_lap`, `cause`, `severity` |
| `recommend_pit_strategy()` | Laps-to-critical → undercut vs standard window | `recommended_lap`, `strategy_type`, `confidence` |
| `calculate_risk_score()` | Weighted composite: tire 40%, brake 25%, fuel 15%, perf 20% | `overall_risk`, `risk_level` |

### What-If Simulation Scenarios

| Scenario | Key Logic |
|---|---|
| Delayed Pit Stop | Projects wear × 1.28, applies lap time penalty above 70% threshold |
| Rain Conditions | Lap time × 1.12, wear rate × 0.60, brake temp × 0.75 |
| Aggressive Driving | Wear × 1.45, −0.4s lap gain, brake temp × 1.18 |
| Tire Degradation +30% | Wear rate × 1.30, projects 5-lap wear, calculates penalty |

---

## Langflow Workflow

See [`docs/LANGFLOW_ARCHITECTURE.md`](docs/LANGFLOW_ARCHITECTURE.md) for the
full node-by-node breakdown of the AI orchestration pipeline:

```
Telemetry Input → Analytics Engine → Strategy Evaluator
    → Context Formatter → Granite Prompt Builder
    → IBM Granite LLM → AI Recommendation Output
```

---

## Screenshots

> _Replace placeholders with actual screenshots before submission._

| Dashboard | AI Copilot Chat |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Chat](docs/screenshots/chat.png) |

| Strategy Panel | What-If Simulation |
|---|---|
| ![Strategy](docs/screenshots/strategy.png) | ![Simulation](docs/screenshots/simulation.png) |

---

## Project Structure

```
RaceMind/
├── src/                          # React frontend
│   ├── components/
│   │   ├── chat/                 # AI Copilot chat interface
│   │   ├── layout/               # Sidebar, Header, DashboardLayout
│   │   ├── strategy/             # AI strategy panel components
│   │   └── telemetry/            # Charts and stat cards
│   ├── data/                     # Mock data (offline dev)
│   ├── hooks/api/                # useApi, useTelemetry hooks
│   ├── pages/                    # Dashboard, AICopilot pages
│   ├── services/                 # Axios API service layer
│   └── types/                    # JSDoc API interfaces
│
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── core/                 # Settings, config
│   │   ├── models/               # Pydantic response models
│   │   ├── routers/              # telemetry, analytics, ai, simulation
│   │   └── services/
│   │       ├── granite/          # IBM Granite client + prompts
│   │       └── simulation/       # What-if engine
│   └── data/telemetry.csv        # Mock telemetry dataset
│
└── docs/
    └── LANGFLOW_ARCHITECTURE.md  # AI pipeline design
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+
- IBM watsonx.ai account (optional — mock mode works without it)

### Frontend

```bash
cd RaceMind
npm install
npm run dev
# → http://localhost:5173
```

### Backend

```bash
cd RaceMind/backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

pip install -r requirements.txt

# Configure environment
cp .env .env.local
# Edit .env — set IBM_API_KEY, IBM_PROJECT_ID for live Granite
# Leave IBM_API_KEY=mock for offline development

python run.py
# → http://localhost:8000
# → http://localhost:8000/docs  (Swagger UI)
```

### IBM Granite Configuration

In `backend/.env`:

```env
IBM_API_KEY=your_ibm_cloud_api_key
IBM_WX_URL=https://us-south.ml.cloud.ibm.com
IBM_PROJECT_ID=your_watsonx_project_id
GRANITE_MODEL_ID=ibm/granite-13b-instruct-v2
```

> Set `IBM_API_KEY=mock` to run fully offline with pre-built mock responses.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/telemetry/laps` | All lap records |
| GET | `/telemetry/tires` | Tire wear per lap with status |
| GET | `/telemetry/speed` | Speed and brake temperature |
| GET | `/telemetry/status` | Current race status summary |
| GET | `/analytics/tire-wear` | Tire degradation analysis |
| GET | `/analytics/performance-drop` | Lap time drop detection |
| GET | `/analytics/pit-strategy` | Pit window recommendation |
| GET | `/analytics/risk-score` | Composite risk assessment |
| POST | `/ai/strategy` | IBM Granite strategy recommendation |
| GET | `/ai/coaching` | IBM Granite driver coaching |
| POST | `/ai/ask` | IBM Granite telemetry Q&A |
| GET | `/simulation/what-if` | All 4 what-if scenario results |
| GET | `/health` | Service health check |

---

## Future Improvements

- **Live telemetry ingestion** via WebSocket from F1 timing APIs
- **Multi-driver comparison** — side-by-side telemetry overlays
- **Langflow visual editor** integration for no-code prompt pipeline editing
- **Historical race database** — train degradation models on past race data
- **Voice interface** — engineer speaks questions, Granite responds via TTS
- **Pit crew coordination** — push recommendations to crew display systems
- **Sector-level telemetry** — mini-sector speed traces and braking points
- **Weather integration** — real-time rain probability feeding simulation engine

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Recharts, Axios |
| Backend | Python 3.11, FastAPI, Pandas, Pydantic v2, httpx |
| AI | IBM Granite 13B Instruct v2 via watsonx.ai |
| Architecture | REST API, modular services, component-based UI |

---

## License

MIT — built for the IBM Granite Hackathon.
