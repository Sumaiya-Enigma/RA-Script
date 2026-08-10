'use client';

import React from 'react';
import { ConsistencyFinding, ProductIdentity } from '../types';
import { ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, FileText } from 'lucide-react';

interface ConsistencyEngineProps {
  productInfo: ProductIdentity;
  findings: ConsistencyFinding[];
  setFindings: React.Dispatch<React.SetStateAction<ConsistencyFinding[]>>;
  onLogAudit: (action: string, document?: string, details?: string) => void;
  onUpdateSectionSummary: (sectionId: string, newSummary: string) => void;
}

export default function ConsistencyEngine({
  productInfo,
  findings,
  setFindings,
  onLogAudit,
  onUpdateSectionSummary
}: ConsistencyEngineProps) {

  const handleResolveFinding = (findingId: string) => {
    const finding = findings.find(f => f.id === findingId);
    if (!finding) return;

    onLogAudit('Resolved Document Consistency Finding', finding.field, `Aligned to ${finding.details.sourceVal}`);
    setFindings(prev => prev.filter(f => f.id !== findingId));

    if (finding.field === 'Shelf Life') {
      onUpdateSectionSummary('Labeling', `Product label draft updated to 24-month shelf life to remain compliant with ICH stability records (3.2.P.8). Aligned with guidelines.`);
    }

    alert(`Successfully resolved ${finding.field} discrepancy! Discrepant records have been corrected to match "${finding.details.sourceVal}". GxP audit trail generated.`);
  };

  const highRisk = findings.filter(f => f.riskLevel === 'high');

  return (
    <div className="space-y-6" id="consistency-engine-container">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider">Cross-Document Consistency Engine</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Automatically parses and cross-checks data points across all ingested LIMS, QMS, DMF, stability reports, and artwork label files.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[10px] font-bold rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1">
            <ShieldAlert className="h-3 w-3" /> {highRisk.length} High Risk Conflicts
          </span>
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> 4 Ingestion Points Matched
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {findings.map((f) => (
          <div 
            key={f.id}
            className={`border rounded-xl p-5 shadow-2xs relative overflow-hidden ${
              f.riskLevel === 'high' 
                ? 'border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/20' 
                : 'border-amber-200 dark:border-amber-900 bg-amber-50/10 dark:bg-amber-950/10'
            }`}
          >
            <div className="flex justify-between items-start gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                  f.riskLevel === 'high' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                }`}>
                  {f.riskLevel} Risk discrepancy
                </span>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Conflict Detected: {f.field}</h3>
              </div>
              <button
                onClick={() => handleResolveFinding(f.id)}
                className="px-3 py-1 bg-slate-950 dark:bg-slate-800 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg shadow-3xs cursor-pointer transition-all flex items-center gap-1"
              >
                Auto-Correct Record <RefreshCw className="h-3 w-3" />
              </button>
            </div>

            <p className="text-xs text-gray-600 dark:text-slate-300 mt-2 font-medium">{f.message}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg flex items-center justify-between shadow-3xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase">
                    <FileText className="h-3.5 w-3.5 text-slate-500" /> Document A
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-slate-200">{f.details.source}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 block font-semibold uppercase">Value</span>
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">{f.details.sourceVal}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-lg flex items-center justify-between shadow-3xs">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-slate-500 font-semibold uppercase">
                    <FileText className="h-3.5 w-3.5 text-slate-500" /> Document B
                  </div>
                  <p className="text-xs font-bold text-gray-700 dark:text-slate-200">{f.details.target}</p>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 block font-semibold uppercase">Value</span>
                  <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-800 animate-pulse">{f.details.targetVal}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white/50 dark:bg-slate-900/50 border border-gray-150 dark:border-slate-800 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className={`h-4.5 w-4.5 ${f.riskLevel === 'high' ? 'text-rose-500' : 'text-amber-500'}`} />
              <p className="text-gray-600 dark:text-slate-300 leading-normal">
                <strong>Corrective Action Needed:</strong> {f.remedy}
              </p>
            </div>
          </div>
        ))}

        {findings.length === 0 && (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-8 text-center text-gray-400 dark:text-slate-500 flex flex-col items-center justify-center min-h-[220px] gap-2">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 rounded-full text-emerald-600 dark:text-emerald-400 border border-emerald-150 dark:border-emerald-800">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="text-xs font-bold text-gray-800 dark:text-slate-200 mt-2">Dossier Consistency Verified</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 max-w-[320px]">
              No active cross-document value conflicts found. All parameters are fully aligned.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider mb-3">Verified Constant Checkpoints</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-150 dark:border-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">Active Substance</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">{productInfo.genericName}</p>
            </div>
          </div>
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-150 dark:border-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">Manufacturer Site</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Brooklyn, NY FEI Match</p>
            </div>
          </div>
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-150 dark:border-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">Strengths Matching</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">{productInfo.strengths}</p>
            </div>
          </div>
          <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-lg border border-emerald-150 dark:border-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-bold text-emerald-900 dark:text-emerald-200">Dosage Form Class</p>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Immediate-release tablet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
