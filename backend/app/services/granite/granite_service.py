from app.services.telemetry_service import load_telemetry
from app.services.granite.context_formatter import (
    format_telemetry_context,
    format_lap_time_trend,
    format_speed_variance,
)
from app.services.granite.prompts import (
    build_strategy_messages,
    build_coaching_messages,
    build_qa_messages,
)
from app.services.granite.granite_client import call_granite


async def get_strategy_recommendation(
    current_lap: int = 20,
    total_laps: int = 57,
    position: int = 3,
    gap_ahead: str = "+1.842s",
) -> dict:
    df = load_telemetry()
    messages = build_strategy_messages(
        telemetry_context=format_telemetry_context(df),
        current_lap=current_lap,
        total_laps=total_laps,
        position=position,
        gap_ahead=gap_ahead,
    )
    return await call_granite(messages)


async def get_driver_coaching() -> dict:
    df = load_telemetry()
    last = df.iloc[-1]
    messages = build_coaching_messages(
        telemetry_context=format_telemetry_context(df),
        lap_time_trend=format_lap_time_trend(df),
        brake_temperature=float(last["brake_temperature"]),
        speed_variance=format_speed_variance(df),
    )
    return await call_granite(messages)


async def answer_telemetry_question(question: str) -> dict:
    df = load_telemetry()
    messages = build_qa_messages(
        telemetry_context=format_telemetry_context(df),
        question=question,
    )
    return await call_granite(messages)
