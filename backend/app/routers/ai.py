from fastapi import APIRouter
from app.models.telemetry import GraniteResponse, QuestionRequest, StrategyRequest
from app.services.granite import granite_service

router = APIRouter(prefix="/ai", tags=["AI — IBM Granite"])


@router.post("/strategy", response_model=GraniteResponse)
async def strategy(req: StrategyRequest):
    return await granite_service.get_strategy_recommendation(
        current_lap=req.current_lap,
        total_laps=req.total_laps,
        position=req.position,
        gap_ahead=req.gap_ahead,
    )


@router.get("/coaching", response_model=GraniteResponse)
async def coaching():
    return await granite_service.get_driver_coaching()


@router.post("/ask", response_model=GraniteResponse)
async def ask(req: QuestionRequest):
    return await granite_service.answer_telemetry_question(req.question)
