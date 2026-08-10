from app.db.session import Base
from sqlalchemy import Column, String, Integer, Text, Boolean, JSON, DateTime
from datetime import datetime

class ProductIdentityModel(Base):
    __tablename__ = "product_identities"

    id = Column(Integer, primary_key=True, index=True)
    genericName = Column(String, default="Amlodipine Besylate")
    casNumber = Column(String, default="111470-99-6")
    dosageForm = Column(String, default="Immediate-release tablet")
    strengths = Column(String, default="5mg, 2.5mg, 10mg")
    referenceRLD = Column(String, default="Norvasc® (Pfizer) - NDA 019787")
    proposedTradeName = Column(String, default="Amlo-Safe")
    targetMarkets = Column(JSON, default=["US", "EU", "WHO", "BD"])
    createdAt = Column(DateTime, default=datetime.utcnow)
    updatedAt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CTDSectionModel(Base):
    __tablename__ = "ctd_sections"

    id = Column(String, primary_key=True, index=True) # e.g. "3.2.P.1"
    title = Column(String, nullable=False)
    module = Column(String, nullable=False)
    status = Column(String, default="Pending") # Pending | In progress | Draft | Review | Done
    progress = Column(Integer, default=0)
    summary = Column(Text, default="")
    aiNote = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    reviewerDecision = Column(String, nullable=True)
    comments = Column(Text, nullable=True)
    gaps = Column(JSON, default=[]) # list of gap IDs

class RegulatoryGapModel(Base):
    __tablename__ = "regulatory_gaps"

    id = Column(String, primary_key=True, index=True)
    severity = Column(String, nullable=False) # critical | minor
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    authority = Column(String, nullable=False)
    guideline = Column(String, nullable=False)
    section = Column(String, nullable=False)
    correctiveAction = Column(Text, nullable=False)
    status = Column(String, default="open") # open | resolved

class IngestedDocumentModel(Base):
    __tablename__ = "ingested_documents"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, default="PDF")
    category = Column(String, default="Ingested Unclassified")
    size = Column(String, default="1.0 MB")
    uploadDate = Column(String, nullable=False)
    status = Column(String, default="completed") # processing | completed | failed
    moduleClass = Column(String, nullable=True)
    sectionClass = Column(String, nullable=True)
    aiNote = Column(Text, nullable=True)
    extractedData = Column(JSON, nullable=True)

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    user = Column(String, default="dilafrojlija@gmail.com")
    action = Column(String, nullable=False)
    document = Column(String, nullable=True)
    sectionId = Column(String, nullable=True)
    aiSuggestion = Column(Text, nullable=True)
    reviewerDecision = Column(String, nullable=True)

class ConsistencyFindingModel(Base):
    __tablename__ = "consistency_findings"

    id = Column(String, primary_key=True, index=True)
    field = Column(String, nullable=False)
    riskLevel = Column(String, default="high") # high | medium | low
    message = Column(Text, nullable=False)
    details = Column(JSON, nullable=False) # {source, sourceVal, target, targetVal}
    remedy = Column(Text, nullable=False)
