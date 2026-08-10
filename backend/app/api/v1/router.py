from fastapi import APIRouter
from app.api.v1.endpoints import health, gemini, entities

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(gemini.router, prefix="/gemini", tags=["Gemini AI"])
api_router.include_router(entities.router, tags=["Entities"])
