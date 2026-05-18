import random
import time
from app.services.telemetry_service import load_telemetry

_state = {"lap_index": 0, "start_time": time.time()}


def get_live_frame() -> dict:
    df = load_telemetry()
    idx = _state["lap_index"] % len(df)
    row = df.iloc[idx]

    # Add small noise to simulate sensor variance
    frame = {
        "lap": int(row["lap"]),
        "lap_time": round(float(row["lap_time"]) + random.uniform(-0.08, 0.08), 3),
        "speed": round(float(row["speed"]) + random.uniform(-3, 3), 1),
        "tire_wear": round(float(row["tire_wear"]) + random.uniform(0, 0.3), 1),
        "fuel": round(float(row["fuel"]), 1),
        "brake_temperature": round(
            float(row["brake_temperature"]) + random.uniform(-8, 8), 0
        ),
        "ts": round(time.time(), 3),
    }

    # Advance lap every ~10 seconds of real time
    elapsed = time.time() - _state["start_time"]
    _state["lap_index"] = int(elapsed / 10) % len(df)

    return frame
