import json
import logging
import re
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

# HuggingFace Inference API — chat completions endpoint
HF_ENDPOINT = (
    f"https://router.huggingface.co/hf-inference/models/"
    f"{settings.hf_model_id}/v1/chat/completions"
)

HEADERS = {
    "Content-Type": "application/json",
}


def _auth_headers() -> dict:
    return {**HEADERS, "Authorization": f"Bearer {settings.hf_api_key}"}


def _extract_json(text: str) -> dict:
    """Extract JSON from model output — handles markdown fences and leading prose."""
    # Strip markdown code fences if present
    text = re.sub(r"```(?:json)?", "", text).strip()
    # Find the first { ... } block
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError(f"No JSON found in model output: {text[:200]}")


async def call_granite(messages: list[dict]) -> dict:
    """Call IBM Granite via HuggingFace Inference API. Falls back to mock on any failure."""
    if settings.hf_api_key == "mock":
        logger.info("HF_API_KEY=mock — returning mock response.")
        return _mock_response()

    payload = {
        "model": settings.hf_model_id,
        "messages": messages,
        "max_tokens": 512,
        "temperature": 0.2,
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=45) as client:
            resp = await client.post(HF_ENDPOINT, json=payload, headers=_auth_headers())
            resp.raise_for_status()
            raw = resp.json()["choices"][0]["message"]["content"].strip()
            logger.debug("Granite raw output: %s", raw[:300])
            return _extract_json(raw)

    except httpx.HTTPStatusError as exc:
        logger.warning(
            "HF API HTTP error %s: %s — using mock.",
            exc.response.status_code,
            exc.response.text[:200],
        )
    except (json.JSONDecodeError, ValueError, KeyError) as exc:
        logger.warning("Failed to parse Granite output (%s) — using mock.", exc)
    except Exception as exc:
        logger.warning("Granite call failed (%s) — using mock.", exc)

    return _mock_response()


def _mock_response() -> dict:
    return {
        "recommendation": "Pit within the next 2 laps due to critical tire degradation.",
        "explanation": (
            "Tire wear has reached 91.2%, exceeding the critical 70% threshold. "
            "Degradation rate of +4.8%/lap over the last 5 laps indicates rear grip loss "
            "adding ~0.4s per lap. Pitting now for Hard compound enables an undercut on P2 "
            "with a projected net gain of +0.8s."
        ),
        "confidence_score": 0.91,
        "what_if_analysis": {
            "if_pit_now": "Projected P2 after undercut. Net gain +0.8s over 10 laps.",
            "if_stay_out": "Lap time degradation +1.2s/lap. Risk of dropping to P5.",
            "if_push_harder": "Accelerated tire failure within 2 laps. High DNF risk.",
        },
    }
