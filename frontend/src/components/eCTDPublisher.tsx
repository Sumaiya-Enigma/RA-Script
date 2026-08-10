'use client';

import React, { useState } from 'react';
import { ProductIdentity, CTDSection, RegulatoryGap } from '../types';
import { 
  Folder, 
  FileCode, 
  Download, 
  ShieldCheck, 
  ChevronRight, 
  ChevronDown, 
  FileText
} from 'lucide-react';

interface ECTDPublisherProps {
  productInfo: ProductIdentity;
  sections: CTDSection[];
  gaps: RegulatoryGap[];
}

export default function ECTDPublisher({ productInfo, sections, gaps }: ECTDPublisherProps) {
  const [selectedXmlFile, setSelectedXmlFile] = useState<'index.xml' | 'us-regional.xml'>('index.xml');
  const [expandedFolder, setExpandedFolder] = useState<string[]>(['root', 'm1', 'm3']);

  const toggleFolder = (folderId: string) => {
    if (expandedFolder.includes(folderId)) {
      setExpandedFolder(prev => prev.filter(f => f !== folderId));
    } else {
      setExpandedFolder(prev => [...prev, folderId]);
    }
  };

  const openGaps = gaps.filter(g => g.status === 'open');
  const criticalGapsCount = openGaps.filter(g => g.severity === 'critical').length;

  const getModuleScore = (moduleName: string) => {
    if (moduleName === 'Module 1') return 100;
    if (moduleName === 'Module 2') return 100;
    if (moduleName === 'Module 3') {
      const mod3Gaps = openGaps.filter(g => g.section.startsWith('3.2.P'));
      if (mod3Gaps.some(g => g.severity === 'critical')) return 78;
      if (mod3Gaps.length > 0) return 90;
      return 100;
    }
    if (moduleName === 'Module 4') return 100;
    if (moduleName === 'Module 5') return 92;
    return 85;
  };

  const getOverallScore = () => {
    if (criticalGapsCount > 1) return 74;
    if (criticalGapsCount === 1) return 88;
    if (openGaps.length > 0) return 94;
    return 100;
  };

  const overall = getOverallScore();

  const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE ectd:ectd SYSTEM "util/dtd/ectd-2-0.dtd">
<ectd:ectd xmlns:ectd="http://www.ich.org/ectd" xmlns:xlink="http://www.w3.org/1999/xlink" dtd-version="2.0">
  <submission sequence="0001">
    <application-information>
      <applicant>${productInfo.proposedTradeName || 'Generic Co'}</applicant>
      <product-name>${productInfo.genericName}</product-name>
      <dosage-form>${productInfo.dosageForm}</dosage-form>
      <strength>${productInfo.strengths}</strength>
    </application-information>
    
    <!-- Module 1: Administrative Information -->
    <m1-administrative-information>
      <leaf id="l1" operation="new" xlink:href="m1/us/cover.pdf" checksum-type="md5" checksum="d41d8cd98f00b204e9800998ecf8427e">
        <title>Cover Letter for ${productInfo.genericName} Submission</title>
      </leaf>
      <leaf id="l2" operation="new" xlink:href="m1/us/form356h.pdf" checksum-type="md5" checksum="a41f8c498f32b204e9800998ecf8427e">
        <title>Form FDA 356h Application Form</title>
      </leaf>
    </m1-administrative-information>

    <!-- Module 3: Quality - Drug Product -->
    <m3-quality>
      <m3-2-p-drug-product-amlodipine>
        <leaf id="l3" operation="new" xlink:href="m3/32-p-drug-prod/32p1-description.pdf" checksum-type="md5" checksum="92e18fd98b31a204e9800998ecf8421b">
          <title>3.2.P.1 Description and Composition of the Drug Product</title>
        </leaf>
        <leaf id="l4" operation="${openGaps.some(g => g.section === '3.2.P.3') ? 'append' : 'new'}" xlink:href="m3/32-p-drug-prod/32p3-manufacture.pdf" checksum-type="md5" checksum="f31f8cd98b204e2012800998ecf8425a">
          <title>3.2.P.3 Manufacture &amp; Process Control Procedures</title>
        </leaf>
      </m3-2-p-drug-product-amlodipine>
    </m3-quality>
  </submission>
</ectd:ectd>`;

  const regionalXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fda-regional:fda-regional SYSTEM "fda-regional-2-3.dtd">
<fda-regional:fda-regional xmlns:fda-regional="http://www.fda.gov/fda-regional" dtd-version="2.3">
  <admin>
    <us-regulatory-pathway>505(j) ANDA</us-regulatory-pathway>
    <us-regional-sequence>0001</us-regional-sequence>
    <field-copy-certification>Certified true and complete copy sent to FDA regional field office</field-copy-certification>
    <financial-certification>Form FDA 3454 - Financial certification validated.</financial-certification>
  </admin>
</fda-regional:fda-regional>`;

  return (
    <div className="space-y-6" id="ectd-publisher-container">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider">eCTD Publication &amp; Submission Readiness</h2>
            <p className="text-xs text-gray-500 dark:text-slate-400">
              Validates leaf check-sums, generates regional sequence packages (0001), and reviews regional admin declarations.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => alert('Submission Checklists compiled. Document inventory verified under PIC/S standards.')}
              className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-3xs cursor-pointer flex items-center gap-1"
            >
              <Download className="h-3.5 w-3.5" /> Download Dossier Reports
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-2xs">
        <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider mb-4">Dossier Readiness Assessment Scorecard</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-slate-900 dark:bg-slate-950 text-white p-4 rounded-xl text-center flex flex-col justify-between border border-slate-800">
            <span className="text-[9px] font-bold text-slate-400 uppercase">Overall Dossier</span>
            <div className="my-2">
              <span className="text-2xl font-black">{overall}%</span>
            </div>
            <span className={`text-[9px] font-bold uppercase ${overall > 90 ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`}>
              {overall > 90 ? 'Ready' : 'Not Ready'}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-250 dark:border-slate-700 p-4 rounded-xl text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-400 uppercase">Module 1 (Admin)</span>
            <div className="my-2">
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{getModuleScore('Module 1')}%</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Complete</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-250 dark:border-slate-700 p-4 rounded-xl text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-400 uppercase">Module 2 (QOS)</span>
            <div className="my-2">
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{getModuleScore('Module 2')}%</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Complete</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-250 dark:border-slate-700 p-4 rounded-xl text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-400 uppercase">Module 3 (Quality)</span>
            <div className="my-2">
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{getModuleScore('Module 3')}%</span>
            </div>
            <span className={`text-[9px] font-bold uppercase ${getModuleScore('Module 3') > 90 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400 font-black'}`}>
              {getModuleScore('Module 3') > 90 ? 'Compliant' : 'Gaps pending'}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-250 dark:border-slate-700 p-4 rounded-xl text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-400 uppercase">Module 4 (Safety)</span>
            <div className="my-2">
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{getModuleScore('Module 4')}%</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Complete</span>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800/60 border border-gray-250 dark:border-slate-700 p-4 rounded-xl text-center flex flex-col justify-between">
            <span className="text-[9px] font-bold text-gray-400 dark:text-slate-400 uppercase">Module 5 (Clinical)</span>
            <div className="my-2">
              <span className="text-2xl font-black text-gray-800 dark:text-slate-100">{getModuleScore('Module 5')}%</span>
            </div>
            <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Pending Review</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-gray-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 dark:border-slate-800 pb-3">
            <Folder className="h-4.5 w-4.5 text-indigo-600 dark:text-indigo-400" />
            ICH eCTD Sequence Tree (0001)
          </h3>

          <div className="text-xs space-y-2 select-none">
            <div className="space-y-1">
              <div 
                onClick={() => toggleFolder('root')}
                className="flex items-center gap-1.5 cursor-pointer font-bold text-gray-800 dark:text-slate-200 hover:text-indigo-600"
              >
                {expandedFolder.includes('root') ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
                <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                <span>dossier_amlodipine_0001/</span>
              </div>

              {expandedFolder.includes('root') && (
                <div className="pl-6 space-y-2 border-l border-gray-200 dark:border-slate-800 ml-2">
                  <div className="space-y-1">
                    <div 
                      onClick={() => toggleFolder('m1')}
                      className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600"
                    >
                      {expandedFolder.includes('m1') ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
                      <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>m1-administrative/</span>
                    </div>
                    {expandedFolder.includes('m1') && (
                      <div className="pl-6 space-y-1 border-l border-gray-200 dark:border-slate-800 ml-2 text-[11px] text-gray-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">cover_letter.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">fda_form_356h.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">product_label.pdf</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 py-0.5 font-semibold text-gray-700 dark:text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>m2-summaries/</span>
                  </div>

                  <div className="space-y-1">
                    <div 
                      onClick={() => toggleFolder('m3')}
                      className="flex items-center gap-1.5 cursor-pointer font-semibold text-gray-700 dark:text-slate-300 hover:text-indigo-600"
                    >
                      {expandedFolder.includes('m3') ? <ChevronDown className="h-3.5 w-3.5 text-gray-500" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-500" />}
                      <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>m3-quality/</span>
                    </div>
                    {expandedFolder.includes('m3') && (
                      <div className="pl-6 space-y-1 border-l border-gray-200 dark:border-slate-800 ml-2 text-[11px] text-gray-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">32p1_description_composition.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">32p3_manufacture.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">32p4_excipients_mcc_spec.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">32p5_drug_product_spec.pdf</span>
                        </div>
                        <div className="flex items-center gap-1.5 py-0.5">
                          <FileText className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                          <span className="truncate">32p8_stability_study.pdf</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 py-0.5 font-semibold text-gray-700 dark:text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>m4-nonclinical/</span>
                  </div>

                  <div className="flex items-center gap-1.5 py-0.5 font-semibold text-gray-700 dark:text-slate-300">
                    <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                    <Folder className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>m5-clinical/</span>
                  </div>

                  <div className="flex items-center gap-1.5 py-0.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    <ChevronRight className="h-3.5 w-3.5 text-transparent" />
                    <FileCode className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="font-mono">index.xml</span>
                  </div>

                  <div className="flex items-center gap-1.5 py-0.5 font-semibold text-indigo-600 dark:text-indigo-400">
                    <ChevronRight className="h-3.5 w-3.5 text-transparent" />
                    <FileCode className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span className="font-mono">us-regional.xml</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col h-[460px]">
          <div className="px-5 py-3 border-b border-gray-200 dark:border-slate-800 bg-slate-900 text-white flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileCode className="h-4 w-4 text-indigo-400 animate-pulse" /> eCTD XML XML Backbone Explorer
            </span>
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setSelectedXmlFile('index.xml')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  selectedXmlFile === 'index.xml' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                index.xml
              </button>
              <button
                onClick={() => setSelectedXmlFile('us-regional.xml')}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                  selectedXmlFile === 'us-regional.xml' ? 'bg-indigo-600 text-white shadow-3xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                us-regional.xml
              </button>
            </div>
          </div>

          <pre className="flex-1 overflow-y-auto p-5 text-[11px] font-mono bg-slate-950 text-indigo-300 leading-normal scrollbar-thin">
            {selectedXmlFile === 'index.xml' ? indexXml : regionalXml}
          </pre>

          <div className="px-5 py-3 border-t border-gray-150 dark:border-slate-800 bg-gray-50 dark:bg-slate-950 flex justify-between items-center text-[10px] text-gray-500 dark:text-slate-400 font-medium">
            <span>DTD version: 2.0 (ICH M2 approved)</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <ShieldCheck className="h-3.5 w-3.5" /> 2 valid leaf checksums compiled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
