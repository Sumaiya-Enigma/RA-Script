import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.api.v1.router import api_router
from app.db.session import engine, Base
from app.models import (
    ProductIdentityModel, CTDSectionModel, RegulatoryGapModel,
    IngestedDocumentModel, AuditLogModel, ConsistencyFindingModel
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rascript_backend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing database tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created/verified successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
    yield
    logger.info("Shutting down RA Script backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# Set CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled error on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc) or "An internal server error occurred."}
    )

# Include API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Legacy alias for direct health check compatibility
@app.get("/api/health")
async def legacy_health_check():
    return {"status": "ok", "message": "RA Script Backend active"}
