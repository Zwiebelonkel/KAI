import { LearningModule, UserProgress } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_KAI_API_URL?.replace(/\/$/, '') || '';
const TOKEN_KEY = 'kai_auth_token';
const USER_KEY = 'kai_auth_user';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

function browserStorage() {
  return typeof window === 'undefined' ? null : window.localStorage;
}

function authHeaders(): HeadersInit {
  const storage = browserStorage();
  if (!storage) return {};
  const token = storage.getItem(TOKEN_KEY);
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
    this.storeAuth(auth);
    return auth;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const auth = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.storeAuth(auth);
    return auth;
  },

  storeAuth(auth: AuthResponse) {
    const storage = browserStorage();
    if (!storage) return;
    storage.setItem(TOKEN_KEY, auth.token);
    storage.setItem(USER_KEY, JSON.stringify(auth.user));
  },

  getToken(): string | null {
    return browserStorage()?.getItem(TOKEN_KEY) || null;
  },

  getStoredUser(): AuthUser | null {
    const raw = browserStorage()?.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  logout() {
    const storage = browserStorage();
    storage?.removeItem(TOKEN_KEY);
    storage?.removeItem(USER_KEY);
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
