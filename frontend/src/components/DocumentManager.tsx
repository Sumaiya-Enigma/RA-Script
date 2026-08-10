'use client';

import React, { useState, useRef } from 'react';
import { IngestedDocument, ProductIdentity } from '../types';
import { 
  Upload, 
  FileText, 
  Loader2, 
  FileCheck2, 
  Sparkles, 
  Eye, 
  HelpCircle, 
  Database
} from 'lucide-react';
import { analyzeDocumentApi } from '../lib/api-client';

interface DocumentManagerProps {
  documents: IngestedDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<IngestedDocument[]>>;
  productInfo: ProductIdentity;
  onLogAudit: (action: string, document?: string, details?: string) => void;
  onUpdateSections: (sectionId: string, summary: string, aiNote: string, status: 'Review' | 'Done' | 'Draft') => void;
}

export default function DocumentManager({
  documents,
  setDocuments,
  productInfo,
  onLogAudit,
  onUpdateSections
}: DocumentManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<IngestedDocument | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = (fileList: FileList) => {
    const newDocs: IngestedDocument[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const id = 'doc-' + Date.now() + '-' + Math.round(Math.random() * 1000);
      newDocs.push({
        id,
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'PDF',
        category: 'Ingested Unclassified',
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'processing'
      });
      onLogAudit('Uploaded document', file.name, `Size: ${file.size}`);
    }

    setDocuments((prev) => [...newDocs, ...prev]);

    newDocs.forEach((doc) => {
      setTimeout(() => {
        setDocuments((prev) =>
          prev.map((d) => (d.id === doc.id ? { ...d, status: 'completed' } : d))
        );
        onLogAudit('Ingestion Completed (OCR Ready)', doc.name);
      }, 1500);
    });
  };

  const analyzeDocWithGemini = async (doc: IngestedDocument) => {
    setIsAnalyzing(doc.id);
    setSelectedDoc(null);
    onLogAudit('Triggered AI Document Classification & Extraction', doc.name);

    try {
      const analysisResult = await analyzeDocumentApi(
        doc.name,
        doc.category,
        `This is a pharmaceutical ${doc.category} for manufacturing INN ${productInfo.genericName}. Specifications require ALCOA+ standards.`
      );

      setDocuments((prev) =>
        prev.map((d) => {
          if (d.id === doc.id) {
            return {
              ...d,
              category: analysisResult.category,
              moduleClass: analysisResult.moduleClass,
              sectionClass: analysisResult.sectionClass,
              extractedData: analysisResult.extractedData,
              aiNote: analysisResult.aiNote
            };
          }
          return d;
        })
      );

      onLogAudit('AI Document Analysis Completed Successfully', doc.name, `Classified to ${analysisResult.sectionClass}`);
      
      if (analysisResult.sectionClass) {
        onUpdateSections(
          analysisResult.sectionClass, 
          `Data ingested from supplier document: ${doc.name}. Classified into ${analysisResult.sectionClass}. Parameters extracted: Batch Size ${analysisResult.extractedData?.batchSize || 'N/A'}, Shelf Life ${analysisResult.extractedData?.shelfLife || 'N/A'}.`,
          analysisResult.aiNote,
          'Review'
        );
      }

      const updatedDoc = {
        ...doc,
        category: analysisResult.category,
        moduleClass: analysisResult.moduleClass,
        sectionClass: analysisResult.sectionClass,
        extractedData: analysisResult.extractedData,
        aiNote: analysisResult.aiNote
      };
      setSelectedDoc(updatedDoc);

    } catch (err: any) {
      console.error(err);
      alert('Gemini Analysis Error: ' + err.message);
    } finally {
      setIsAnalyzing(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="document-manager-container">
      <div className="lg:col-span-7 space-y-6">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer min-h-[180px] flex flex-col justify-center items-center gap-3 ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40'
              : 'border-gray-200 dark:border-slate-800 hover:border-indigo-400 bg-white dark:bg-slate-900 hover:bg-gray-50/50 dark:hover:bg-slate-850'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            multiple
          />
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/60 rounded-full text-indigo-600 dark:text-indigo-400">
            <Upload className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-200">
              Drag and drop your pharmaceutical files or <span className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">browse</span>
            </p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1">
              Supports PDF, DOCX, Excel, Certificates, stability reports, LIMS, QMS exports (Up to 50MB)
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase tracking-wider">Ingested Document Repository</h3>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">ALCOA+ version controlled pipeline logs</p>
            </div>
            <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 font-medium rounded-full">
              {documents.length} Files Ingested
            </span>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-slate-800 max-h-[400px] overflow-y-auto">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                onClick={() => doc.status === 'completed' && setSelectedDoc(doc)}
                className={`p-4 flex items-center justify-between gap-4 transition-all hover:bg-gray-50 dark:hover:bg-slate-800/60 cursor-pointer ${
                  selectedDoc?.id === doc.id ? 'bg-indigo-50/30 dark:bg-indigo-950/30' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{doc.name}</p>
                      <span className="text-[9px] text-gray-400 dark:text-slate-500 font-mono">({doc.size})</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-gray-400 dark:text-slate-400 mt-1 flex-wrap">
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-800 px-1 rounded-xs">
                        {doc.category}
                      </span>
                      {doc.sectionClass && (
                        <>
                          <span>&bull;</span>
                          <span className="text-slate-600 dark:text-slate-300 font-bold font-mono">CTD: {doc.sectionClass}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {doc.status === 'processing' ? (
                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                      <Loader2 className="h-3 w-3 animate-spin" /> Ingesting
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        analyzeDocWithGemini(doc);
                      }}
                      disabled={isAnalyzing !== null}
                      className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white rounded text-[10px] font-bold shadow-3xs cursor-pointer flex items-center gap-1"
                    >
                      {isAnalyzing === doc.id ? (
                        <>
                          <Loader2 className="h-2.5 w-2.5 animate-spin" /> Analyzing
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-2.5 w-2.5" /> AI Classify & Extract
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        {selectedDoc ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs space-y-5 sticky top-6">
            <div className="flex justify-between items-start border-b border-gray-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">Classification & Parameters</span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedDoc.name}</h3>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">Parsed via Gemini OCR Engine</p>
              </div>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-semibold rounded flex items-center gap-0.5">
                <FileCheck2 className="h-3 w-3" /> OCR Ready
              </span>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 text-white p-3.5 rounded-lg flex justify-between items-center border border-slate-800">
              <div>
                <p className="text-[9px] font-semibold uppercase text-slate-400">Classified Location</p>
                <p className="text-xs font-bold mt-0.5">{selectedDoc.moduleClass || 'Pending AI Classification'}</p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-semibold uppercase text-slate-400">Section code</p>
                <p className="text-xs font-mono font-bold mt-0.5 text-indigo-300">{selectedDoc.sectionClass || 'Unassigned'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-800 dark:text-slate-200 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-slate-500" /> Extracted Parameters
              </h4>
              <div className="divide-y divide-gray-100 dark:divide-slate-800 bg-gray-50 dark:bg-slate-800/60 border border-gray-200 dark:border-slate-700 rounded-lg p-2 text-xs space-y-2">
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Product / Brand</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{selectedDoc.extractedData?.productName || 'Not found'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Strength</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{selectedDoc.extractedData?.strength || 'Not found'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Dosage Form</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{selectedDoc.extractedData?.dosageForm || 'Not found'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Manufacturer</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{selectedDoc.extractedData?.manufacturer || 'Not found'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Manufacturing Site</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100 truncate max-w-[200px]">{selectedDoc.extractedData?.manufacturingSite || 'Not found'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Batch Size</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{selectedDoc.extractedData?.batchSize || 'Not found'}</span>
                </div>
                <div className="flex justify-between py-1.5 px-2">
                  <span className="text-gray-500 dark:text-slate-400 font-medium">Shelf Life</span>
                  <span className="font-semibold text-gray-800 dark:text-slate-100">{selectedDoc.extractedData?.shelfLife || 'Not found'}</span>
                </div>
              </div>
            </div>

            {selectedDoc.aiNote && (
              <div className="p-3.5 rounded-lg bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900 text-sky-900 dark:text-sky-200 text-xs">
                <div className="flex items-center gap-1.5 mb-1">
                  <HelpCircle className="h-4 w-4 text-sky-500" />
                  <span className="font-bold text-gray-800 dark:text-slate-100">Expert System Advisor</span>
                </div>
                <p className="text-gray-600 dark:text-slate-300 leading-relaxed text-[11px]">{selectedDoc.aiNote}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-8 text-center text-gray-400 dark:text-slate-500 flex flex-col items-center justify-center min-h-[300px] gap-2">
            <div className="p-3.5 bg-gray-50 dark:bg-slate-800 rounded-full border border-gray-200 dark:border-slate-700">
              <Eye className="h-6 w-6 text-gray-400 dark:text-slate-500" />
            </div>
            <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mt-2">No Document Selected</p>
            <p className="text-[10px] text-gray-400 dark:text-slate-500 max-w-[220px]">
              Click on an ingested file or run "AI Classify & Extract" to inspect clinical parameters and GxP notes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
