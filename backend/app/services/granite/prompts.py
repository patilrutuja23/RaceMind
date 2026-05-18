SYSTEM_STRATEGY = (
    "You are RaceMind AI, an expert Formula 1 race strategy analyst powered by IBM Granite. "
    "You analyze real-time telemetry data and provide precise, explainable race strategy recommendations. "
    "Always respond in valid JSON only. No prose, no markdown fences, no explanation outside the JSON."
)

SYSTEM_COACHING = (
    "You are RaceMind AI, a Formula 1 driver performance coach powered by IBM Granite. "
    "Analyze telemetry and provide actionable driver coaching feedback. "
    "Always respond in valid JSON only. No prose, no markdown fences."
)

SYSTEM_QA = (
    "You are RaceMind AI, a Formula 1 telemetry analyst powered by IBM Granite. "
    "Answer questions about race telemetry with precision and technical accuracy. "
    "Always respond in valid JSON only. No prose, no markdown fences."
)

JSON_SCHEMA_STRATEGY = """{
  "recommendation": "<one-sentence action>",
  "explanation": "<2-3 sentence technical explanation>",
  "confidence_score": <0.0-1.0>,
  "what_if_analysis": {
    "if_pit_now": "<projected outcome>",
    "if_stay_out": "<projected outcome>",
    "if_push_harder": "<projected outcome>"
  }
}"""

JSON_SCHEMA_COACHING = """{
  "recommendation": "<primary coaching instruction>",
  "explanation": "<technical breakdown of driver behavior>",
  "confidence_score": <0.0-1.0>,
  "what_if_analysis": {
    "if_brake_earlier": "<projected lap time delta>",
    "if_reduce_tire_stress": "<projected wear improvement>",
    "if_optimal_line": "<projected sector gain>"
  }
}"""

JSON_SCHEMA_QA = """{
  "recommendation": "<direct answer to the question>",
  "explanation": "<detailed technical explanation>",
  "confidence_score": <0.0-1.0>,
  "what_if_analysis": {
    "best_case": "<optimistic scenario>",
    "worst_case": "<pessimistic scenario>",
    "most_likely": "<most probable outcome>"
  }
}"""


def build_strategy_messages(
    telemetry_context: str,
    current_lap: int,
    total_laps: int,
    position: int,
    gap_ahead: str,
) -> list[dict]:
    return [
        {"role": "system", "content": SYSTEM_STRATEGY},
        {
            "role": "user",
            "content": (
                f"Analyze the following telemetry and generate a race strategy recommendation.\n\n"
                f"TELEMETRY: {telemetry_context}\n\n"
                f"SITUATION: Lap {current_lap}/{total_laps}, P{position}, gap ahead: {gap_ahead}\n\n"
                f"Respond with this exact JSON:\n{JSON_SCHEMA_STRATEGY}"
            ),
        },
    ]


def build_coaching_messages(
    telemetry_context: str,
    lap_time_trend: str,
    brake_temperature: float,
    speed_variance: float,
) -> list[dict]:
    return [
        {"role": "system", "content": SYSTEM_COACHING},
        {
            "role": "user",
            "content": (
                f"Driver telemetry for coaching analysis.\n\n"
                f"TELEMETRY: {telemetry_context}\n"
                f"Lap time trend: {lap_time_trend}\n"
                f"Brake temp: {brake_temperature}°C | Speed variance: {speed_variance} km/h\n\n"
                f"Respond with this exact JSON:\n{JSON_SCHEMA_COACHING}"
            ),
        },
    ]


def build_qa_messages(telemetry_context: str, question: str) -> list[dict]:
    return [
        {"role": "system", "content": SYSTEM_QA},
        {
            "role": "user",
            "content": (
                f"TELEMETRY: {telemetry_context}\n\n"
                f"QUESTION: {question}\n\n"
                f"Respond with this exact JSON:\n{JSON_SCHEMA_QA}"
            ),
        },
    ]
