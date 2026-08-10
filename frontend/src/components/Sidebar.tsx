'use client';

import React from 'react';
import { 
  UploadCloud, 
  Workflow, 
  FolderTree, 
  FileEdit, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  FileCode2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type TabType = 'intake' | 'workspace' | 'documents' | 'writer' | 'consistency' | 'compliance' | 'audit' | 'publishing';

interface SidebarProps {
  selectedTab: TabType;
  setSelectedTab: (tab: TabType) => void;
  documentsCount: number;
  sectionsCount: number;
  consistencyFlagsCount: number;
  activeGapsCount: number;
  auditLogsCount: number;
}

export default function Sidebar({
  selectedTab,
  setSelectedTab,
  documentsCount,
  sectionsCount,
  consistencyFlagsCount,
  activeGapsCount,
  auditLogsCount
}: SidebarProps) {
  const { t } = useLanguage();

  return (
    <aside className="w-full md:w-64 shrink-0 space-y-2">
      <div className="px-1.5 pb-2 border-b border-gray-200 dark:border-slate-800">
        <h4 className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
          {t('submissionsNavigator')}
        </h4>
      </div>

      <nav className="space-y-1">
        {/* Tab: Ingestion */}
        <button
          onClick={() => setSelectedTab('documents')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'documents'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <UploadCloud className="h-4.5 w-4.5 shrink-0" /> {t('tabDocuments')}
          </span>
          <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-[10px] rounded-full border border-gray-200 dark:border-slate-700 font-semibold">
            {documentsCount}
          </span>
        </button>

        {/* Tab: Intake Form */}
        <button
          onClick={() => setSelectedTab('intake')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'intake'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <Workflow className="h-4.5 w-4.5 shrink-0" /> {t('tabIntake')}
          </span>
        </button>

        {/* Tab: Workspace */}
        <button
          onClick={() => setSelectedTab('workspace')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'workspace'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <FolderTree className="h-4.5 w-4.5 shrink-0" /> {t('tabWorkspace')}
          </span>
          <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-[10px] rounded-full border border-gray-200 dark:border-slate-700 font-semibold">
            {sectionsCount}
          </span>
        </button>

        {/* Tab: Writer */}
        <button
          onClick={() => setSelectedTab('writer')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'writer'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileEdit className="h-4.5 w-4.5 shrink-0" /> {t('tabWriter')}
          </span>
          <span className="px-1.5 py-0.2 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] rounded-full border border-indigo-150 dark:border-indigo-800 font-bold flex items-center gap-0.5">
            <Sparkles className="h-2.5 w-2.5" /> {t('draftsBadge')}
          </span>
        </button>

        {/* Tab: Consistency */}
        <button
          onClick={() => setSelectedTab('consistency')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'consistency'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0" /> {t('tabConsistency')}
          </span>
          {consistencyFlagsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-500 text-white text-[9px] font-bold rounded-full animate-pulse shadow-3xs">
              {consistencyFlagsCount}
            </span>
          )}
        </button>

        {/* Tab: Compliance */}
        <button
          onClick={() => setSelectedTab('compliance')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'compliance'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 shrink-0" /> {t('tabCompliance')}
          </span>
          {activeGapsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-[9px] font-bold rounded-full border border-rose-200 dark:border-rose-800">
              {activeGapsCount}
            </span>
          )}
        </button>

        {/* Tab: Audit */}
        <button
          onClick={() => setSelectedTab('audit')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <History className="h-4.5 w-4.5 shrink-0" /> {t('tabAudit')}
          </span>
          <span className="px-1.5 py-0.2 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 text-[10px] rounded-full border border-gray-200 dark:border-slate-700 font-semibold">
            {auditLogsCount}
          </span>
        </button>

        {/* Tab: Publishing */}
        <button
          onClick={() => setSelectedTab('publishing')}
          className={`w-full py-2.5 px-3.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
            selectedTab === 'publishing'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-slate-300 hover:bg-gray-150 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-white'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileCode2 className="h-4.5 w-4.5 shrink-0" /> {t('tabPublishing')}
          </span>
          <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold rounded-sm border border-emerald-200 dark:border-emerald-800">
            {t('sequenceBadge')}
          </span>
        </button>
      </nav>

      <div className="pt-6 border-t border-gray-200 dark:border-slate-800 space-y-4">
        <div className="p-3 bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 rounded-lg text-[10px] text-indigo-800 dark:text-indigo-300 space-y-1">
          <p className="font-bold uppercase tracking-wider">{t('cmcModuleTitle')}</p>
          <p className="leading-relaxed">{t('cmcModuleDesc')}</p>
        </div>
      </div>
    </aside>
  );
}
