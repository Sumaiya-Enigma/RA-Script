export interface ProductIdentity {
  genericName: string;
  casNumber: string;
  dosageForm: string;
  strengths: string;
  referenceRLD: string;
  proposedTradeName: string;
  targetMarkets: string[];
}

export type SectionStatus = 'Pending' | 'In progress' | 'Draft' | 'Review' | 'Done';

export interface CTDSection {
  id: string;
  title: string;
  module: string;
  status: SectionStatus;
  progress: number;
  summary: string;
  aiNote?: string;
  content?: string;
  reviewerDecision?: string;
  comments?: string;
  gaps: string[];
}

export interface RegulatoryGap {
  id: string;
  severity: 'critical' | 'minor';
  title: string;
  description: string;
  authority: string;
  guideline: string;
  section: string;
  correctiveAction: string;
  status: 'open' | 'resolved';
}

export interface IngestedDocument {
  id: string;
  name: string;
  type: string;
  category: string;
  size: string;
  uploadDate: string;
  status: 'processing' | 'completed' | 'failed';
  moduleClass?: string;
  sectionClass?: string;
  aiNote?: string;
  extractedData?: {
    productName?: string;
    strength?: string;
    dosageForm?: string;
    manufacturer?: string;
    manufacturingSite?: string;
    shelfLife?: string;
    storageConditions?: string;
    batchSize?: string;
    [key: string]: any;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  document?: string;
  action: string;
  sectionId?: string;
  aiSuggestion?: string;
  reviewerDecision?: string;
}

export interface ConsistencyFinding {
  id: string;
  field: string;
  riskLevel: 'high' | 'medium' | 'low';
  message: string;
  details: {
    source: string;
    sourceVal: string;
    target: string;
    targetVal: string;
  };
  remedy: string;
}
