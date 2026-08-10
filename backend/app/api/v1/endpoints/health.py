from fastapi import APIRouter
from datetime import datetime

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "RA Script Backend API",
        "timestamp": datetime.utcnow().isoformat()
    }
