# 🏎️ RaceMind AI

> **AI-powered Formula 1 race strategy and telemetry intelligence platform**
> Built with IBM Granite · FastAPI · React · Recharts · WebSocket

[![Python](https://img.shields.io/badge/Python-3.14-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![IBM Granite](https://img.shields.io/badge/IBM%20Granite-3.3--8b-purple)](https://huggingface.co/ibm-granite)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

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

- **Streams** live lap-by-lap telemetry via WebSocket at 1Hz (speed, tire wear, fuel, brake temperature, lap times)
- **Analyzes** degradation patterns, performance drops, and risk scores using an explainable rule-based analytics engine
- **Generates** AI-powered strategy recommendations via IBM Granite 3.3-8B Instruct hosted on Hugging Face
- **Simulates** what-if scenarios (rain, delayed pit, aggressive driving, degradation +30%) with projected race impact
- **Explains** every recommendation through a structured AI Copilot chat with rich telemetry-aware responses
- **Alerts** engineers to live race events (Yellow Flag, Safety Car, DRS, Tire Critical) in real time
- **Broadcasts** AI commentary that updates dynamically based on live telemetry values

---

## Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          RACEMIND AI                                 │
│                                                                      │
│  React Frontend (Vite + Tailwind CSS v4 + Recharts)                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Telemetry │ │  Live    │ │AI Strategy│ │  Risk   │ │What-If  │ │
│  │Overview  │ │  Charts  │ │  Panel   │ │Analysis │ │Simulation│ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│  ┌──────────────────────┐  ┌──────────────────────────────────────┐ │
│  │   AI Copilot Chat    │  │  Race Events + AI Commentary Feed    │ │
│  └──────────────────────┘  └──────────────────────────────────────┘ │
│              │ Axios REST + WebSocket                                │
├──────────────┼───────────────────────────────────────────────────────┤
│  FastAPI Backend                                                     │
│  ┌───────────▼──────────────────────────────────────────────────┐   │
│  │  /telemetry  /analytics  /ai  /simulation  /ws/telemetry     │   │
│  └───────────┬──────────────────────────────────────────────────┘   │
│      ┌───────┼──────────────┬──────────────────┐                    │
│      ▼       ▼              ▼                  ▼                    │
│  ┌───────┐ ┌──────────┐ ┌──────────────┐ ┌──────────────────┐     │
│  │Telem. │ │Analytics │ │IBM Granite   │ │Simulation Engine │     │
│  │Service│ │Engine    │ │Service       │ │(What-If Scenarios│     │
│  │pandas │ │rule-based│ │HF Inference  │ │4 scenario types) │     │
│  └───────┘ └──────────┘ └──────────────┘ └──────────────────┘     │
│                              │                                       │
│                    ┌─────────▼──────────┐                           │
│                    │  WebSocket Stream  │                           │
│                    │  1Hz telemetry     │                           │
│                    │  push to frontend  │                           │
│                    └────────────────────┘                           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## IBM Technologies Used

| Technology | Role |
|---|---|
| **IBM Granite 3.3-8B Instruct** | Core LLM for strategy recommendations, driver coaching, and telemetry Q&A |
| **Hugging Face Inference API** | Hosts IBM Granite model — free tier, no IBM account required |
| **IBM Prompt Engineering** | Structured `system/user/assistant` chat message templates for consistent JSON output |

### Why IBM Granite?

Granite instruct models are optimized for structured, instruction-following
tasks — exactly what race strategy requires. The model reliably outputs
valid JSON with `recommendation`, `explanation`, `confidence_score`, and
`what_if_analysis` fields, enabling deterministic frontend rendering without
post-processing heuristics.

`ibm-granite/granite-3.3-8b-instruct` is publicly available on Hugging Face,
making it accessible without an IBM Cloud account. The backend falls back to
pre-built mock responses automatically when no API key is configured.

---

## Dashboard Sections

The entire app is a single unified scroll-based dashboard. Sidebar navigation
scrolls to sections and syncs active state via `IntersectionObserver`.

| Section | Contents |
|---|---|
| ⚡ **Telemetry Overview** | Live stat cards, race status, mini metrics, race events bar, AI commentary feed |
| 📡 **Live Charts** | Lap time trend, tire wear degradation, speed + brake temperature |
| 🧠 **AI Strategy** | IBM Granite recommendation, confidence meter, critical metrics, what-if table |
| ⚠️ **Risk Analysis** | Composite risk score, tire/brake/performance/pit gauges with animated bars |
| 🔮 **What-If Simulation** | 4 scenario cards with animated impact values, position delta, risk meters |
| 💬 **AI Copilot Chat** | Full structured chat with rich block responses, streaming cursor, phase typing |

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

## Real-Time Architecture

Live telemetry is delivered via WebSocket at `ws://localhost:8000/ws/telemetry`.

```
Backend (FastAPI)                    Frontend (React)
─────────────────                    ────────────────
telemetry_stream.py                  useLiveTelemetry.js
  └─ get_live_frame()    ──1Hz──▶    ├─ data  (current frame)
  └─ sensor noise added              ├─ history (last 50 frames)
  └─ lap advances every 10s          └─ connected (bool)
                                           │
                                     All chart components
                                     consume history[]
                                     All stat cards
                                     consume data{}
```

Auto-reconnect is built into the hook with a 3-second retry delay.
All components fall back to mock data silently when the backend is offline.

---

## AI Copilot Response Format

Responses are structured block arrays rendered by `ChatBubble.jsx`:

```
┌─────────────────────────────────────────────┐
│ 🔴 TIRE WEAR CRITICAL — Immediate action    │  ← alert block
├─────────────────────────────────────────────┤
│ WEAR STATUS ─────────────────────────────── │  ← section label
│ • Current wear    [67.4%]  critical exceeded│  ← bullet + value chip
│ • Degradation     [+4.8%/lap]  accelerating │
│ • Laps to failure [~2 laps]                 │
├─────────────────────────────────────────────┤
│ RECOMMENDATION ──────────────────────────── │
│ Pit immediately. Confidence in completing   │  ← recommendation block
│ 5+ laps without pace loss is 23%.          │
├─────────────────────────────────────────────┤
│ AI Confidence  ████████████████░░  96% High │  ← animated confidence bar
├─────────────────────────────────────────────┤
│ Pit now   → Tire risk eliminated  ✅        │  ← what-if block
│ Stay out  → Lap time +1.8s/lap   ❌        │
└─────────────────────────────────────────────┘
```

---

## Langflow Workflow

See [`docs/LANGFLOW_ARCHITECTURE.md`](docs/LANGFLOW_ARCHITECTURE.md) for the
full node-by-node breakdown of the AI orchestration pipeline:

```
Telemetry Input → Analytics Engine → Strategy Evaluator
    → Context Formatter → Granite Prompt Builder
    → IBM Granite LLM (via HF Inference API)
    → JSON Parser → AI Recommendation Output
```

---

## Screenshots

> _Replace placeholders with actual screenshots before submission._

| Dashboard Overview | AI Copilot Chat |
|---|---|
| ![Dashboard](docs/screenshots/dashboard.png) | ![Chat](docs/screenshots/chat.png) |

| AI Strategy Panel | What-If Simulation |
|---|---|
| ![Strategy](docs/screenshots/strategy.png) | ![Simulation](docs/screenshots/simulation.png) |

| Risk Analysis | Race Events |
|---|---|
| ![Risk](docs/screenshots/risk.png) | ![Events](docs/screenshots/events.png) |

---

## Project Structure

```
RaceMind/
├── src/                              # React frontend
│   ├── components/
│   │   ├── chat/                     # AICopilotChat, ChatBubble, TypingIndicator
│   │   ├── layout/                   # Sidebar, Header, DashboardLayout, SettingsModal
│   │   ├── strategy/                 # AIStrategyWidget, WhatIfSimulationCard,
│   │   │                             # RiskAnalysisPanel, AICopilotPreview,
│   │   │                             # ConfidenceMeter, RiskIndicator
│   │   ├── telemetry/                # Charts, TelemetryStatCards, RaceStatusCard,
│   │   │                             # RaceEventsBar, RaceCommentaryFeed
│   │   └── ui/                       # Skeleton, SectionHeader
│   ├── data/                         # mockData.js, chatMockData.js (structured blocks)
│   ├── hooks/
│   │   ├── api/                      # useApi.js, useTelemetry.js (12 domain hooks)
│   │   ├── useChat.js                # Streaming chat with phase typing
│   │   └── useLiveTelemetry.js       # WebSocket hook with auto-reconnect
│   ├── pages/
│   │   └── RaceDashboard.jsx         # Unified scroll dashboard with IntersectionObserver
│   ├── services/                     # Axios services: telemetry, analytics, ai, simulation
│   └── types/                        # JSDoc API interfaces
│
├── backend/                          # FastAPI backend
│   ├── app/
│   │   ├── core/config.py            # pydantic-settings, HF + env config
│   │   ├── models/telemetry.py       # 10 Pydantic response models
│   │   ├── routers/                  # telemetry, analytics, ai, simulation, ws
│   │   └── services/
│   │       ├── granite/              # granite_client.py (HF API), prompts.py,
│   │       │                         # granite_service.py, context_formatter.py
│   │       ├── simulation/           # simulation_engine.py (4 scenarios)
│   │       ├── analytics_service.py  # 4 explainable analytics functions
│   │       ├── telemetry_service.py  # pandas CSV loader + queries
│   │       └── telemetry_stream.py   # WebSocket live frame generator
│   ├── data/telemetry.csv            # 20-lap mock telemetry dataset
│   ├── .env                          # HF_API_KEY, model config
│   ├── requirements.txt
│   └── run.py                        # uvicorn entrypoint
│
└── docs/
    └── LANGFLOW_ARCHITECTURE.md      # 7-node AI pipeline design
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.11+ (tested on 3.14)
- Hugging Face account (free — for IBM Granite AI features)

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
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# Install — pydantic-core must be installed first on Python 3.14
pip install pydantic-core==2.46.4 --no-build-isolation
pip install -r requirements.txt --no-build-isolation

python run.py
# → http://localhost:8000
# → http://localhost:8000/docs   (Swagger UI)
# → ws://localhost:8000/ws/telemetry  (WebSocket)
```

### IBM Granite via Hugging Face

1. Sign up free at [huggingface.co](https://huggingface.co)
2. Go to **Settings → Access Tokens → New token** (Inference scope)
3. Copy the token (starts with `hf_...`)

In `backend/.env`:

```env
HF_API_KEY=hf_your_token_here
HF_MODEL_ID=ibm-granite/granite-3.3-8b-instruct
```

> Leave `HF_API_KEY=mock` to run fully offline — all AI endpoints return
> pre-built structured mock responses automatically.

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
| WS | `/ws/telemetry` | Live telemetry stream at 1Hz |
| GET | `/health` | Service health check |

---

## Key Features

### Live Telemetry
- WebSocket stream at 1Hz with sensor noise simulation
- Auto-reconnect with 3s retry, graceful offline fallback
- Last 50 frames buffered for chart history
- Lap advances every 10 real-world seconds

### AI Strategy Engine
- IBM Granite 3.3-8B via Hugging Face Inference API
- 3 prompt templates: strategy, coaching, Q&A
- Telemetry context formatted to ~120 tokens
- JSON extraction with regex fallback for markdown fences
- Automatic mock fallback on any API failure

### Race Events System
- 5 event types: Yellow Flag, Rain, Safety Car, DRS, Tire Critical
- Events auto-inject every 12 seconds (simulated)
- Animated glowing borders with event-specific colors
- Dismissible with ✕

### AI Commentary Feed
- Updates every 5 seconds
- Telemetry-aware: generates critical messages when thresholds exceeded
- Opacity fades older entries
- Slide-in animation on new entries

### Confidence Meter
- Count-up animation using `requestAnimationFrame` with cubic ease-out
- Shimmer sweep across bar after fill
- Glow shadow color matches confidence level (green/yellow/red)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS v4, Recharts, Axios |
| Backend | Python 3.14, FastAPI, Pandas, Pydantic v2, httpx, uvicorn |
| AI | IBM Granite 3.3-8B Instruct via Hugging Face Inference API |
| Real-time | WebSocket (FastAPI native), browser WebSocket API |
| Architecture | REST + WebSocket, modular services, single-page scroll dashboard |

---

## Future Improvements

- **FastF1 integration** — replace CSV with real F1 timing data via `pip install fastf1`
- **Multi-driver comparison** — side-by-side telemetry overlays
- **Langflow visual editor** — no-code prompt pipeline editing
- **Historical race database** — degradation models trained on past race data
- **Voice interface** — engineer speaks questions, Granite responds via TTS
- **Sector-level telemetry** — mini-sector speed traces and braking points
- **Weather API integration** — real-time rain probability feeding simulation engine
- **Pit crew coordination** — push recommendations to crew display systems
- **WebSocket broadcast** — multi-client support for team-wide telemetry sharing

---

## License

MIT — built for the IBM Granite Hackathon.
