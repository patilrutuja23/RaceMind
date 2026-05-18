from fastapi import APIRouter
from app.services import analytics_service
from app.models.telemetry import TireAnalysis, PerformanceDrop, PitStrategy, RiskScore

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/tire-wear", response_model=TireAnalysis)
def tire_wear():
    return analytics_service.analyze_tire_wear()


@router.get("/performance-drop", response_model=PerformanceDrop)
def performance_drop():
    return analytics_service.detect_performance_drop()


@router.get("/pit-strategy", response_model=PitStrategy)
def pit_strategy():
    return analytics_service.recommend_pit_strategy()


@router.get("/risk-score", response_model=RiskScore)
def risk_score():
    return analytics_service.calculate_risk_score()
