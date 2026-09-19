from fastapi import FastAPI

from app.core.config import get_settings
from app.core.errors import register_exception_handlers
from app.routers import health

settings = get_settings()

app = FastAPI(
    title="AI Agent Service",
    version="0.1.0",
)

register_exception_handlers(app)
app.include_router(health.router)
