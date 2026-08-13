'use client';

import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar, { TabType } from '../components/Sidebar';
import AuthModal from '../components/AuthModal';
import UserProfileModal from '../components/UserProfileModal';
import { 
  ProductIdentity, 
  CTDSection, 
  RegulatoryGap, 
  IngestedDocument, 
  AuditLog, 
  ConsistencyFinding 
} from '../types';

import DossierIntake from '../components/DossierIntake';
import DossierWorkspace from '../components/DossierWorkspace';
import DocumentManager from '../components/DocumentManager';
import RegulatoryWriter from '../components/RegulatoryWriter';
import ConsistencyEngine from '../components/ConsistencyEngine';
import ComplianceRules from '../components/ComplianceRules';
import AuditTrailView from '../components/AuditTrailView';
import ECTDPublisher from '../components/eCTDPublisher';

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<TabType>('workspace');
  
  const [productInfo, setProductInfo] = useState<ProductIdentity>({
    genericName: 'Amlodipine Besylate',
    casNumber: '111470-99-6',
    dosageForm: 'Immediate-release tablet',
    strengths: '5mg, 2.5mg, 10mg',
    referenceRLD: 'Norvasc® (Pfizer) - NDA 019787',
    proposedTradeName: 'Amlo-Safe',
    targetMarkets: ['US', 'EU', 'WHO', 'BD']
  });

  const [routingSectionId, setRoutingSectionId] = useState<string>('3.2.P.3');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 'log-1', timestamp: '07/13/2026 09:30 AM', user: 'dilafrojlija@gmail.com', action: 'System Initialized (GxP Enforced)', document: 'RA Script System Core' },
    { id: 'log-2', timestamp: '07/13/2026 09:32 AM', user: 'dilafrojlija@gmail.com', action: 'Ingested Reddy API Chemical Profile (DMF)', document: 'Certificate_of_Analysis_API.pdf' },
    { id: 'log-3', timestamp: '07/13/2026 10:25 AM', user: 'dilafrojlija@gmail.com', action: 'Synchronized LIMS Stability Records (24 Months)', document: 'Stability_Report_Batch_A102.pdf' },
    { id: 'log-4', timestamp: '07/13/2026 11:20 AM', user: 'dilafrojlija@gmail.com', action: 'AI classification: mapped stability report to 3.2.P.8', document: 'Stability_Report_Batch_A102.pdf' }
  ]);

  const logAuditAction = (action: string, document?: string, details?: string) => {
    const newLog: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: 'dilafrojlija@gmail.com',
      action,
      document,
      aiSuggestion: details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const [gaps, setGaps] = useState<RegulatoryGap[]>([
    {
      id: 'gap-1',
      severity: 'critical',
      title: 'Missing Process Validation Strategy (3.2.P.3.5)',
      description: 'Process validation strategy section (3.2.P.3.5) is missing. FDA requires a description of the validation approach — either a completed validation summary or a commitment to validate. Upload validation protocol or provide commitment statement to resolve.',
      authority: 'US FDA',
      guideline: 'ICH Q8 / 21 CFR 211.100',
      section: '3.2.P.3',
      correctiveAction: 'Draft a Process Validation Commitment letter or upload validation protocol to Section 3.2.P.3.5.',
      status: 'open'
    },
    {
      id: 'gap-2',
      severity: 'minor',
      title: 'Microcrystalline Cellulose USP Specification Mismatch',
      description: 'Microcrystalline cellulose specification references USP <776> particle size test but no data was provided from your supplier CoA. Confirm whether this test was performed — if not, either add data or remove the test from the specification to avoid an information request.',
      authority: 'US FDA',
      guideline: 'USP Monograph / ICH Q6A',
      section: '3.2.P.4',
      correctiveAction: 'Update MCC testing spec records or attach additional supplier test reports.',
      status: 'open'
    },
    {
      id: 'gap-3',
      severity: 'minor',
      title: 'Dissolution Specification Buffer Mismatch',
      description: 'FDA dissolution database shows the recommended method for Amlodipine Besylate 5mg is 900mL 0.1N HCl, Apparatus 2 at 50 rpm, Q=80% at 30 min. Your LIMS records show a different medium (pH 6.8 phosphate buffer). Cross-check with your BE study protocol — the dissolution method must align.',
      authority: 'US FDA',
      guideline: 'FDA Dissolution Database / USP <711>',
      section: '3.2.P.5',
      correctiveAction: 'Update specification parameters to 0.1N HCl or draft technical scientific justification for alternative buffer selection in 3.2.P.5.6.',
      status: 'open'
    },
    {
      id: 'gap-4',
      severity: 'critical',
      title: 'Shelf Life Label Discrepancy',
      description: 'The product artwork label draft (v1) claims a shelf life of 36 months, but stability study (3.2.P.8) only supports 24 months. This represents a major compliance risk that will trigger immediate refusal to file.',
      authority: 'US FDA',
      guideline: 'FDA 21 CFR 201.56',
      section: 'Labeling',
      correctiveAction: 'Update labeling artwork draft to claim 24 months shelf life, or provide extended 36-month long-term stability data.',
      status: 'open'
    }
  ]);

  const resolveGap = (gapId: string) => {
    setGaps(prev => prev.map(g => g.id === gapId ? { ...g, status: 'resolved' } : g));
    logAuditAction('Regulatory Gap Resolved', gaps.find(g => g.id === gapId)?.title || gapId);
  };

  const [consistencyFindings, setConsistencyFindings] = useState<ConsistencyFinding[]>([
    {
      id: 'cf-1',
      field: 'Shelf Life',
      riskLevel: 'high',
      message: 'Product artwork label claims 36 months shelf life, but official stability testing records only demonstrate 24 months.',
      details: {
        source: 'Stability Study Report (doc-1)',
        sourceVal: '24 Months',
        target: 'Labeling Artwork Draft (doc-4)',
        targetVal: '36 Months'
      },
      remedy: 'Amend Labeling Artwork Draft (v1) to reference 24-month shelf life to avoid an immediate FDA Refusal to File.'
    }
  ]);

  const [documents, setDocuments] = useState<IngestedDocument[]>([
    {
      id: 'doc-1',
      name: 'Stability_Report_Batch_A102.pdf',
      type: 'PDF',
      category: 'Stability Report',
      size: '12.4 MB',
      uploadDate: '07/13/2026 10:20 AM',
      status: 'completed',
      moduleClass: 'Module 3',
      sectionClass: '3.2.P.8',
      extractedData: {
        productName: 'Amlodipine Besylate',
        strength: '5mg',
        dosageForm: 'Tablet',
        manufacturer: 'Apex Pharmaceutical Corp',
        manufacturingSite: 'Brooklyn, NY',
        shelfLife: '24 Months',
        storageConditions: 'Store below 25C (excursions permitted 15-30C)',
        batchSize: '100,000 tablets'
      },
      aiNote: 'ICH Q1A zone II accelerated stability study complete. 24 Months long term testing supports proposed shelf life.'
    },
    {
      id: 'doc-2',
      name: 'Certificate_of_Analysis_API.pdf',
      type: 'PDF',
      category: 'CoA',
      size: '2.1 MB',
      uploadDate: '07/13/2026 11:15 AM',
      status: 'completed',
      moduleClass: 'Module 3',
      sectionClass: '3.2.S.4.1',
      extractedData: {
        productName: 'Amlodipine Besylate API',
        strength: 'Pure API',
        dosageForm: 'Powder',
        manufacturer: "Dr. Reddy's Laboratories",
        manufacturingSite: 'Srikakulam, India',
        shelfLife: '60 Months',
        storageConditions: 'Store in airtight containers below 30C',
        batchSize: '50 kg'
      },
      aiNote: 'Supplier API matches USP monographs. Melting point and particle size parameters aligned.'
    },
    {
      id: 'doc-3',
      name: 'Batch_Manufacturing_Record_B441.pdf',
      type: 'PDF',
      category: 'Batch Record',
      size: '45.8 MB',
      uploadDate: '07/13/2026 09:30 AM',
      status: 'completed',
      moduleClass: 'Module 3',
      sectionClass: '3.2.P.3',
      extractedData: {
        productName: 'Amlodipine Besylate',
        strength: '5mg',
        dosageForm: 'Tablet',
        manufacturer: 'Apex Pharmaceutical Corp',
        manufacturingSite: 'Brooklyn, NY',
        shelfLife: 'N/A',
        storageConditions: 'Standard facility requirements',
        batchSize: '100,000 tablets'
      },
      aiNote: 'Master formula verified. Standard wet granulation process utilized with MCC and Sodium Starch Glycolate.'
    },
    {
      id: 'doc-4',
      name: 'Labeling_Draft_v1.docx',
      type: 'DOCX',
      category: 'Packaging Artwork',
      size: '1.4 MB',
      uploadDate: '07/13/2026 02:40 PM',
      status: 'completed',
      moduleClass: 'Module 1',
      sectionClass: 'Labeling',
      extractedData: {
        productName: 'Amlo-Safe',
        strength: '5mg',
        dosageForm: 'Tablet',
        manufacturer: 'Apex Pharmaceutical Corp',
        manufacturingSite: 'Brooklyn, NY',
        shelfLife: '36 Months',
        storageConditions: 'Store between 20-25C (68-77F)',
        batchSize: 'N/A'
      },
      aiNote: 'Draft product label contains a 36-month shelf life claim, conflicting with the 24-month long-term stability test record.'
    }
  ]);

  const [sections, setSections] = useState<CTDSection[]>([
    {
      id: '3.2.P.1',
      title: 'Description and Composition of the Drug Product',
      module: 'Module 3',
      status: 'Done',
      progress: 100,
      summary: 'Tablet composition, function of excipients, and reference to RLD Norvasc 5mg fully documented. No gaps.',
      gaps: []
    },
    {
      id: '3.2.P.2',
      title: 'Pharmaceutical Development',
      module: 'Module 3',
      status: 'Done',
      progress: 100,
      summary: 'Physicochemical and biopharmaceutical properties characterized. Dissolution profile compared to Norvasc 5mg. Satisfied under Q8.',
      gaps: []
    },
    {
      id: '3.2.P.3',
      title: 'Manufacture',
      module: 'Module 3',
      status: 'In progress',
      progress: 78,
      summary: 'Process flow diagram drafted by AI. Batch formula and in-process controls populated from LIMS.',
      gaps: ['gap-1']
    },
    {
      id: '3.2.P.4',
      title: 'Control of Excipients',
      module: 'Module 3',
      status: 'Review',
      progress: 45,
      summary: 'AI drafted specifications for all 6 excipients from USP monographs. Novel excipient check: none flagged.',
      gaps: ['gap-2']
    },
    {
      id: '3.2.P.5',
      title: 'Control of Drug Product',
      module: 'Module 3',
      status: 'In progress',
      progress: 60,
      summary: 'Specifications table being generated. Release and shelf-life limits being populated from approved QC specs in LIMS.',
      gaps: ['gap-3']
    },
    {
      id: '3.2.P.8',
      title: 'Stability',
      module: 'Module 3',
      status: 'Review',
      progress: 90,
      summary: 'Stability study data parsed. Shelf life estimated based on 24 months long term testing records.',
      gaps: []
    },
    {
      id: 'Module 1',
      title: 'Administrative Information',
      module: 'Module 1',
      status: 'Done',
      progress: 100,
      summary: 'FDA cover letter, Form 356h, local registration forms, and manufacturer GMP clearances compiled.',
      gaps: []
    },
    {
      id: 'Module 2',
      title: 'Summaries',
      module: 'Module 2',
      status: 'Review',
      progress: 95,
      summary: 'Quality Overall Summary (QOS) drafted. Clinical and Nonclinical written summaries compiled.',
      gaps: []
    },
    {
      id: 'Module 4',
      title: 'Nonclinical Study Reports',
      module: 'Module 4',
      status: 'Done',
      progress: 100,
      summary: 'Toxicology, pharmacokinetics, safety pharmacology, and genotoxicity profiles verified.',
      gaps: []
    },
    {
      id: 'Module 5',
      title: 'Clinical Study Reports',
      module: 'Module 5',
      status: 'Review',
      progress: 80,
      summary: 'Fasting and Fed Bioequivalence study report narratives parsed. Biowaiver request drafted for lower strengths.',
      gaps: []
    },
    {
      id: 'Labeling',
      title: 'Labeling and Product Artwork',
      module: 'Labeling',
      status: 'In progress',
      progress: 50,
      summary: 'Draft Patient Information Leaflet (PIL), package labels, and cartoon artwork. Mismatch flag active on shelf life.',
      gaps: ['gap-4']
    }
  ]);

  const [selectedModule, setSelectedModule] = useState<string>('Module 3');

  const handleSelectSectionForDrafting = (sectionId: string) => {
    setRoutingSectionId(sectionId);
    setSelectedTab('writer');
  };

  const handleUpdateSections = (sectionId: string, summary: string, aiNote: string, status: 'Review' | 'Done' | 'Draft') => {
    setSections(prev => prev.map(s => {
      if (s.id === sectionId) {
        return {
          ...s,
          status,
          summary,
          aiNote,
          progress: status === 'Done' ? 100 : 90
        };
      }
      return s;
    }));
  };

  const handleUpdateSectionSummary = (sectionId: string, summary: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, summary } : s));
  };

  const handleViewGaps = () => {
    setSelectedTab('compliance');
  };

  const activeGapsCount = gaps.filter(g => g.status === 'open').length;
  const consistencyFlagsCount = consistencyFindings.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors" id="main-app-shell">
      <Header />
      <AuthModal />
      <UserProfileModal />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-6">
        <Sidebar
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          documentsCount={documents.length}
          sectionsCount={sections.length}
          consistencyFlagsCount={consistencyFlagsCount}
          activeGapsCount={activeGapsCount}
          auditLogsCount={auditLogs.length}
        />

        <main className="flex-1 min-w-0">
          {selectedTab === 'intake' && (
            <DossierIntake 
              productInfo={productInfo} 
              setProductInfo={setProductInfo} 
              onNext={() => setSelectedTab('workspace')} 
            />
          )}

          {selectedTab === 'workspace' && (
            <DossierWorkspace
              productInfo={productInfo}
              sections={sections}
              gaps={gaps}
              selectedModule={selectedModule}
              setSelectedModule={setSelectedModule}
              onSelectSectionForDrafting={handleSelectSectionForDrafting}
              onViewGaps={handleViewGaps}
              onResolveGap={resolveGap}
            />
          )}

          {selectedTab === 'documents' && (
            <DocumentManager
              documents={documents}
              setDocuments={setDocuments}
              productInfo={productInfo}
              onLogAudit={logAuditAction}
              onUpdateSections={handleUpdateSections}
            />
          )}

          {selectedTab === 'writer' && (
            <RegulatoryWriter
              productInfo={productInfo}
              sections={sections}
              setSections={setSections}
              initialSectionId={routingSectionId}
              onLogAudit={logAuditAction}
            />
          )}

          {selectedTab === 'consistency' && (
            <ConsistencyEngine
              productInfo={productInfo}
              findings={consistencyFindings}
              setFindings={setConsistencyFindings}
              onLogAudit={logAuditAction}
              onUpdateSectionSummary={handleUpdateSectionSummary}
            />
          )}

          {selectedTab === 'compliance' && (
            <ComplianceRules
              productInfo={productInfo}
              gaps={gaps}
              onResolveGap={resolveGap}
            />
          )}

          {selectedTab === 'audit' && (
            <AuditTrailView
              logs={auditLogs}
              onLogAudit={logAuditAction}
            />
          )}

          {selectedTab === 'publishing' && (
            <ECTDPublisher
              productInfo={productInfo}
              sections={sections}
              gaps={gaps}
            />
          )}
        </main>
      </div>

      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 text-center py-4 text-[10px] text-gray-500 dark:text-slate-400 font-medium">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 RA Script Assistant &bull; GxP Computerized System validated &bull; US FDA 21 CFR Part 11 compliant digital signatures</p>
          <p className="mt-1">Designed exclusively for regulatory experts and quality managers.</p>
        </div>
      </footer>
    </div>
  );
}
