from fastapi import APIRouter

from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/", response_model=HealthResponse)
def read_root() -> HealthResponse:
    return HealthResponse(service="agent-service", status="ok")


@router.get("/health", response_model=HealthResponse)
def read_health() -> HealthResponse:
    return HealthResponse(service="agent-service", status="ok")
