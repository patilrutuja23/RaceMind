import pandas as pd
from app.services.telemetry_service import load_telemetry

TIRE_CRITICAL = 70.0
TIRE_WARNING = 45.0
BRAKE_CRITICAL = 510.0
FUEL_LOW = 20.0
LAP_TIME_DROP_THRESHOLD = 0.8


def analyze_tire_wear() -> dict:
    df = load_telemetry()
    current_wear = float(df["tire_wear"].iloc[-1])
    wear_rates = df["tire_wear"].diff().dropna()
    wear_rate = round(float(wear_rates.tail(3).mean()), 2)
    laps_remaining = round((100.0 - current_wear) / wear_rate, 1) if wear_rate > 0 else 99.0

    if current_wear > TIRE_CRITICAL:
        status, recommendation = "critical", "Pit immediately — tire failure risk."
    elif current_wear > TIRE_WARNING:
        status, recommendation = "warning", "Plan pit stop within 3 laps."
    else:
        status, recommendation = "nominal", "Tires within acceptable range."

    confidence = round(min(0.95, 0.5 + (current_wear / 100) * 0.5), 2)

    return {
        "current_wear": round(current_wear, 1),
        "wear_rate_per_lap": wear_rate,
        "laps_remaining": laps_remaining,
        "status": status,
        "recommendation": recommendation,
        "confidence": confidence,
    }


def detect_performance_drop() -> dict:
    df = load_telemetry()
    df["delta"] = df["lap_time"].diff()
    drops = df[df["delta"] > LAP_TIME_DROP_THRESHOLD]

    if drops.empty:
        return {
            "detected": False,
            "drop_lap": None,
            "lap_time_delta": 0.0,
            "cause": "none",
            "severity": "none",
        }

    worst = drops.loc[drops["delta"].idxmax()]
    wear_at_drop = float(df.loc[df["lap"] == worst["lap"], "tire_wear"].values[0])
    brake_at_drop = float(df.loc[df["lap"] == worst["lap"], "brake_temperature"].values[0])

    cause = (
        "tire_degradation" if wear_at_drop > TIRE_WARNING
        else "brake_overheating" if brake_at_drop > BRAKE_CRITICAL
        else "fuel_load_reduction"
    )
    delta = round(float(worst["delta"]), 3)
    severity = "high" if delta > 1.5 else "medium" if delta > 0.8 else "low"

    return {
        "detected": True,
        "drop_lap": int(worst["lap"]),
        "lap_time_delta": delta,
        "cause": cause,
        "severity": severity,
    }


def recommend_pit_strategy() -> dict:
    df = load_telemetry()
    current_lap = int(df["lap"].iloc[-1])
    tire_data = analyze_tire_wear()
    current_wear = tire_data["current_wear"]
    wear_rate = tire_data["wear_rate_per_lap"]

    laps_to_critical = max(0, round((TIRE_CRITICAL - current_wear) / wear_rate)) if wear_rate > 0 else 10
    recommended_lap = current_lap + max(1, laps_to_critical - 1)
    should_pit = current_wear > TIRE_WARNING
    confidence = round(min(0.97, 0.55 + (current_wear / 100) * 0.45), 2)

    strategy_type = "undercut" if laps_to_critical <= 2 else "standard"
    reasoning = (
        f"Tire wear at {current_wear}% with {wear_rate}%/lap degradation rate. "
        f"Estimated {laps_to_critical} laps before critical threshold. "
        f"{'Undercut opportunity available.' if strategy_type == 'undercut' else 'Standard pit window optimal.'}"
    )

    return {
        "should_pit": should_pit,
        "recommended_lap": recommended_lap,
        "current_lap": current_lap,
        "laps_until_pit": max(0, recommended_lap - current_lap),
        "strategy_type": strategy_type,
        "compound_switch": "Medium → Hard",
        "confidence": confidence,
        "reasoning": reasoning,
    }


def calculate_risk_score() -> dict:
    df = load_telemetry()
    last = df.iloc[-1]

    tire_risk = round(min(1.0, float(last["tire_wear"]) / 100), 2)
    brake_risk = round(min(1.0, float(last["brake_temperature"]) / BRAKE_CRITICAL), 2)
    fuel_risk = round(max(0.0, 1.0 - float(last["fuel"]) / FUEL_LOW) if float(last["fuel"]) < FUEL_LOW else 0.0, 2)

    lap_times = df["lap_time"].tail(5)
    perf_trend = lap_times.iloc[-1] - lap_times.iloc[0]
    performance_risk = round(min(1.0, max(0.0, perf_trend / 5.0)), 2)

    overall = round((tire_risk * 0.4 + brake_risk * 0.25 + fuel_risk * 0.15 + performance_risk * 0.2), 2)
    risk_level = "critical" if overall > 0.75 else "high" if overall > 0.55 else "medium" if overall > 0.35 else "low"

    recommendation = (
        "Immediate action required." if risk_level == "critical"
        else "Pit stop strongly advised." if risk_level == "high"
        else "Monitor closely." if risk_level == "medium"
        else "Situation nominal."
    )

    return {
        "overall_risk": overall,
        "risk_level": risk_level,
        "tire_risk": tire_risk,
        "brake_risk": brake_risk,
        "fuel_risk": fuel_risk,
        "performance_risk": performance_risk,
        "recommendation": recommendation,
    }
