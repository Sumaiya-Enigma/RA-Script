'use client';

import React, { useState } from 'react';
import { AuditLog } from '../types';
import { ShieldCheck, History, PenTool, UserCheck, AlertCircle } from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLog[];
  onLogAudit: (action: string, document?: string, details?: string) => void;
}

export default function AuditTrailView({ logs, onLogAudit }: AuditTrailViewProps) {
  const [signerName, setSignerName] = useState('');
  const [signerRole, setSignerRole] = useState('Senior Regulatory Affairs Manager');
  const [signerSection, setSignerSection] = useState('Module 3 - Quality');

  const handleSignOff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;

    onLogAudit(
      `Electronic Signature Executed & Approved`, 
      signerSection, 
      `Signer: ${signerName} (${signerRole}) under 21 CFR Part 11 compliance guidelines`
    );

    setSignerName('');
    alert(`Dossier signed off successfully! Certified signature recorded immutably under ALCOA+ audit history logs.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="audit-trail-container">
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 bg-slate-900 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-indigo-400" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider">GxP Immutable System Audit Trail</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Complies with 21 CFR Part 11 and EU GMP Annex 11</p>
              </div>
            </div>
            <span className="px-2.5 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold rounded-lg border border-indigo-500/30">
              ALCOA+ Secured
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50 dark:hover:bg-slate-800/60 transition-all flex justify-between gap-4 items-start text-xs">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-mono rounded">
                      {log.user}
                    </span>
                    <span className="text-gray-400">&bull;</span>
                    <span className="text-gray-500 dark:text-slate-400">{log.timestamp}</span>
                  </div>
                  <p className="font-bold text-gray-800 dark:text-slate-100">{log.action}</p>
                  {log.document && (
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
                      Target: <span className="text-slate-600 dark:text-slate-300">{log.document}</span>
                    </p>
                  )}
                </div>

                <div className="text-right shrink-0">
                  {log.action.includes('Signature') ? (
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded text-[9px] font-bold uppercase inline-flex items-center gap-0.5 border border-emerald-200 dark:border-emerald-800">
                      <UserCheck className="h-3 w-3" /> Certified
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 rounded text-[9px] font-mono border border-gray-200 dark:border-slate-700">
                      System Action
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-800 pb-3">
            <PenTool className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" /> Electronic Certification
          </h3>

          <p className="text-xs text-gray-500 dark:text-slate-400 leading-normal">
            Under <strong>US FDA 21 CFR Part 11</strong>, electronic signatures are legally binding equivalents of handwritten signatures. Certified reviewers must log authentication signatures upon complete QA review of dossier sections.
          </p>

          <form onSubmit={handleSignOff} className="space-y-3.5 pt-2">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Certified Reviewer Name</label>
              <input
                type="text"
                required
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Enter full legal name..."
                className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Official GxP Role</label>
              <select
                value={signerRole}
                onChange={(e) => setSignerRole(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 font-medium"
              >
                <option value="Senior Regulatory Affairs Manager">Senior Regulatory Affairs Manager</option>
                <option value="Regulatory CMC Expert">Regulatory CMC Expert</option>
                <option value="Quality Assurance (QA) Director">Quality Assurance (QA) Director</option>
                <option value="Submission Publishing Lead">Submission Publishing Lead</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 dark:text-slate-300">Dossier Module Scope</label>
              <select
                value={signerSection}
                onChange={(e) => setSignerSection(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 font-medium"
              >
                <option value="Module 1 - Administrative Documentation">Module 1 - Administrative</option>
                <option value="Module 2 - Summaries (QOS)">Module 2 - Summaries (QOS)</option>
                <option value="Module 3 - Quality (CMC Section)">Module 3 - Quality (CMC)</option>
                <option value="Module 5 - BE Clinical Studies">Module 5 - BE Clinical Studies</option>
                <option value="Complete Dossier Dossier Scope">Complete submission package</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              <ShieldCheck className="h-4 w-4" /> Sign & Certify Section
            </button>
          </form>

          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-150 dark:border-rose-900 rounded-lg text-[10px] text-rose-800 dark:text-rose-300 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-normal">
              <strong>GxP Regulatory Warning:</strong> Any attempt to sign off on incomplete stability data (Module 3.2.P.8) without prospective resolution of active consistency flags will result in an audit trail warning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
