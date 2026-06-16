import { DifficultyLevel } from "./types";

export type DifficultyStyle = {
  badge: string;
  cardBorder: string;
  glow: string;
  icon: string;
  title: string;
  action: string;
  progress: string;
  progressTrack: string;
  completedTrack: string;
};

export const difficultyStyles: Record<DifficultyLevel, DifficultyStyle> = {
  Einsteiger: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
    cardBorder: "hover:border-emerald-400/45",
    glow: "bg-emerald-400/10",
    icon: "bg-emerald-500/10 text-emerald-300",
    title: "group-hover:text-emerald-300",
    action: "text-emerald-300",
    progress: "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.45)]",
    progressTrack: "bg-emerald-500/10",
    completedTrack: "bg-green-500/10",
  },
  Basics: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-400/25",
    cardBorder: "hover:border-sky-400/45",
    glow: "bg-sky-400/10",
    icon: "bg-sky-500/10 text-sky-300",
    title: "group-hover:text-sky-300",
    action: "text-sky-300",
    progress: "bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.45)]",
    progressTrack: "bg-sky-500/10",
    completedTrack: "bg-green-500/10",
  },
  Fortgeschritten: {
    badge: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/25",
    cardBorder: "hover:border-fuchsia-400/45",
    glow: "bg-fuchsia-400/10",
    icon: "bg-fuchsia-500/10 text-fuchsia-300",
    title: "group-hover:text-fuchsia-300",
    action: "text-fuchsia-300",
    progress: "bg-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.45)]",
    progressTrack: "bg-fuchsia-500/10",
    completedTrack: "bg-green-500/10",
  },
};

export function getDifficultyStyle(level: DifficultyLevel): DifficultyStyle {
  return difficultyStyles[level];
}
