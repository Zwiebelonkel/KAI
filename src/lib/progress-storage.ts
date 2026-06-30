import { UserProgress } from "@/lib/types";

const PROGRESS_KEY = "kai_guest_progress";
const LEGACY_PROGRESS_KEY = "kai_user_progress";

export const createEmptyProgress = (): UserProgress => ({
  level: null,
  completedModules: [],
  quizScores: {},
  totalProgress: 0,
  trophies: [],
});

const canUseBrowserStorage = () => typeof window !== "undefined";

export const loadGuestProgress = (): UserProgress | null => {
  if (!canUseBrowserStorage()) return null;

  const saved = window.sessionStorage.getItem(PROGRESS_KEY);
  if (!saved) return null;

  try {
    return JSON.parse(saved) as UserProgress;
  } catch {
    window.sessionStorage.removeItem(PROGRESS_KEY);
    return null;
  }
};

export const saveGuestProgress = (progress: UserProgress) => {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
};

export const clearGuestProgress = () => {
  if (!canUseBrowserStorage()) return;
  window.sessionStorage.removeItem(PROGRESS_KEY);
  window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
};

export const clearLegacyProgress = () => {
  if (!canUseBrowserStorage()) return;
  window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
};
