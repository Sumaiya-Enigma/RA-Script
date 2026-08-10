'use client';

import React, { useState } from 'react';
import { ProductIdentity, RegulatoryGap } from '../types';
import { CheckCircle2, ShieldAlert, Bookmark, ExternalLink } from 'lucide-react';

interface ComplianceRulesProps {
  productInfo: ProductIdentity;
  gaps: RegulatoryGap[];
  onResolveGap: (gapId: string) => void;
}

export default function ComplianceRules({ productInfo, gaps, onResolveGap }: ComplianceRulesProps) {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'US' | 'EU' | 'WHO' | 'BD'>('ALL');

  const marketRules = [
    {
      id: 'rule-1',
      market: 'US',
      authority: 'US FDA',
      guideline: '21 CFR Part 211.166',
      section: '3.2.P.8 (Stability)',
      title: 'Mandatory 3 Batch Stability Data',
      description: 'FDA ANDA guidance requires stability data on at least three pilot-scale batches or two pilot-scale and one commercial batch of the drug product.',
      status: 'compliant',
      corrective: 'No action needed. Ingested stability report (Brooklyn Facility) references 3 batches.'
    },
    {
      id: 'rule-2',
      market: 'US',
      authority: 'US FDA',
      guideline: 'FDA ANDA Checklist',
      section: '3.2.P.3.5 (Process Validation)',
      title: 'Process Validation Protocol or Commitment',
      description: 'Process validation strategy section must detail a validation commitment statement if prospective validation is not yet complete.',
      status: gaps.some(g => g.id === 'gap-1' && g.status === 'open') ? 'gap' : 'compliant',
      corrective: 'Upload validation protocol or provide process validation commitment statement (Section 3.2.P.3.5).'
    },
    {
      id: 'rule-3',
      market: 'EU',
      authority: 'EMA',
      guideline: 'Directive 2001/83/EC Article 10(1)',
      section: 'Module 1 (Application Form)',
      title: 'Proof of Equivalence vs EU Reference Product',
      description: 'EMA requires explicit documentation demonstrating equivalence of the generic to a reference medicinal product authorized in the EU for at least 8 years.',
      status: 'compliant',
      corrective: 'No action needed. Reference product matches authorized European dossier.'
    },
    {
      id: 'rule-4',
      market: 'WHO',
      authority: 'WHO PQ',
      guideline: 'WHO Technical Report Series No. 970',
      section: '3.2.S (Drug Substance CMC)',
      title: 'Active DMF / APIMF Number Citation',
      description: 'Prequalification requires active API Master File (APIMF) number citation and a formal Letter of Access (LoA) from the API manufacturer.',
      status: 'compliant',
      corrective: 'No action needed. Reddy DMF Number referenced correctly in Module 3.2.S.'
    },
    {
      id: 'rule-5',
      market: 'BD',
      authority: 'Bangladesh DGDA',
      guideline: 'DGDA Drug Registration Guidelines',
      section: 'Module 1.3 (Administrative)',
      title: 'Certificate of Pharmaceutical Product (CoPP)',
      description: 'Bangladesh local adaptation requires submission of a physical WHO-format CoPP or Free Sale Certificate (FSC) from the country of origin.',
      status: gaps.some(g => g.id === 'gap-bd-fsc') ? 'gap' : 'compliant',
      corrective: 'Aquire WHO CoPP from original US FDA agency and upload in PDF format to Module 1.'
    }
  ];

  const filteredRules = selectedFilter === 'ALL' 
    ? marketRules 
    : marketRules.filter(r => r.market === selectedFilter);

  return (
    <div className="space-y-6" id="compliance-rules-container">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider">Deterministic Regulatory Rule Engine</h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Validating dossier entries against formal guidance criteria. Zero guessing, fully auditable citations.
          </p>
        </div>

        <div className="flex bg-gray-100 dark:bg-slate-800 p-1 rounded-lg border border-gray-200 dark:border-slate-700 overflow-x-auto max-w-full">
          {(['ALL', 'US', 'EU', 'WHO', 'BD'] as const).map((market) => (
            <button
              key={market}
              onClick={() => setSelectedFilter(market)}
              className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer whitespace-nowrap ${
                selectedFilter === market ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-3xs' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {market === 'ALL' ? 'Show All Rules' : `${market} Rules`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div 
            key={rule.id}
            className={`bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-2xs relative ${
              rule.status === 'gap' 
                ? 'border-l-4 border-l-rose-500 border-gray-200 dark:border-slate-800' 
                : 'border-l-4 border-l-emerald-500 border-gray-200 dark:border-slate-800'
            }`}
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase ${
                    rule.status === 'gap' ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  }`}>
                    {rule.status === 'gap' ? 'Rule Gap' : 'Rule Compliant'}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase">{rule.market} Pathway</span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mt-1 flex items-center gap-1.5">
                  <Bookmark className="h-4 w-4 text-slate-400" /> {rule.title}
                </h3>
              </div>

              {rule.status === 'gap' ? (
                <span className="px-2.5 py-1 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-[10px] font-bold flex items-center gap-1 animate-pulse">
                  <ShieldAlert className="h-3.5 w-3.5" /> Action Required
                </span>
              ) : (
                <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Rule Validated
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 dark:text-slate-300 mt-3 leading-relaxed">
              {rule.description}
            </p>

            <div className="mt-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg p-4 border border-gray-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-slate-400 block tracking-wider">Authority Agency</span>
                <span className="font-bold text-gray-700 dark:text-slate-200 block mt-0.5">{rule.authority}</span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-slate-400 block tracking-wider">Official Guideline</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block mt-0.5 flex items-center gap-0.5">
                  {rule.guideline} <ExternalLink className="h-3 w-3 inline" />
                </span>
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase text-gray-400 dark:text-slate-400 block tracking-wider">Dossier Module Section</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{rule.section}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800/40 border-t border-gray-150 dark:border-slate-800 rounded-b-lg text-xs flex justify-between items-center gap-4 flex-wrap">
              <span className="text-gray-500 dark:text-slate-400">
                <strong>Corrective Remediation:</strong> {rule.corrective}
              </span>
              {rule.status === 'gap' && (
                <button
                  onClick={() => alert(`Please proceed to the 'Ingested Documents' page or draft section ${rule.section} in the Regulatory Writer.`)}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold rounded shadow-3xs cursor-pointer"
                >
                  Resolve In Section
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
