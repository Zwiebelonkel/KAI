"use client"

import { LearningModule } from "@/lib/types"
import { cn } from "@/lib/utils"
import { getModuleIcon } from "@/lib/module-icons"
import { ArrowUpRight, CheckCircle2, Lock } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "./ProgressBar"
import { getDifficultyStyle } from "@/lib/difficulty-styles"

interface ModuleCardProps {
  module: LearningModule;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
}

export function ModuleCard({ module, isLocked, isCompleted, progress }: ModuleCardProps) {
  const Icon = getModuleIcon(module.icon);
  const difficultyStyle = getDifficultyStyle(module.minLevel);

  const content = (
    <div className={cn(
      "p-8 rounded-[2rem] glass-card transition-all duration-500 relative group border-2 h-full flex flex-col overflow-hidden",
      isLocked 
        ? "opacity-40 grayscale pointer-events-none" 
        : cn("hover:-translate-y-2 border-transparent cursor-pointer", difficultyStyle.cardBorder),
      isCompleted ? "bg-secondary/[0.03]" : ""
    )}>
      {/* Background glow effect on hover */}
      {!isLocked && (
        <div className={cn("absolute -inset-24 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none", difficultyStyle.glow)} />
      )}

      {isCompleted && (
        <div className="absolute top-6 right-6 text-green-500 animate-in zoom-in duration-500">
          <CheckCircle2 className="w-7 h-7 fill-green-500/10" />
        </div>
      )}

      {isLocked && (
        <div className="absolute top-6 right-6 text-muted-foreground/50">
          <Lock className="w-6 h-6" />
        </div>
      )}

      <div className={cn(
        "p-4 rounded-2xl w-fit mb-8 relative transition-transform duration-500 group-hover:scale-110",
        isCompleted ? "bg-green-500/10 text-green-400" : difficultyStyle.icon
      )}>
        <Icon className="w-8 h-8" />
        <div className="absolute inset-0 bg-current opacity-10 blur-xl rounded-full" />
      </div>

      <div className="mb-8 relative z-10">
        <h3 className={cn("text-2xl font-black mb-3 tracking-tight transition-colors", difficultyStyle.title)}>{module.title}</h3>
        <p className="text-muted-foreground font-medium line-clamp-2 leading-relaxed text-sm">
          {module.description}
        </p>
      </div>

      <div className="space-y-4 mt-auto relative z-10">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          <span>Status</span>
          <span className={cn(isCompleted ? "text-green-400" : "")}>{progress}%</span>
        </div>
        <ProgressBar
          value={progress}
          className={isCompleted ? difficultyStyle.completedTrack : difficultyStyle.progressTrack}
          indicatorClassName={isCompleted ? "bg-green-400 shadow-[0_0_20px_rgba(74,222,128,0.45)]" : difficultyStyle.progress}
        />
        
        {!isLocked && (
          <div className={cn("flex items-center gap-2 text-xs font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 pt-2", difficultyStyle.action)}>
            Lektion starten <ArrowUpRight className="w-3 h-3" />
          </div>
        )}
      </div>
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link href={`/learn?moduleId=${encodeURIComponent(module.id)}`} className="block h-full outline-none">
      {content}
    </Link>
  );
}
