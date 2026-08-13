from fastapi import APIRouter
from app.api.v1.endpoints import health, gemini, entities, auth

api_router = APIRouter()
api_router.include_router(health.router, tags=["Health"])
api_router.include_router(auth.router, tags=["Authentication & User Management"])
api_router.include_router(gemini.router, prefix="/gemini", tags=["Gemini AI"])
api_router.include_router(entities.router, tags=["Entities"])
