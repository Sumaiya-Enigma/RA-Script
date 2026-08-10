from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AnalyzeDocumentRequest(BaseModel):
    documentName: str
    category: Optional[str] = "General"
    customText: Optional[str] = None

class ExtractedData(BaseModel):
    productName: Optional[str] = None
    strength: Optional[str] = None
    dosageForm: Optional[str] = None
    manufacturer: Optional[str] = None
    manufacturingSite: Optional[str] = None
    shelfLife: Optional[str] = None
    storageConditions: Optional[str] = None
    batchSize: Optional[str] = None

class AnalyzeDocumentResponse(BaseModel):
    moduleClass: str
    sectionClass: str
    category: str
    extractedData: ExtractedData
    aiNote: str

class GenerateDraftRequest(BaseModel):
    sectionId: str
    sectionTitle: str
    productInfo: Dict[str, Any]
    marketContext: List[str]

class GenerateDraftResponse(BaseModel):
    draftText: str

class ChatMessage(BaseModel):
    role: str # user | assistant
    content: str

class AssistantChatRequest(BaseModel):
    messages: List[ChatMessage]
    productInfo: Dict[str, Any]
    currentSection: Optional[Dict[str, Any]] = None

class AssistantChatResponse(BaseModel):
    reply: str

class MarketRequirementsRequest(BaseModel):
    market: str
    productInfo: Dict[str, Any]

class MarketRequirementsResponse(BaseModel):
    requirementsText: str
