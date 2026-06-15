import { DifficultyLevel, LearningModule, UserProgress } from './types';

const DEFAULT_API_BASE_URL = 'https://kaiserver-b3dd.onrender.com';
const API_BASE_URL = (process.env.NEXT_PUBLIC_KAI_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
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

export interface AdminLearningModule extends LearningModule {
  isPublished?: boolean;
  sortOrder?: number;
}

export interface AdminModuleInput {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  minLevel: DifficultyLevel;
  glossary: LearningModule['glossary'];
  quiz: LearningModule['quiz'];
  isPublished: boolean;
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

  async listAdminModules(): Promise<AdminLearningModule[]> {
    return request<AdminLearningModule[]>('/admin/modules');
  },

  async createAdminModule(module: AdminModuleInput): Promise<AdminLearningModule> {
    return request<AdminLearningModule>('/admin/modules', {
      method: 'POST',
      body: JSON.stringify(module),
    });
  },

  async updateAdminModule(moduleId: string, module: AdminModuleInput): Promise<AdminLearningModule> {
    return request<AdminLearningModule>(`/admin/modules/${encodeURIComponent(moduleId)}`, {
      method: 'PUT',
      body: JSON.stringify(module),
    });
  },

  async deleteAdminModule(moduleId: string): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>(`/admin/modules/${encodeURIComponent(moduleId)}`, {
      method: 'DELETE',
    });
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
