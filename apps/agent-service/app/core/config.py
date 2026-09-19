from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env.local", ".env"),
        extra="ignore",
    )

    node_env: Literal["development", "test", "production"] = Field(
        default="development",
        validation_alias="NODE_ENV",
    )
    service_name: Literal["agent-service"] = Field(
        default="agent-service",
        validation_alias="SERVICE_NAME",
    )
    port: int = Field(default=8000, ge=1, le=65535, validation_alias="PORT")


@lru_cache
def get_settings() -> Settings:
    return Settings()
