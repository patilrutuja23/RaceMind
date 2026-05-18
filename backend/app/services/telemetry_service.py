import pandas as pd
from functools import lru_cache
from app.core.config import settings


@lru_cache(maxsize=1)
def load_telemetry() -> pd.DataFrame:
    return pd.read_csv(settings.csv_path)


def get_all_laps() -> list[dict]:
    return load_telemetry().to_dict(orient="records")


def get_tire_data() -> list[dict]:
    df = load_telemetry()[["lap", "tire_wear"]].copy()
    df["wear_rate"] = df["tire_wear"].diff().fillna(df["tire_wear"].iloc[0]).round(2)
    df["status"] = df["tire_wear"].apply(
        lambda w: "critical" if w > 70 else "warning" if w > 45 else "nominal"
    )
    return df.to_dict(orient="records")


def get_speed_data() -> list[dict]:
    return load_telemetry()[["lap", "speed", "brake_temperature"]].to_dict(orient="records")


def get_race_status() -> dict:
    df = load_telemetry()
    last = df.iloc[-1]
    return {
        "current_lap": int(last["lap"]),
        "total_laps": 57,
        "avg_lap_time": round(df["lap_time"].mean(), 3),
        "best_lap_time": round(df["lap_time"].min(), 3),
        "fuel_remaining": round(float(last["fuel"]), 1),
        "tire_wear": round(float(last["tire_wear"]), 1),
        "brake_temperature": round(float(last["brake_temperature"]), 0),
    }
