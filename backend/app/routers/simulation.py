from fastapi import APIRouter
from app.models.telemetry import SimulationResult
from app.services.simulation.simulation_engine import run_simulation

router = APIRouter(prefix="/simulation", tags=["Simulation"])


@router.get("/what-if", response_model=SimulationResult)
def what_if():
    return run_simulation()
