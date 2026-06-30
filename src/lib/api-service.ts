import { DifficultyLevel, LearningModule, UserProgress } from "./types";

const DEFAULT_API_BASE_URL = "https://kaiserver-b3dd.onrender.com";
const API_BASE_URL = (
  process.env.NEXT_PUBLIC_KAI_API_URL || DEFAULT_API_BASE_URL
).replace(/\/$/, "");
const TOKEN_KEY = "kai_auth_token";
const USER_KEY = "kai_auth_user";
const ANONYMOUS_ID_KEY = "kai_anonymous_completion_id";
const GUEST_USER_KEY = "kai_guest_user";
const GUEST_PROGRESS_KEY = "kai_guest_progress";

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string | null;
  isGuest?: boolean;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface AdminLearningModule extends LearningModule {
  isPublished?: boolean;
  sortOrder?: number;
}

export interface AdminModuleCompletionPoint {
  day: string;
  completions: number;
}

export interface AdminModuleInput {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
  minLevel: DifficultyLevel;
  glossary: LearningModule["glossary"];
  quiz: LearningModule["quiz"];
  lessonImages?: LearningModule["lessonImages"];
  videoLink?: string;
  isPublished: boolean;
}

function browserStorage() {
  return typeof window === "undefined" ? null : window.localStorage;
}

function browserSessionStorage() {
  return typeof window === "undefined" ? null : window.sessionStorage;
}

export const createEmptyProgress = (): UserProgress => ({
  level: null,
  completedModules: [],
  quizScores: {},
  totalProgress: 0,
  trophies: [],
});

function getAnonymousCompletionId(): string {
  const storage = browserStorage();
  if (!storage) return crypto.randomUUID();

  const existing = storage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;

  const anonymousId = crypto.randomUUID();
  storage.setItem(ANONYMOUS_ID_KEY, anonymousId);
  return anonymousId;
}

function authHeaders(): HeadersInit {
  const storage = browserStorage();
  if (!storage) return {};
  const token = storage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE_URL)
    throw new Error("NEXT_PUBLIC_KAI_API_URL ist nicht gesetzt.");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...init.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      payload?.error || `API request failed (${response.status})`,
    );
  }

  return payload as T;
}

export const kaiApi = {
  isConfigured: Boolean(API_BASE_URL),

  async listModules(): Promise<LearningModule[]> {
    return request<LearningModule[]>("/modules");
  },

  async getModule(moduleId: string): Promise<LearningModule> {
    return request<LearningModule>(`/modules/${encodeURIComponent(moduleId)}`);
  },

  async submitModuleCompletion(moduleId: string): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>("/me/module-completion", {
      method: "POST",
      body: JSON.stringify({ moduleId }),
    });
  },

  async listAdminModules(): Promise<AdminLearningModule[]> {
    return request<AdminLearningModule[]>("/admin/modules");
  },

  async createAdminModule(
    module: AdminModuleInput,
  ): Promise<AdminLearningModule> {
    return request<AdminLearningModule>("/admin/modules", {
      method: "POST",
      body: JSON.stringify(module),
    });
  },

  async updateAdminModule(
    moduleId: string,
    module: AdminModuleInput,
  ): Promise<AdminLearningModule> {
    return request<AdminLearningModule>(
      `/admin/modules/${encodeURIComponent(moduleId)}`,
      {
        method: "PUT",
        body: JSON.stringify(module),
      },
    );
  },

  async deleteAdminModule(moduleId: string): Promise<{ ok: boolean }> {
    return request<{ ok: boolean }>(
      `/admin/modules/${encodeURIComponent(moduleId)}`,
      {
        method: "DELETE",
      },
    );
  },

  async getAdminModuleCompletions(
    moduleId: string,
  ): Promise<AdminModuleCompletionPoint[]> {
    const rows = await request<
      Array<AdminModuleCompletionPoint & { moduleId: string }>
    >("/admin/stats/module-completions-daily");

    return rows
      .filter((row) => row.moduleId === moduleId && row.day)
      .map(({ day, completions }) => ({ day, completions }));
  },

  async register(
    email: string,
    password: string,
    displayName?: string,
  ): Promise<AuthResponse> {
    const auth = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, displayName }),
    });
    this.storeAuth(auth);
    return auth;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const auth = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.storeAuth(auth);
    return auth;
  },

  storeAuth(auth: AuthResponse) {
    const storage = browserStorage();
    if (!storage) return;
    browserSessionStorage()?.removeItem(GUEST_USER_KEY);
    browserSessionStorage()?.removeItem(GUEST_PROGRESS_KEY);
    storage.setItem(TOKEN_KEY, auth.token);
    storage.setItem(USER_KEY, JSON.stringify(auth.user));
  },

  startGuestSession(): AuthUser {
    const guestUser: AuthUser = {
      id: `guest-${crypto.randomUUID()}`,
      email: "",
      displayName: "Gast",
      isGuest: true,
    };
    const sessionStorage = browserSessionStorage();
    sessionStorage?.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
    sessionStorage?.setItem(GUEST_PROGRESS_KEY, JSON.stringify(createEmptyProgress()));
    return guestUser;
  },

  getToken(): string | null {
    return browserStorage()?.getItem(TOKEN_KEY) || null;
  },

  getStoredUser(): AuthUser | null {
    const guestRaw = browserSessionStorage()?.getItem(GUEST_USER_KEY);
    if (guestRaw) {
      try {
        return JSON.parse(guestRaw) as AuthUser;
      } catch {
        browserSessionStorage()?.removeItem(GUEST_USER_KEY);
      }
    }

    const raw = browserStorage()?.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  },

  isGuestSession(): boolean {
    return Boolean(browserSessionStorage()?.getItem(GUEST_USER_KEY));
  },

  getGuestProgress(): UserProgress {
    const raw = browserSessionStorage()?.getItem(GUEST_PROGRESS_KEY);
    if (!raw) return createEmptyProgress();
    try {
      return JSON.parse(raw) as UserProgress;
    } catch {
      return createEmptyProgress();
    }
  },

  saveGuestProgress(progress: UserProgress): UserProgress {
    browserSessionStorage()?.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress));
    return progress;
  },

  logout() {
    const storage = browserStorage();
    storage?.removeItem(TOKEN_KEY);
    storage?.removeItem(USER_KEY);
    const sessionStorage = browserSessionStorage();
    sessionStorage?.removeItem(GUEST_USER_KEY);
    sessionStorage?.removeItem(GUEST_PROGRESS_KEY);
  },

  async getProgress(): Promise<UserProgress> {
    return request<UserProgress>("/me/progress");
  },

  async saveProgress(progress: UserProgress): Promise<UserProgress> {
    return request<UserProgress>("/me/progress", {
      method: "PUT",
      body: JSON.stringify(progress),
    });
  },
};
