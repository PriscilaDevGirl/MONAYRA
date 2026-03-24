from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.core.config import settings


app = FastAPI(
    title="Monayra API",
    version="0.1.0",
    summary="Inclusive hiring platform with protected candidate identities.",
    description=(
        "Monayra connects inclusive employers with women, trans women, and travestis "
        "through a bias-aware screening flow that hides sensitive data until hiring."
    ),
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)


@app.get("/", tags=["health"])
def root() -> dict[str, str]:
    return {
        "name": "Monayra API",
        "status": "ok",
        "message": "Inclusive hiring starts with protected identities.",
    }
