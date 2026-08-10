from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class ProductIdentitySchema(BaseModel):
    genericName: str
    casNumber: str
    dosageForm: str
    strengths: str
    referenceRLD: str
    proposedTradeName: str
    targetMarkets: List[str]

    class Config:
        from_attributes = True

class CTDSectionSchema(BaseModel):
    id: str
    title: str
    module: str
    status: str
    progress: int
    summary: str
    aiNote: Optional[str] = None
    content: Optional[str] = None
    reviewerDecision: Optional[str] = None
    comments: Optional[str] = None
    gaps: List[str] = []

    class Config:
        from_attributes = True

class RegulatoryGapSchema(BaseModel):
    id: str
    severity: str
    title: str
    description: str
    authority: str
    guideline: str
    section: str
    correctiveAction: str
    status: str

    class Config:
        from_attributes = True

class IngestedDocumentSchema(BaseModel):
    id: str
    name: str
    type: str
    category: str
    size: str
    uploadDate: str
    status: str
    moduleClass: Optional[str] = None
    sectionClass: Optional[str] = None
    aiNote: Optional[str] = None
    extractedData: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class AuditLogSchema(BaseModel):
    id: str
    timestamp: str
    user: str
    action: str
    document: Optional[str] = None
    sectionId: Optional[str] = None
    aiSuggestion: Optional[str] = None
    reviewerDecision: Optional[str] = None

    class Config:
        from_attributes = True

class ConsistencyFindingSchema(BaseModel):
    id: str
    field: str
    riskLevel: str
    message: str
    details: Dict[str, Any]
    remedy: str

    class Config:
        from_attributes = True
