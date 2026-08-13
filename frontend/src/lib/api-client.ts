import { ProductIdentity } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export function getAuthHeader(): Record<string, string> {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('rascript_access_token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

export async function signupApi(data: { username: string; email: string; password: string; full_name?: string }) {
  const res = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Signup failed');
  }
  return body;
}

export async function loginApi(data: { username_or_email: string; password: string }) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Login failed');
  }
  return body;
}

export async function googleAuthApi(data: { token: string; email?: string; name?: string; picture?: string }) {
  const res = await fetch(`${API_BASE}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Google Authentication failed');
  }
  return body;
}

export async function getMeApi() {
  const headers = getAuthHeader();
  if (!headers.Authorization) return null;

  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { ...headers },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfileApi(data: { full_name?: string; username?: string; email?: string; role?: string; avatar_url?: string }) {
  const headers = getAuthHeader();
  const res = await fetch(`${API_BASE}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Profile update failed');
  }
  return body;
}

export async function changePasswordApi(data: { current_password: string; new_password: string }) {
  const headers = getAuthHeader();
  const res = await fetch(`${API_BASE}/users/change-password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.detail || 'Password change failed');
  }
  return body;
}

// ---------------- Existing AI Endpoints ----------------
export async function analyzeDocumentApi(docName: string, category?: string, customText?: string) {
  const headers = getAuthHeader();
  const res = await fetch(`${API_BASE}/gemini/analyze-document`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ documentName: docName, category, customText }),
  });
  if (!res.ok) {
    throw new Error('Analyze document API request failed');
  }
  return res.json();
}

export async function generateDraftApi(sectionId: string, sectionTitle: string, productInfo: ProductIdentity, marketContext: string[]) {
  const headers = getAuthHeader();
  const res = await fetch(`${API_BASE}/gemini/generate-draft`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ sectionId, sectionTitle, productInfo, marketContext }),
  });
  if (!res.ok) {
    throw new Error('Generate draft API request failed');
  }
  return res.json();
}

export async function assistantChatApi(messages: { role: string; content: string }[], productInfo: ProductIdentity, currentSection?: any) {
  const headers = getAuthHeader();
  const res = await fetch(`${API_BASE}/gemini/assistant-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify({ messages, productInfo, currentSection }),
  });
  if (!res.ok) {
    throw new Error('Assistant chat API request failed');
  }
  return res.json();
}

export async function getProductApi(): Promise<ProductIdentity> {
  try {
    const headers = getAuthHeader();
    const res = await fetch(`${API_BASE}/product`, { headers });
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
