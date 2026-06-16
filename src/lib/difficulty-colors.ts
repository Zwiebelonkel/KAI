import { DifficultyLevel } from "./types";

export type DifficultyColors = {
  badge: string;
  cardBorder: string;
  cardSurface: string;
  glow: string;
  gradient: string;
  icon: string;
  title: string;
  action: string;
  progress: string;
  progressTrack: string;
  completedTrack: string;
  selectedBorder: string;
  selectedShadow: string;
  selectedArrow: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  accentShadow: string;
};

export const difficultyColors: Record<DifficultyLevel, DifficultyColors> = {
  Einsteiger: {
    badge: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
    cardBorder: "border-emerald-400/20 hover:border-emerald-400/45",
    cardSurface: "bg-emerald-500/[0.025]",
    glow: "bg-emerald-400/10",
    gradient: "from-emerald-500/30 to-teal-400/10",
    icon: "bg-emerald-500/10 text-emerald-300",
    title: "group-hover:text-emerald-300",
    action: "text-emerald-300",
    progress: "bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.45)]",
    progressTrack: "bg-emerald-500/10",
    completedTrack: "bg-green-500/10",
    selectedBorder: "border-emerald-400/70",
    selectedShadow: "shadow-[0_0_55px_rgba(52,211,153,0.26)]",
    selectedArrow: "border-emerald-400 bg-emerald-400 text-slate-950",
    accentText: "text-emerald-300",
    accentBg: "bg-emerald-500/20",
    accentBorder: "border-emerald-400/30",
    accentShadow: "shadow-[0_0_35px_rgba(52,211,153,0.28)]",
  },
  Basics: {
    badge: "bg-sky-500/15 text-sky-300 border-sky-400/25",
    cardBorder: "border-sky-400/20 hover:border-sky-400/45",
    cardSurface: "bg-sky-500/[0.025]",
    glow: "bg-sky-400/10",
    gradient: "from-sky-500/30 to-cyan-400/10",
    icon: "bg-sky-500/10 text-sky-300",
    title: "group-hover:text-sky-300",
    action: "text-sky-300",
    progress: "bg-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.45)]",
    progressTrack: "bg-sky-500/10",
    completedTrack: "bg-green-500/10",
    selectedBorder: "border-sky-400/70",
    selectedShadow: "shadow-[0_0_55px_rgba(56,189,248,0.26)]",
    selectedArrow: "border-sky-400 bg-sky-400 text-slate-950",
    accentText: "text-sky-300",
    accentBg: "bg-sky-500/20",
    accentBorder: "border-sky-400/30",
    accentShadow: "shadow-[0_0_35px_rgba(56,189,248,0.28)]",
  },
  Fortgeschritten: {
    badge: "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-400/25",
    cardBorder: "border-fuchsia-400/20 hover:border-fuchsia-400/45",
    cardSurface: "bg-fuchsia-500/[0.025]",
    glow: "bg-fuchsia-400/10",
    gradient: "from-fuchsia-500/30 to-purple-400/10",
    icon: "bg-fuchsia-500/10 text-fuchsia-300",
    title: "group-hover:text-fuchsia-300",
    action: "text-fuchsia-300",
    progress: "bg-fuchsia-400 shadow-[0_0_20px_rgba(232,121,249,0.45)]",
    progressTrack: "bg-fuchsia-500/10",
    completedTrack: "bg-green-500/10",
    selectedBorder: "border-fuchsia-400/70",
    selectedShadow: "shadow-[0_0_55px_rgba(232,121,249,0.26)]",
    selectedArrow: "border-fuchsia-400 bg-fuchsia-400 text-slate-950",
    accentText: "text-fuchsia-300",
    accentBg: "bg-fuchsia-500/20",
    accentBorder: "border-fuchsia-400/30",
    accentShadow: "shadow-[0_0_35px_rgba(232,121,249,0.28)]",
  },
};

export function getDifficultyColors(level: DifficultyLevel): DifficultyColors {
  return difficultyColors[level];
}
