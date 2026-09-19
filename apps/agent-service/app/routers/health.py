from fastapi import APIRouter

from app.core.config import get_settings
from app.schemas.health import HealthResponse

router = APIRouter()


@router.get("/", response_model=HealthResponse)
def read_root() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(service=settings.service_name, status="ok")


@router.get("/health", response_model=HealthResponse)
def read_health() -> HealthResponse:
    settings = get_settings()
    return HealthResponse(service=settings.service_name, status="ok")
