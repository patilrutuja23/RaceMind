from app.services.telemetry_service import load_telemetry

# ── Scenario constants ─────────────────────────────────────────────────────────
SCENARIOS = {
    "delayed_pit_stop": {
        "label": "Delayed Pit Stop (+5 laps)",
        "tire_wear_multiplier": 1.28,
        "lap_time_penalty_per_pct": 0.035,
        "fuel_delta": -2.5,
    },
    "rain_conditions": {
        "label": "Rain Conditions",
        "speed_reduction": 0.88,
        "lap_time_multiplier": 1.12,
        "tire_wear_reduction": 0.60,
        "brake_temp_reduction": 0.75,
    },
    "aggressive_driving": {
        "label": "Aggressive Driving Style",
        "tire_wear_multiplier": 1.45,
        "lap_time_gain": -0.4,
        "brake_temp_increase": 1.18,
    },
    "tire_degradation_increase": {
        "label": "Increased Tire Degradation (+30%)",
        "wear_rate_multiplier": 1.30,
        "lap_time_penalty_per_pct": 0.042,
    },
}


def _position_risk(lap_time_delta: float, tire_delta: float) -> str:
    score = abs(lap_time_delta) * 0.6 + abs(tire_delta) * 0.01
    if score > 2.0:
        return "critical"
    if score > 1.0:
        return "high"
    if score > 0.4:
        return "medium"
    return "low"


def _confidence(wear: float, lap_time_delta: float) -> float:
    base = 0.82
    penalty = min(0.25, abs(lap_time_delta) * 0.04 + wear * 0.001)
    return round(max(0.55, base - penalty), 2)


def run_simulation() -> dict:
    df = load_telemetry()
    last = df.iloc[-1]
    base_lap = int(last["lap"])
    base_lap_time = float(last["lap_time"])
    base_tire_wear = float(last["tire_wear"])
    base_brake_temp = float(last["brake_temperature"])
    wear_rate = float(df["tire_wear"].diff().tail(3).mean())

    results = []

    # ── Scenario 1: Delayed pit stop ──────────────────────────────────────────
    cfg = SCENARIOS["delayed_pit_stop"]
    projected_wear = min(100.0, base_tire_wear * cfg["tire_wear_multiplier"])
    wear_excess = max(0.0, projected_wear - 70.0)
    lap_delta = round(wear_excess * cfg["lap_time_penalty_per_pct"], 3)
    results.append({
        "scenario": cfg["label"],
        "lap_time_impact": lap_delta,
        "tire_impact": round(projected_wear - base_tire_wear, 1),
        "position_risk": _position_risk(lap_delta, projected_wear - base_tire_wear),
        "ai_explanation": (
            f"Delaying the pit stop by 5 laps projects tire wear to {projected_wear:.1f}%. "
            f"Wear above the 70% threshold adds ~{cfg['lap_time_penalty_per_pct']}s per percent, "
            f"resulting in a +{lap_delta}s lap time penalty. "
            f"Risk of dropping positions due to pace loss is {'high' if lap_delta > 1.0 else 'moderate'}."
        ),
        "confidence": _confidence(projected_wear, lap_delta),
    })

    # ── Scenario 2: Rain conditions ───────────────────────────────────────────
    cfg = SCENARIOS["rain_conditions"]
    rain_lap_time = round(base_lap_time * cfg["lap_time_multiplier"], 3)
    rain_tire_wear = round(base_tire_wear * cfg["tire_wear_reduction"], 1)
    rain_delta = round(rain_lap_time - base_lap_time, 3)
    results.append({
        "scenario": cfg["label"],
        "lap_time_impact": rain_delta,
        "tire_impact": round(rain_tire_wear - base_tire_wear, 1),
        "position_risk": _position_risk(rain_delta, rain_tire_wear - base_tire_wear),
        "ai_explanation": (
            f"Rain conditions reduce average speed by {int((1 - cfg['speed_reduction']) * 100)}% "
            f"and increase lap times by ~{rain_delta}s. "
            f"Tire wear rate drops to {cfg['tire_wear_reduction'] * 100:.0f}% of dry pace, "
            f"extending stint length. Brake temperatures reduce by "
            f"{int((1 - cfg['brake_temp_reduction']) * 100)}%, lowering thermal risk. "
            f"Intermediate or Wet compound switch recommended."
        ),
        "confidence": _confidence(rain_tire_wear, rain_delta),
    })

    # ── Scenario 3: Aggressive driving ───────────────────────────────────────
    cfg = SCENARIOS["aggressive_driving"]
    agg_wear = min(100.0, base_tire_wear * cfg["tire_wear_multiplier"])
    agg_lap_time = round(base_lap_time + cfg["lap_time_gain"], 3)
    agg_brake = round(base_brake_temp * cfg["brake_temp_increase"], 0)
    agg_delta = round(agg_lap_time - base_lap_time, 3)
    results.append({
        "scenario": cfg["label"],
        "lap_time_impact": agg_delta,
        "tire_impact": round(agg_wear - base_tire_wear, 1),
        "position_risk": _position_risk(agg_delta, agg_wear - base_tire_wear),
        "ai_explanation": (
            f"Aggressive driving yields a {abs(cfg['lap_time_gain'])}s lap time gain short-term "
            f"but accelerates tire wear to {agg_wear:.1f}% (+{cfg['tire_wear_multiplier'] * 100 - 100:.0f}% rate). "
            f"Brake temperatures rise to {agg_brake}°C, approaching thermal limits. "
            f"Estimated stint reduction of 3–4 laps. "
            f"{'Tire failure risk is elevated.' if agg_wear > 85 else 'Manageable if pit window is adjusted.'}"
        ),
        "confidence": _confidence(agg_wear, agg_delta),
    })

    # ── Scenario 4: Increased tire degradation ────────────────────────────────
    cfg = SCENARIOS["tire_degradation_increase"]
    new_rate = round(wear_rate * cfg["wear_rate_multiplier"], 2)
    projected_wear_5 = min(100.0, base_tire_wear + new_rate * 5)
    lap_penalty = round(max(0.0, projected_wear_5 - 70.0) * cfg["lap_time_penalty_per_pct"], 3)
    results.append({
        "scenario": cfg["label"],
        "lap_time_impact": lap_penalty,
        "tire_impact": round(projected_wear_5 - base_tire_wear, 1),
        "position_risk": _position_risk(lap_penalty, projected_wear_5 - base_tire_wear),
        "ai_explanation": (
            f"A 30% increase in degradation rate raises wear from {wear_rate:.2f}%/lap to "
            f"{new_rate:.2f}%/lap. Over 5 laps, tire wear reaches {projected_wear_5:.1f}%. "
            f"Lap time penalty of +{lap_penalty}s is projected once wear exceeds 70%. "
            f"Pit window should be moved forward by 2–3 laps to compensate."
        ),
        "confidence": _confidence(projected_wear_5, lap_penalty),
    })

    return {
        "base_lap": base_lap,
        "base_lap_time": base_lap_time,
        "base_tire_wear": base_tire_wear,
        "scenarios": results,
    }
