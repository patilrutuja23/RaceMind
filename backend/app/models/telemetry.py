from pydantic import BaseModel


# ── Telemetry ──────────────────────────────────────────────────────────────────

class LapRecord(BaseModel):
    lap: int
    lap_time: float
    speed: float
    tire_wear: float
    fuel: float
    brake_temperature: float


class TireStatus(BaseModel):
    lap: int
    tire_wear: float
    wear_rate: float
    status: str


class SpeedRecord(BaseModel):
    lap: int
    speed: float
    brake_temperature: float


class RaceStatus(BaseModel):
    current_lap: int
    total_laps: int
    avg_lap_time: float
    best_lap_time: float
    fuel_remaining: float
    tire_wear: float
    brake_temperature: float


# ── Analytics ─────────────────────────────────────────────────────────────────

class TireAnalysis(BaseModel):
    current_wear: float
    wear_rate_per_lap: float
    laps_remaining: float
    status: str
    recommendation: str
    confidence: float


class PerformanceDrop(BaseModel):
    detected: bool
    drop_lap: int | None
    lap_time_delta: float
    cause: str
    severity: str


class PitStrategy(BaseModel):
    should_pit: bool
    recommended_lap: int
    current_lap: int
    laps_until_pit: int
    strategy_type: str
    compound_switch: str
    confidence: float
    reasoning: str


class RiskScore(BaseModel):
    overall_risk: float
    risk_level: str
    tire_risk: float
    brake_risk: float
    fuel_risk: float
    performance_risk: float
    recommendation: str


# ── Granite AI ────────────────────────────────────────────────────────────────

class WhatIfAnalysis(BaseModel):
    if_pit_now: str | None = None
    if_stay_out: str | None = None
    if_push_harder: str | None = None
    if_brake_earlier: str | None = None
    if_reduce_tire_stress: str | None = None
    if_optimal_line: str | None = None
    best_case: str | None = None
    worst_case: str | None = None
    most_likely: str | None = None


class GraniteResponse(BaseModel):
    recommendation: str
    explanation: str
    confidence_score: float
    what_if_analysis: WhatIfAnalysis


class QuestionRequest(BaseModel):
    question: str


class StrategyRequest(BaseModel):
    current_lap: int = 20
    total_laps: int = 57
    position: int = 3
    gap_ahead: str = "+1.842s"


# ── Simulation ────────────────────────────────────────────────────────────────

class SimulationScenario(BaseModel):
    scenario: str
    lap_time_impact: float
    tire_impact: float
    position_risk: str
    ai_explanation: str
    confidence: float


class SimulationResult(BaseModel):
    base_lap: int
    base_lap_time: float
    base_tire_wear: float
    scenarios: list[SimulationScenario]
