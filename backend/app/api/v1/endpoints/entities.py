from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from app.db.session import get_db
from app.models import (
    ProductIdentityModel, CTDSectionModel, RegulatoryGapModel,
    IngestedDocumentModel, AuditLogModel, ConsistencyFindingModel
)
from app.schemas.entities import (
    ProductIdentitySchema, CTDSectionSchema, RegulatoryGapSchema,
    IngestedDocumentSchema, AuditLogSchema, ConsistencyFindingSchema
)

router = APIRouter()

# ----------------- Product Identity -----------------
@router.get("/product", response_model=ProductIdentitySchema)
async def get_product(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProductIdentityModel))
    prod = result.scalars().first()
    if not prod:
        prod = ProductIdentityModel()
        db.add(prod)
        await db.commit()
        await db.refresh(prod)
    return prod

@router.put("/product", response_model=ProductIdentitySchema)
async def update_product(payload: ProductIdentitySchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ProductIdentityModel))
    prod = result.scalars().first()
    if not prod:
        prod = ProductIdentityModel(**payload.model_dump())
        db.add(prod)
    else:
        for k, v in payload.model_dump().items():
            setattr(prod, k, v)
    await db.commit()
    await db.refresh(prod)
    return prod

# ----------------- Documents -----------------
@router.get("/documents", response_model=List[IngestedDocumentSchema])
async def get_documents(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IngestedDocumentModel))
    return result.scalars().all()

@router.post("/documents", response_model=IngestedDocumentSchema)
async def create_document(doc: IngestedDocumentSchema, db: AsyncSession = Depends(get_db)):
    db_doc = IngestedDocumentModel(**doc.model_dump())
    db.add(db_doc)
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

@router.put("/documents/{doc_id}", response_model=IngestedDocumentSchema)
async def update_document(doc_id: str, doc: IngestedDocumentSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(IngestedDocumentModel).where(IngestedDocumentModel.id == doc_id))
    db_doc = result.scalars().first()
    if not db_doc:
        db_doc = IngestedDocumentModel(**doc.model_dump())
        db.add(db_doc)
    else:
        for k, v in doc.model_dump().items():
            setattr(db_doc, k, v)
    await db.commit()
    await db.refresh(db_doc)
    return db_doc

# ----------------- CTD Sections -----------------
@router.get("/sections", response_model=List[CTDSectionSchema])
async def get_sections(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CTDSectionModel))
    return result.scalars().all()

@router.put("/sections/{section_id}", response_model=CTDSectionSchema)
async def update_section(section_id: str, sec: CTDSectionSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(CTDSectionModel).where(CTDSectionModel.id == section_id))
    db_sec = result.scalars().first()
    if not db_sec:
        db_sec = CTDSectionModel(**sec.model_dump())
        db.add(db_sec)
    else:
        for k, v in sec.model_dump().items():
            setattr(db_sec, k, v)
    await db.commit()
    await db.refresh(db_sec)
    return db_sec

# ----------------- Regulatory Gaps -----------------
@router.get("/gaps", response_model=List[RegulatoryGapSchema])
async def get_gaps(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RegulatoryGapModel))
    return result.scalars().all()

@router.put("/gaps/{gap_id}", response_model=RegulatoryGapSchema)
async def update_gap(gap_id: str, gap: RegulatoryGapSchema, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RegulatoryGapModel).where(RegulatoryGapModel.id == gap_id))
    db_gap = result.scalars().first()
    if not db_gap:
        db_gap = RegulatoryGapModel(**gap.model_dump())
        db.add(db_gap)
    else:
        for k, v in gap.model_dump().items():
            setattr(db_gap, k, v)
    await db.commit()
    await db.refresh(db_gap)
    return db_gap

# ----------------- Audit Logs -----------------
@router.get("/audit", response_model=List[AuditLogSchema])
async def get_audit_logs(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AuditLogModel))
    logs = result.scalars().all()
    return logs

@router.post("/audit", response_model=AuditLogSchema)
async def create_audit_log(log: AuditLogSchema, db: AsyncSession = Depends(get_db)):
    db_log = AuditLogModel(**log.model_dump())
    db.add(db_log)
    await db.commit()
    await db.refresh(db_log)
    return db_log

# ----------------- Consistency Findings -----------------
@router.get("/consistency", response_model=List[ConsistencyFindingSchema])
async def get_consistency_findings(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ConsistencyFindingModel))
    return result.scalars().all()

@router.delete("/consistency/{finding_id}")
async def delete_consistency_finding(finding_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ConsistencyFindingModel).where(ConsistencyFindingModel.id == finding_id))
    db_item = result.scalars().first()
    if db_item:
        await db.delete(db_item)
        await db.commit()
    return {"status": "success", "id": finding_id}
