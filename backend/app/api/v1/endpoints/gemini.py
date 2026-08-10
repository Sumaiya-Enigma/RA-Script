from fastapi import APIRouter, HTTPException, status
from app.schemas.gemini import (
    AnalyzeDocumentRequest, AnalyzeDocumentResponse,
    GenerateDraftRequest, GenerateDraftResponse,
    AssistantChatRequest, AssistantChatResponse,
    MarketRequirementsRequest, MarketRequirementsResponse
)
from app.services.gemini_service import (
    analyze_document_service,
    generate_draft_service,
    assistant_chat_service,
    market_requirements_service
)

router = APIRouter()

@router.post("/analyze-document", response_model=AnalyzeDocumentResponse)
async def analyze_document(req: AnalyzeDocumentRequest):
    try:
        res = await analyze_document_service(req.documentName, req.category, req.customText)
        return res
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analyze Document Error: {str(e)}"
        )

@router.post("/generate-draft", response_model=GenerateDraftResponse)
async def generate_draft(req: GenerateDraftRequest):
    try:
        draft_text = await generate_draft_service(req.sectionId, req.sectionTitle, req.productInfo, req.marketContext)
        return {"draftText": draft_text}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Generate Draft Error: {str(e)}"
        )

@router.post("/assistant-chat", response_model=AssistantChatResponse)
async def assistant_chat(req: AssistantChatRequest):
    try:
        messages_dict = [{"role": m.role, "content": m.content} for m in req.messages]
        reply = await assistant_chat_service(messages_dict, req.productInfo, req.currentSection)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Assistant Chat Error: {str(e)}"
        )

@router.post("/market-requirements", response_model=MarketRequirementsResponse)
async def market_requirements(req: MarketRequirementsRequest):
    try:
        text = await market_requirements_service(req.market, req.productInfo)
        return {"requirementsText": text}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Market Requirements Error: {str(e)}"
        )
