import { LearningModule, UserProgress } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_KAI_API_URL?.replace(/\/$/, '') || '';
const TOKEN_KEY = 'kai_auth_token';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

function authHeaders(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL) throw new Error('NEXT_PUBLIC_KAI_API_URL ist nicht gesetzt.');

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...init.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || `API request failed (${response.status})`);
  }

  return payload as T;
}

export const kaiApi = {
  isConfigured: Boolean(API_BASE_URL),

  async listModules(): Promise<LearningModule[]> {
    return request<LearningModule[]>('/modules');
  },

  async getModule(moduleId: string): Promise<LearningModule> {
    return request<LearningModule>(`/modules/${encodeURIComponent(moduleId)}`);
  },

  async register(email: string, password: string, displayName?: string): Promise<AuthResponse> {
    const auth = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    localStorage.setItem(TOKEN_KEY, auth.token);
    return auth;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const auth = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, auth.token);
    return auth;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async getProgress(): Promise<UserProgress> {
    return request<UserProgress>('/me/progress');
  },

  async saveProgress(progress: UserProgress): Promise<UserProgress> {
    return request<UserProgress>('/me/progress', {
      method: 'PUT',
      body: JSON.stringify(progress),
    });
  },
};
