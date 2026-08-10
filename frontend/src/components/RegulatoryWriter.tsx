'use client';

import React, { useState, useEffect } from 'react';
import { ProductIdentity, CTDSection } from '../types';
import { 
  Sparkles, 
  Loader2, 
  Save, 
  MessageSquare, 
  FileEdit, 
  Eye
} from 'lucide-react';
import Markdown from 'react-markdown';
import { generateDraftApi, assistantChatApi } from '../lib/api-client';

interface RegulatoryWriterProps {
  productInfo: ProductIdentity;
  sections: CTDSection[];
  setSections: React.Dispatch<React.SetStateAction<CTDSection[]>>;
  initialSectionId?: string;
  onLogAudit: (action: string, document?: string, details?: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function RegulatoryWriter({
  productInfo,
  sections,
  setSections,
  initialSectionId = '3.2.P.3',
  onLogAudit
}: RegulatoryWriterProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>(initialSectionId);
  const [editorText, setEditorText] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('preview');

  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I am RA Script, your regulatory intelligence co-pilot. Grounded in ICH, US FDA, and EMA guidelines. Select a section and click 'AI Write Draft' to generate professional submission text, or ask me a guideline question here!"
    }
  ]);
  const [userChatInput, setUserChatInput] = useState<string>('');
  const [isSendingChat, setIsSendingChat] = useState<boolean>(false);

  useEffect(() => {
    if (initialSectionId) {
      setSelectedSectionId(initialSectionId);
    }
  }, [initialSectionId]);

  useEffect(() => {
    const activeSec = sections.find((s) => s.id === selectedSectionId);
    if (activeSec && activeSec.content) {
      setEditorText(activeSec.content);
    } else {
      setEditorText(`### Section ${selectedSectionId} Draft\n\n*Click "AI Write Draft" to trigger generative dossier writing for ${productInfo.genericName}.*`);
    }
  }, [selectedSectionId, sections, productInfo.genericName]);

  const handleSectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSectionId(e.target.value);
  };

  const triggerAiDraft = async () => {
    setIsDrafting(true);
    const activeSec = sections.find((s) => s.id === selectedSectionId);
    onLogAudit('Triggered AI Section Drafting', activeSec?.title || selectedSectionId);

    try {
      const data = await generateDraftApi(
        selectedSectionId,
        activeSec?.title || 'Regulatory Formulation',
        productInfo,
        productInfo.targetMarkets
      );
      setEditorText(data.draftText);
      setViewMode('preview');
      onLogAudit('AI Section Draft Generated Successfully', activeSec?.title || selectedSectionId);

    } catch (error: any) {
      console.error(error);
      alert('Drafting Failed: ' + error.message);
    } finally {
      setIsDrafting(false);
    }
  };

  const saveDraftLocally = () => {
    const activeSec = sections.find((s) => s.id === selectedSectionId);
    setSections((prev) =>
      prev.map((s) => {
        if (s.id === selectedSectionId) {
          return {
            ...s,
            content: editorText,
            status: 'Draft',
            progress: 100
          };
        }
        return s;
      })
    );
    onLogAudit('Saved Section Draft', activeSec?.title || selectedSectionId, 'User revised content');
    alert('Dossier draft saved successfully! Section status updated to "Draft".');
  };

  const sendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim() || isSendingChat) return;

    const userMsg = userChatInput;
    setChatMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setUserChatInput('');
    setIsSendingChat(true);

    try {
      const activeSec = sections.find((s) => s.id === selectedSectionId);
      const data = await assistantChatApi(
        [{ role: 'user', content: userMsg }],
        productInfo,
        activeSec
      );

      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);

    } catch (error: any) {
      console.error(error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error communicating with co-pilot: ${error.message}` }
      ]);
    } finally {
      setIsSendingChat(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fade-in" id="regulatory-writer-container">
      <div className="xl:col-span-8 flex flex-col space-y-4">
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Select Submission Section Template</label>
            <select
              value={selectedSectionId}
              onChange={handleSectionChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs font-bold text-gray-800 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 transition-all min-w-[280px]"
            >
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.id} &mdash; {sec.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={triggerAiDraft}
              disabled={isDrafting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
            >
              {isDrafting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Drafting section...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> AI Write Draft
                </>
              )}
            </button>
            <button
              onClick={saveDraftLocally}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-all flex items-center gap-1.5"
            >
              <Save className="h-3.5 w-3.5" /> Save Draft
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs flex flex-col h-[520px]">
          <div className="px-5 py-3.5 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-950/50 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Currently Drafting: <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold">{selectedSectionId}</span>
              </span>
            </div>
            
            <div className="flex bg-gray-100 dark:bg-slate-800 p-0.5 rounded-lg border border-gray-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('edit')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'edit' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                <FileEdit className="h-3 w-3" /> Edit Markdown
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 text-[11px] font-bold rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'preview' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-3xs' : 'text-gray-500 dark:text-slate-400'
                }`}
              >
                <Eye className="h-3 w-3" /> Render Preview
              </button>
            </div>
          </div>

          <div className="bg-amber-500 text-white text-center py-2 px-4 text-[10px] font-black tracking-wider uppercase shadow-xs">
            DRAFT &mdash; HUMAN REGULATORY REVIEW REQUIRED &bull; NOT APPROVED FOR REGULATORY SUBMISSION
          </div>

          <div className="flex-1 overflow-hidden">
            {viewMode === 'edit' ? (
              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                className="w-full h-full p-6 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-hidden resize-none bg-slate-50 dark:bg-slate-950 leading-relaxed"
                placeholder="Write your regulatory text in raw markdown here..."
              />
            ) : (
              <div className="w-full h-full p-6 overflow-y-auto bg-white dark:bg-slate-900 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="markdown-body">
                  <Markdown>{editorText}</Markdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs h-[645px]">
        <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold">RA Script Co-Pilot</h3>
              <p className="text-[10px] text-indigo-200">Regulatory RAG Assistant</p>
            </div>
          </div>
          <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] font-mono border border-indigo-500/20">
            v1.1
          </span>
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed border ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white border-indigo-700 self-end ml-auto'
                  : 'bg-white dark:bg-slate-900 text-gray-700 dark:text-slate-200 border-gray-150 dark:border-slate-800 self-start'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" /> RA Script Expert
                </div>
              )}
              <div className="prose prose-xs max-w-none dark:prose-invert">
                <div className="markdown-body whitespace-pre-line">
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
          {isSendingChat && (
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl p-3 flex items-center gap-2 self-start text-xs text-gray-500 dark:text-slate-400">
              <Loader2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" /> Co-pilot is reading guidances...
            </div>
          )}
        </div>

        <form onSubmit={sendChatMessage} className="p-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
          <input
            type="text"
            value={userChatInput}
            onChange={(e) => setUserChatInput(e.target.value)}
            placeholder="Ask about ICH, FDA guidelines, or BE studies..."
            className="flex-1 px-3 py-2 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-gray-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-800"
            disabled={isSendingChat}
          />
          <button
            type="submit"
            disabled={isSendingChat || !userChatInput.trim()}
            className="px-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-200 text-white rounded-lg text-xs font-bold cursor-pointer flex items-center justify-center shadow-3xs"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
