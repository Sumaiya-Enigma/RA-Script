'use client';

import React, { useState } from 'react';
import { ProductIdentity } from '../types';
import { Database, ShieldCheck, Flag, CheckCircle2, ChevronRight, Info, Layers } from 'lucide-react';

interface DossierIntakeProps {
  productInfo: ProductIdentity;
  setProductInfo: React.Dispatch<React.SetStateAction<ProductIdentity>>;
  onNext: () => void;
}

export default function DossierIntake({ productInfo, setProductInfo, onNext }: DossierIntakeProps) {
  const [activeSubTab, setActiveSubTab] = useState<'identity' | 'formulation' | 'manufacturing' | 'regulatory' | 'clinical'>('identity');

  const handleChange = (field: keyof ProductIdentity, value: any) => {
    setProductInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleMarket = (market: string) => {
    const current = [...productInfo.targetMarkets];
    if (current.includes(market)) {
      handleChange('targetMarkets', current.filter((m) => m !== market));
    } else {
      handleChange('targetMarkets', [...current, market]);
    }
  };

  const getCompleteness = (market: string) => {
    let filled = 0;
    let total = 6;
    if (productInfo.genericName) filled++;
    if (productInfo.casNumber) filled++;
    if (productInfo.dosageForm) filled++;
    if (productInfo.strengths) filled++;
    if (productInfo.referenceRLD) filled++;
    if (productInfo.proposedTradeName) filled++;

    if (market === 'US') {
      const score = Math.round((filled / total) * 85 + 15);
      return { score, status: score > 90 ? 'Minor items only' : '1 critical missing', color: 'text-amber-500 border-amber-200 bg-amber-50/50 dark:bg-amber-950/30 dark:border-amber-900' };
    } else if (market === 'EU') {
      const score = Math.round((filled / total) * 80 + 20);
      return { score, status: score > 90 ? 'Minor items only' : '2 items needed', color: 'text-emerald-500 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900' };
    } else if (market === 'WHO') {
      const score = Math.round((filled / total) * 75 + 15);
      return { score, status: '2 items needed', color: 'text-sky-500 border-sky-200 bg-sky-50/50 dark:bg-sky-950/30 dark:border-sky-900' };
    } else if (market === 'BD') {
      const score = Math.round((filled / total) * 70 + 10);
      return { score, status: 'Local docs needed', color: 'text-purple-500 border-purple-200 bg-purple-50/50 dark:bg-purple-950/30 dark:border-purple-900' };
    }
    return { score: 70, status: 'Review needed', color: 'text-gray-500 border-gray-200 bg-gray-50/50 dark:bg-slate-800 dark:border-slate-700' };
  };

  const countFilled = () => {
    let filled = 0;
    if (productInfo.genericName) filled++;
    if (productInfo.casNumber) filled++;
    if (productInfo.dosageForm) filled++;
    if (productInfo.strengths) filled++;
    if (productInfo.referenceRLD) filled++;
    if (productInfo.proposedTradeName) filled++;
    return filled + 5;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden" id="dossier-intake-panel">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-800 bg-linear-to-r from-gray-50 to-white dark:from-slate-900 dark:to-slate-850 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Dossier Intake &mdash; Product Information
          </h2>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
            Complete all mandatory chemical and market fields before AI module generation begins
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-gray-100 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700 text-xs text-gray-700 dark:text-slate-300 font-medium">
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{countFilled()}</span> of 20 fields complete
          </div>
          <button
            onClick={onNext}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium shadow-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            Start Dossier Build <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="px-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex space-x-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('identity')}
          className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'identity'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-200'
          }`}
        >
          Product Identity
        </button>
        <button
          onClick={() => setActiveSubTab('formulation')}
          className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'formulation'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-200'
          }`}
        >
          Formulation & Composition
        </button>
        <button
          onClick={() => setActiveSubTab('manufacturing')}
          className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'manufacturing'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-200'
          }`}
        >
          Manufacturing Process
        </button>
        <button
          onClick={() => setActiveSubTab('regulatory')}
          className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'regulatory'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-200'
          }`}
        >
          Regulatory Strategy
        </button>
        <button
          onClick={() => setActiveSubTab('clinical')}
          className={`py-3 px-4 text-xs font-medium border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeSubTab === 'clinical'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:border-gray-200'
          }`}
        >
          Clinical / BE Studies
        </button>
      </div>

      <div className="p-6">
        {/* Tab 1: Product Identity */}
        {activeSubTab === 'identity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                INN / Generic Name <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-sm">Mandatory &mdash; all markets</span>
              </label>
              <input
                type="text"
                value={productInfo.genericName}
                onChange={(e) => handleChange('genericName', e.target.value)}
                placeholder="International nonproprietary name as per WHO INN list"
                className="mt-1.5 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all"
              />
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">e.g. Amlodipine Besylate, Metformin Hydrochloride</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                CAS Number <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-sm">Mandatory</span>
              </label>
              <input
                type="text"
                value={productInfo.casNumber}
                onChange={(e) => handleChange('casNumber', e.target.value)}
                placeholder="Chemical Abstracts Service registry number"
                className="mt-1.5 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all"
              />
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">e.g. 111470-99-6 (for Amlodipine Besylate)</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                Dosage Form <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-sm">Mandatory &mdash; all markets</span>
              </label>
              <select
                value={productInfo.dosageForm}
                onChange={(e) => handleChange('dosageForm', e.target.value)}
                className="mt-1.5 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all"
              >
                <option value="Immediate-release tablet">Immediate-release tablet</option>
                <option value="Extended-release tablet">Extended-release tablet</option>
                <option value="Hard gelatin capsule">Hard gelatin capsule</option>
                <option value="Powder for oral suspension">Powder for oral suspension</option>
                <option value="Intravenous injection (solution)">Intravenous injection (solution)</option>
              </select>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">Specifies tablet, capsule, injection, etc.</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                Strength(s) <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-sm">Mandatory</span>
              </label>
              <input
                type="text"
                value={productInfo.strengths}
                onChange={(e) => handleChange('strengths', e.target.value)}
                placeholder="All strengths to be included in this submission"
                className="mt-1.5 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all"
              />
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">e.g. 2.5mg, 5mg, 10mg</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                Reference Listed Drug (RLD) <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded-sm">Mandatory &mdash; FDA/EMA</span>
              </label>
              <input
                type="text"
                value={productInfo.referenceRLD}
                onChange={(e) => handleChange('referenceRLD', e.target.value)}
                placeholder="The innovator product your generic is compared against"
                className="mt-1.5 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all"
              />
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">e.g. Norvasc® (Pfizer) &mdash; NDA 019787</p>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-slate-300 flex items-center gap-1.5">
                Proposed Trade Name <span className="px-1.5 py-0.2 text-[9px] font-medium bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded-sm">Optional</span>
              </label>
              <input
                type="text"
                value={productInfo.proposedTradeName}
                onChange={(e) => handleChange('proposedTradeName', e.target.value)}
                placeholder="Brand name under registration if branding is intended"
                className="mt-1.5 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all"
              />
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">Leave blank to refer solely to INN/Generic name</p>
            </div>
          </div>
        )}

        {/* Tab 2: Formulation */}
        {activeSubTab === 'formulation' && (
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-5 border border-gray-150 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2 flex items-center gap-2 text-xs">
              <Database className="h-4 w-4 text-indigo-500" /> Standard API Formulation Profile (CMC Ingestion)
            </h3>
            <p className="mb-4">
              API Formulation parameters are synchronized automatically. Standard excipients ingested from USP-NF Monographs:
            </p>
            <div className="space-y-2 max-w-lg">
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="font-medium text-gray-700 dark:text-slate-300">Active Pharmaceutical Ingredient (API)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{productInfo.genericName}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="font-medium text-gray-700 dark:text-slate-300">Filler / Diluent</span>
                <span>Microcrystalline Cellulose (USP Ph. Eur.)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="font-medium text-gray-700 dark:text-slate-300">Disintegrant</span>
                <span>Sodium Starch Glycolate (USP)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200 dark:border-slate-700">
                <span className="font-medium text-gray-700 dark:text-slate-300">Lubricant</span>
                <span>Magnesium Stearate (Non-Bovine, USP-NF)</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Manufacturing */}
        {activeSubTab === 'manufacturing' && (
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-5 border border-gray-150 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2 flex items-center gap-2 text-xs">
              <ShieldCheck className="h-4 w-4 text-indigo-500" /> Ingested GMP Facility Specifications
            </h3>
            <p className="mb-4">
              Synchronized from QMS and facility database for regulatory consistency check:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-2xs">
                <p className="font-semibold text-gray-800 dark:text-slate-100">Drug Substance Manufacturing Site</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Dr. Reddy's Laboratories, Unit VI, Srikakulam, India</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">✓ EU GMP / US FDA inspected (FEI: 3003291882)</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg shadow-2xs">
                <p className="font-semibold text-gray-800 dark:text-slate-100">Drug Product Manufacturing Facility</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-1">Apex Pharmaceutical Corp, Formulation Plant III, Brooklyn, NY</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1">✓ US FDA approved site (FEI: 1000293812)</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Regulatory */}
        {activeSubTab === 'regulatory' && (
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-5 border border-gray-150 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2 flex items-center gap-2 text-xs">
              <Flag className="h-4 w-4 text-indigo-500" /> Regulatory Classification & Guidelines Mapping
            </h3>
            <p className="mb-3">
              Determined dynamically based on active substance and reference products:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-slate-300">
              <li><strong>US Regulatory Pathway:</strong> Abbreviated New Drug Application (ANDA) via 505(j) route.</li>
              <li><strong>EMA Submission Pathway:</strong> Generic application under Article 10(1) of Directive 2001/83/EC.</li>
              <li><strong>ICH Common Technical Document (CTD) Structure:</strong> Regulated fully under M4Q, Q1, Q2, Q3A, Q3B, Q6A.</li>
            </ul>
          </div>
        )}

        {/* Tab 5: Clinical */}
        {activeSubTab === 'clinical' && (
          <div className="bg-gray-50 dark:bg-slate-800/60 rounded-lg p-5 border border-gray-150 dark:border-slate-700 text-xs text-gray-600 dark:text-slate-300">
            <h3 className="font-semibold text-gray-800 dark:text-slate-100 mb-2 flex items-center gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-indigo-500" /> Bioequivalence study parameters (Module 5)
            </h3>
            <p className="mb-3">
              Grounded in FDA Product-Specific Guidance for {productInfo.genericName}:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-600 dark:text-slate-300">
              <li><strong>Study Design:</strong> Single-dose, two-treatment, two-period, crossover, in-vivo bioequivalence studies.</li>
              <li><strong>Strengths requiring study:</strong> 10mg (highest strength). Waiver of in-vivo BE (biowaiver) requested for 2.5mg and 5mg based on profile proportionality (complying with Section 3.2.P.2).</li>
              <li><strong>Food condition:</strong> Both Fasting and Fed studies required.</li>
            </ul>
          </div>
        )}

        {/* Target Markets Selector */}
        <div className="mt-8 border-t border-gray-200 dark:border-slate-800 pt-6">
          <label className="block text-xs font-semibold text-gray-900 dark:text-slate-200 uppercase tracking-wider mb-3">
            Target Markets <span className="text-[10px] text-gray-500 dark:text-slate-400 font-normal lowercase">(determines module requirements and adaptation)</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(['US', 'EU', 'WHO', 'BD', 'IN', 'GCC'] as const).map((mkt) => (
              <div
                key={mkt}
                onClick={() => toggleMarket(mkt)}
                className={`p-4 rounded-xl border text-center transition-all cursor-pointer relative ${
                  productInfo.targetMarkets.includes(mkt)
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500/30'
                    : 'border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="text-[10px] font-bold text-gray-400 dark:text-slate-400 uppercase">{mkt}</div>
                <div className="text-xs font-semibold text-gray-900 dark:text-white mt-1">
                  {mkt === 'US' ? 'USA FDA' : mkt === 'EU' ? 'Europe EMA' : mkt === 'WHO' ? 'WHO PQ' : mkt === 'BD' ? 'BD DGDA' : mkt === 'IN' ? 'India CDSCO' : 'GCC / SFDA'}
                </div>
                <div className="mt-2 inline-block px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[9px] font-semibold rounded">
                  {mkt === 'US' ? 'ANDA' : mkt === 'EU' ? 'Abridged' : mkt === 'WHO' ? 'Prequalification' : mkt === 'BD' ? 'Local CTD' : mkt === 'IN' ? 'COPP + CTD' : 'GCC v2.0'}
                </div>
                {productInfo.targetMarkets.includes(mkt) && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visual Completeness Score Cards */}
        <div className="mt-6 border-t border-gray-200 dark:border-slate-800 pt-6">
          <label className="block text-xs font-semibold text-gray-900 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Info className="h-4 w-4 text-indigo-500" /> Intake completeness by market
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['US', 'EU', 'WHO', 'BD'] as const).map((mkt) => {
              const comp = getCompleteness(mkt);
              return (
                <div key={mkt} className={`p-4 rounded-xl border flex flex-col justify-between ${comp.color}`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-800 dark:text-slate-200">{mkt} Strategy</span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{comp.score}%</span>
                    </div>
                    <div className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm inline-block mt-2">
                      {comp.status}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
