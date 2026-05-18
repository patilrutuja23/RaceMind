import pandas as pd


def format_telemetry_context(df: pd.DataFrame) -> str:
    last = df.iloc[-1]
    recent = df.tail(5)
    lap_trend = recent["lap_time"].tolist()
    wear_trend = recent["tire_wear"].tolist()

    trend_dir = "improving" if lap_trend[-1] < lap_trend[0] else "degrading"
    wear_rate = round((wear_trend[-1] - wear_trend[0]) / len(wear_trend), 2)

    return (
        f"Current Lap: {int(last['lap'])} | "
        f"Lap Time: {last['lap_time']}s (trend: {trend_dir}) | "
        f"Speed: {last['speed']} km/h | "
        f"Tire Wear: {last['tire_wear']}% (rate: +{wear_rate}%/lap) | "
        f"Fuel: {last['fuel']} kg | "
        f"Brake Temp: {last['brake_temperature']}°C | "
        f"Recent lap times: {[round(t, 3) for t in lap_trend]} | "
        f"Recent tire wear: {[round(w, 1) for w in wear_trend]}"
    )


def format_lap_time_trend(df: pd.DataFrame) -> str:
    times = df["lap_time"].tail(5).tolist()
    delta = round(times[-1] - times[0], 3)
    direction = f"+{delta}s" if delta > 0 else f"{delta}s"
    return f"{direction} over last 5 laps ({[round(t, 3) for t in times]})"


def format_speed_variance(df: pd.DataFrame) -> float:
    return round(float(df["speed"].tail(10).std()), 2)
