import os
import time
from typing import Literal

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, HttpUrl


AI_SERVICE_JWT = os.getenv("AI_SERVICE_JWT", "dev-ai-service-token-change-me-32-chars")
MODEL_CACHE_DIR = os.getenv("MODEL_CACHE_DIR", "/models")

app = FastAPI(title="ClearCut AI Inference Service", version="1.0.0")


class Background(BaseModel):
    type: Literal["transparent", "white", "color", "image"] = "transparent"
    value: str | None = None


class RemoveBackgroundRequest(BaseModel):
    sourceUrl: HttpUrl | str
    background: Background = Background()
    model: Literal["u2net", "rmbg", "modnet", "onnx-u2net"] = "rmbg"
    requestId: str | None = None


class RemoveBackgroundResponse(BaseModel):
    url: str
    bytes: int
    mimeType: str
    model: str
    latencyMs: int


def authorize(authorization: str | None = Header(default=None)) -> None:
    if authorization != f"Bearer {AI_SERVICE_JWT}":
        raise HTTPException(status_code=401, detail="Invalid service token")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "clearcut-ai-inference"}


@app.post("/v1/remove-background", response_model=RemoveBackgroundResponse, dependencies=[Depends(authorize)])
def remove_background(payload: RemoveBackgroundRequest) -> RemoveBackgroundResponse:
    started = time.perf_counter()
    # Production path:
    # 1. Download sourceUrl from signed storage.
    # 2. Route to U2Net, RMBG, MODNet, or ONNX session.
    # 3. Compose requested background in Pillow/OpenCV.
    # 4. Store PNG/WebP result in object storage and return CDN URL.
    # This service returns a deterministic placeholder until model weights are mounted.
    latency_ms = int((time.perf_counter() - started) * 1000)
    source = str(payload.sourceUrl)
    return RemoveBackgroundResponse(
        url=f"{source}{'&' if '?' in source else '?'}ai_model={payload.model}&cutout=ready",
        bytes=524288,
        mimeType="image/png",
        model=payload.model,
        latencyMs=latency_ms,
    )
