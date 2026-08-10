import { ProductIdentity, IngestedDocument, CTDSection, RegulatoryGap, AuditLog, ConsistencyFinding } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export async function analyzeDocumentApi(docName: string, category?: string, customText?: string) {
  const res = await fetch(`${API_BASE}/gemini/analyze-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ documentName: docName, category, customText }),
  });
  if (!res.ok) {
    throw new Error('Analyze document API request failed');
  }
  return res.json();
}

export async function generateDraftApi(sectionId: string, sectionTitle: string, productInfo: ProductIdentity, marketContext: string[]) {
  const res = await fetch(`${API_BASE}/gemini/generate-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sectionId, sectionTitle, productInfo, marketContext }),
  });
  if (!res.ok) {
    throw new Error('Generate draft API request failed');
  }
  return res.json();
}

export async function assistantChatApi(messages: { role: string; content: string }[], productInfo: ProductIdentity, currentSection?: CTDSection) {
  const res = await fetch(`${API_BASE}/gemini/assistant-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, productInfo, currentSection }),
  });
  if (!res.ok) {
    throw new Error('Assistant chat API request failed');
  }
  return res.json();
}

export async function getProductApi(): Promise<ProductIdentity> {
  try {
    const res = await fetch(`${API_BASE}/product`);
    if (res.ok) return res.json();
  } catch (e) {
    console.warn("Could not fetch product from backend, using fallback state", e);
  }
  return {
    genericName: 'Amlodipine Besylate',
    casNumber: '111470-99-6',
    dosageForm: 'Immediate-release tablet',
    strengths: '5mg, 2.5mg, 10mg',
    referenceRLD: 'Norvasc® (Pfizer) - NDA 019787',
    proposedTradeName: 'Amlo-Safe',
    targetMarkets: ['US', 'EU', 'WHO', 'BD']
  };
}
