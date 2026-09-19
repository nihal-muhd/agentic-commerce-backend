from datetime import UTC, datetime
from typing import Any

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import get_settings


def register_exception_handlers(app: FastAPI) -> None:
    app.add_exception_handler(HTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, unhandled_exception_handler)


async def http_exception_handler(
    request: Request,
    exception: HTTPException,
) -> JSONResponse:
    return error_response(
        request=request,
        status_code=exception.status_code,
        code="HTTP_ERROR",
        message=exception.detail,
    )


async def validation_exception_handler(
    request: Request,
    exception: RequestValidationError,
) -> JSONResponse:
    return error_response(
        request=request,
        status_code=422,
        code="VALIDATION_ERROR",
        message=str(exception),
    )


async def unhandled_exception_handler(
    request: Request,
    exception: Exception,
) -> JSONResponse:
    return error_response(
        request=request,
        status_code=500,
        code="INTERNAL_SERVER_ERROR",
        message="Internal server error",
    )


def error_response(
    request: Request,
    status_code: int,
    code: str,
    message: Any,
) -> JSONResponse:
    settings = get_settings()

    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "statusCode": status_code,
            "code": code,
            "message": message,
            "path": request.url.path,
            "timestamp": datetime.now(UTC).isoformat(),
            "service": settings.service_name,
        },
    )
