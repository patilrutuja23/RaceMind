from fastapi import APIRouter
from app.services import telemetry_service
from app.models.telemetry import LapRecord, TireStatus, SpeedRecord, RaceStatus

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])


@router.get("/laps", response_model=list[LapRecord])
def get_laps():
    return telemetry_service.get_all_laps()


@router.get("/tires", response_model=list[TireStatus])
def get_tires():
    return telemetry_service.get_tire_data()


@router.get("/speed", response_model=list[SpeedRecord])
def get_speed():
    return telemetry_service.get_speed_data()


@router.get("/status", response_model=RaceStatus)
def get_status():
    return telemetry_service.get_race_status()
