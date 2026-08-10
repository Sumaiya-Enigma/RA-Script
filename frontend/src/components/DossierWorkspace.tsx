'use client';

import React from 'react';
import { ProductIdentity, CTDSection, RegulatoryGap } from '../types';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  ChevronRight,
  BookmarkCheck,
  AlertTriangle
} from 'lucide-react';

interface DossierWorkspaceProps {
  productInfo: ProductIdentity;
  sections: CTDSection[];
  gaps: RegulatoryGap[];
  selectedModule: string;
  setSelectedModule: (mod: string) => void;
  onSelectSectionForDrafting: (sectionId: string) => void;
  onViewGaps: () => void;
  onResolveGap: (gapId: string) => void;
}

export default function DossierWorkspace({
  productInfo,
  sections,
  gaps,
  selectedModule,
  setSelectedModule,
  onSelectSectionForDrafting,
  onViewGaps,
  onResolveGap
}: DossierWorkspaceProps) {
  const modulesList = [
    { id: 'Module 1', name: 'Module 1 — Admin', status: 'Done', badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-150', gapsCount: 1 },
    { id: 'Module 2', name: 'Module 2 — Summaries', status: 'Review', badgeColor: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-150', gapsCount: 0 },
    { id: 'Module 3', name: 'Module 3 — Quality', status: '3 gaps', badgeColor: 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-150', gapsCount: 3 },
    { id: 'Module 4', name: 'Module 4 — Safety', status: 'Done', badgeColor: 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-150', gapsCount: 0 },
    { id: 'Module 5', name: 'Module 5 — BE study', status: 'Review', badgeColor: 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-150', gapsCount: 0 },
    { id: 'Labeling', name: 'Labeling & Artwork', status: 'In progress', badgeColor: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-150', gapsCount: 1 }
  ];

  const filteredSections = sections.filter(sec => sec.module === selectedModule);
  const openGaps = gaps.filter(g => g.status === 'open');
  const criticalGapsCount = openGaps.filter(g => g.severity === 'critical').length;
  const minorGapsCount = openGaps.filter(g => g.severity === 'minor').length;

  return (
    <div className="space-y-6" id="dossier-workspace-container">
      {/* Header Panel */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-md uppercase tracking-wider">Active submission</span>
            <span className="text-slate-400 text-xs">&bull;</span>
            <span className="text-slate-300 text-xs font-semibold">{productInfo.proposedTradeName || 'Generic Formulation'}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            {productInfo.genericName || 'Amlodipine Besylate'} {productInfo.strengths?.split(',')[0] || '5mg'} tablets
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Pathway: <span className="text-slate-200 font-semibold">ANDA &mdash; US market</span> &bull; CAS: {productInfo.casNumber || '111470-99-6'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={onViewGaps}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-all cursor-pointer flex items-center gap-1.5"
          >
            Run Gap Check <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button 
            onClick={() => setSelectedModule('Labeling')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" /> Export eCTD
          </button>
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Overall Completion</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">74%</h3>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">26% remaining to submit</p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '74%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Gaps Identified</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 flex items-baseline gap-1.5">
              {openGaps.length} <span className="text-xs font-normal text-gray-500 dark:text-slate-400">total</span>
            </h3>
            <p className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse"></span>
              {criticalGapsCount} critical, {minorGapsCount} minor
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${(criticalGapsCount / (openGaps.length || 1)) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">AI-Drafted Sections</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">31</h3>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">Pending regulatory RA review</p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Est. Submission</p>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 flex items-baseline gap-1">
              6 <span className="text-xs font-normal text-gray-500 dark:text-slate-400">weeks</span>
            </h3>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> At current pipeline pace
            </p>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-400 h-1.5 rounded-full" style={{ width: '80%' }}></div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3 space-y-3">
          <div className="px-1">
            <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">CTD Modules Checklist</h3>
          </div>
          <div className="space-y-1.5">
            {modulesList.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                  selectedModule === mod.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : 'bg-white dark:bg-slate-900 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 border-gray-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold tracking-tight uppercase border ${
                    selectedModule === mod.id
                      ? 'bg-slate-800 text-slate-200 border-slate-700'
                      : mod.badgeColor
                  }`}>
                    {mod.status}
                  </span>
                  <p className="text-xs font-semibold mt-1">{mod.name}</p>
                </div>
                <ChevronRight className={`h-4 w-4 transition-transform ${
                  selectedModule === mod.id ? 'text-white translate-x-0.5' : 'text-gray-400'
                }`} />
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-9 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100 flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                {selectedModule === 'Labeling' ? 'Labeling & Artwork status' : `${selectedModule} &mdash; Detailed Sections`}
              </h2>
              <span className="text-[11px] text-gray-500 dark:text-slate-400 font-medium">3 gaps &bull; 2 pending review</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredSections.map((sec) => (
                <div key={sec.id} className="p-3 bg-gray-50 dark:bg-slate-800/60 rounded-lg border border-gray-150 dark:border-slate-700 flex flex-col justify-between space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{sec.id}</span>
                    <span className={`text-[9px] px-1 rounded-sm font-semibold ${
                      sec.status === 'Done' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' :
                      sec.status === 'Review' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                      sec.status === 'In progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                    }`}>
                      {sec.status}
                    </span>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-400 mb-1">
                      <span className="truncate font-medium">{sec.title}</span>
                      <span>{sec.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden">
                      <div className={`h-1 rounded-full ${
                        sec.status === 'Done' ? 'bg-emerald-500' :
                        sec.status === 'Review' ? 'bg-amber-500' :
                        sec.status === 'In progress' ? 'bg-blue-500' : 'bg-purple-500'
                      }`} style={{ width: `${sec.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredSections.map((sec) => {
              const sectionGaps = gaps.filter(g => sec.gaps.includes(g.id) && g.status === 'open');
              const hasCriticalGap = sectionGaps.some(g => g.severity === 'critical');
              const hasMinorGap = sectionGaps.some(g => g.severity === 'minor');

              return (
                <div 
                  key={sec.id}
                  className={`bg-white dark:bg-slate-900 border rounded-xl p-5 shadow-2xs hover:shadow-xs transition-all ${
                    hasCriticalGap 
                      ? 'border-l-4 border-l-rose-500 border-gray-200 dark:border-slate-800' 
                      : hasMinorGap 
                      ? 'border-l-4 border-l-amber-500 border-gray-200 dark:border-slate-800'
                      : 'border-l-4 border-l-indigo-500 border-gray-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 dark:border-slate-800 pb-3 mb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">{sec.id}</span>
                        <h3 className="text-xs font-bold text-gray-900 dark:text-white">{sec.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                        sec.status === 'Done' ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-150' :
                        sec.status === 'Review' ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-150' :
                        sec.status === 'In progress' ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-150' :
                        'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-150'
                      }`}>
                        {sec.status === 'Done' ? 'Approved' : sec.status}
                      </span>
                      <button
                        onClick={() => onSelectSectionForDrafting(sec.id)}
                        className="px-2.5 py-0.5 bg-linear-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold rounded border border-indigo-200 dark:border-indigo-800 shadow-3xs cursor-pointer flex items-center gap-0.5"
                      >
                        <Sparkles className="h-2.5 w-2.5" /> Draft / Write
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                    {sec.summary}
                  </p>

                  {sectionGaps.map((gap) => (
                    <div 
                      key={gap.id}
                      className={`mt-4 p-4 rounded-lg border flex items-start gap-3 relative ${
                        gap.severity === 'critical'
                          ? 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                          : 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      {gap.severity === 'critical' ? (
                        <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-1.5 py-0.2 rounded-sm text-[9px] font-bold uppercase ${
                            gap.severity === 'critical' ? 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200' : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                          }`}>
                            {gap.severity} gap
                          </span>
                          <span className="font-semibold text-gray-800 dark:text-slate-100">{gap.title}</span>
                          <span className="text-gray-400">&bull;</span>
                          <span className="text-gray-500 dark:text-slate-400 font-mono text-[10px]">{gap.authority} &bull; {gap.guideline}</span>
                        </div>
                        <p className="text-gray-600 dark:text-slate-300 leading-normal">{gap.description}</p>
                        <div className="pt-2 flex items-center gap-3">
                          <span className="text-[10px] text-gray-500 dark:text-slate-400">
                            <strong>Remedy Action:</strong> {gap.correctiveAction}
                          </span>
                          <button
                            onClick={() => onResolveGap(gap.id)}
                            className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 rounded text-[9px] font-semibold text-gray-700 dark:text-slate-200 shadow-3xs cursor-pointer ml-auto"
                          >
                            Resolve gap
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {sec.aiNote && sectionGaps.length === 0 && (
                    <div className="mt-4 p-4 rounded-lg bg-sky-50/50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200 flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.2 bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200 rounded-sm text-[9px] font-bold uppercase">AI Note</span>
                          <span className="font-semibold text-gray-800 dark:text-slate-100">Expert CMC Insight</span>
                        </div>
                        <p className="text-gray-600 dark:text-slate-300 leading-normal">{sec.aiNote}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 p-4 border border-gray-200 dark:border-slate-800 rounded-xl flex flex-wrap gap-2 justify-between items-center">
            <button
              onClick={() => onSelectSectionForDrafting('3.2.P.3')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" /> Draft Validation Commitment
            </button>
            <div className="flex gap-2">
              <button
                onClick={onViewGaps}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-3xs cursor-pointer transition-all"
              >
                View all {openGaps.length} gaps
              </button>
              <button
                onClick={() => alert("FDA Common Deficiency Database (IR) launched.")}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-slate-200 text-xs font-semibold rounded-lg shadow-3xs cursor-pointer transition-all flex items-center gap-1"
              >
                Common FDA IRs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
