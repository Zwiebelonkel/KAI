
"use client"

import { LearningModule } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Sparkles, TrendingUp, Grid, Cpu, Lock, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { ProgressBar } from "./ProgressBar"

interface ModuleCardProps {
  module: LearningModule;
  isLocked: boolean;
  isCompleted: boolean;
  progress: number;
}

const iconMap: Record<string, any> = {
  Sparkles,
  TrendingUp,
  Grid,
  Cpu
};

export function ModuleCard({ module, isLocked, isCompleted, progress }: ModuleCardProps) {
  const Icon = iconMap[module.icon] || Sparkles;

  const content = (
    <div className={cn(
      "p-6 rounded-2xl glass-card transition-all duration-300 relative group border-2 h-full flex flex-col",
      isLocked ? "opacity-60 grayscale cursor-not-allowed" : "hover:border-primary/50 hover:-translate-y-1 border-transparent",
      isCompleted ? "border-secondary/20 bg-secondary/5" : ""
    )}>
      {isCompleted && (
        <div className="absolute top-4 right-4 text-secondary animate-fade-in">
          <CheckCircle2 className="w-6 h-6 fill-secondary/20" />
        </div>
      )}

      {isLocked && (
        <div className="absolute top-4 right-4 text-muted-foreground">
          <Lock className="w-5 h-5" />
        </div>
      )}

      <div className="bg-primary/10 p-3 rounded-xl w-fit mb-6 text-primary group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6" />
      </div>

      <h3 className="text-xl font-bold mb-2">{module.title}</h3>
      <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed flex-grow">
        {module.description}
      </p>

      <div className="space-y-2 mt-auto">
        <div className="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Fortschritt</span>
          <span>{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>
    </div>
  );

  if (isLocked) {
    return content;
  }

  return (
    <Link href={`/learn/${module.id}`} className="block h-full">
      {content}
    </Link>
  );
}
