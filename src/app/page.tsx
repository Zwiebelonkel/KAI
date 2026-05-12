
"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { LevelSelector } from "@/components/LevelSelector"
import { DifficultyLevel, UserProgress } from "@/lib/types"
import { modules } from "@/lib/course-data"
import { ModuleCard } from "@/components/ModuleCard"
import { Button } from "@/components/ui/button"
import { Trophy, ShieldAlert, Award, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

export default function Home() {
  const [progress, setProgress] = React.useState<UserProgress>({
    level: null,
    completedModules: [],
    quizScores: {},
    totalProgress: 0,
    trophies: []
  });

  const containerRef = React.useRef<HTMLDivElement>(null);

  // Load progress from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('kai_user_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  useGSAP(() => {
    if (progress.level && containerRef.current) {
      const tl = gsap.timeline();
      
      tl.from(".hero-content > *", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out"
      });

      tl.from(".module-card-item", {
        scale: 0.95,
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.6,
        ease: "back.out(1.7)"
      }, "-=0.4");
    }
  }, [progress.level]);

  const handleLevelSelect = (level: DifficultyLevel) => {
    const nextProgress = { ...progress, level };
    setProgress(nextProgress);
    localStorage.setItem('kai_user_progress', JSON.stringify(nextProgress));
  };

  const resetLevel = () => {
    const reset: UserProgress = {
      level: null,
      completedModules: [],
      quizScores: {},
      totalProgress: 0,
      trophies: []
    };
    setProgress(reset);
    localStorage.removeItem('kai_user_progress');
  };

  if (!progress.level) {
    return <LevelSelector onSelect={handleLevelSelect} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 overflow-x-hidden" ref={containerRef}>
      <div className="mesh-bg" />
      <Header />
      
      <main className="container mx-auto px-4 max-w-6xl">
        <section className="mb-16 hero-content">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                  {progress.level}
                </span>
                <button 
                  onClick={resetLevel} 
                  className="text-xs text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary"
                >
                  Level ändern
                </button>
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                Dein Lernpfad
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                Meistere die Grundlagen der künstlichen Intelligenz Schritt für Schritt und sammle exklusive Trophäen.
              </p>
            </div>
            
            <div className="flex items-center gap-6 p-6 glass-card rounded-3xl border-white/5 relative group overflow-hidden">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-secondary/20 p-3 rounded-2xl text-secondary violet-shadow animate-float">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Fortschritt</div>
                  <div className="text-3xl font-black text-white">{Math.round((progress.completedModules.length / modules.length) * 100)}<span className="text-secondary">%</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modules.map((module) => {
              const isCompleted = progress.completedModules.includes(module.id);
              const isLocked = progress.level === 'Einsteiger' && module.minLevel === 'Fortgeschritten';
              const moduleProgress = isCompleted ? 100 : 0;
              
              return (
                <div key={module.id} className="module-card-item h-full">
                  <ModuleCard 
                    module={module} 
                    isLocked={isLocked}
                    isCompleted={isCompleted}
                    progress={moduleProgress}
                  />
                </div>
              );
            })}
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <div className="p-10 md:p-16 rounded-[2.5rem] glass-card relative overflow-hidden group border-white/10">
            <div className="absolute -right-20 -top-20 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000">
              <Trophy className="w-96 h-96" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="bg-primary/20 p-4 rounded-2xl w-fit mb-8 border border-primary/30 neon-shadow animate-float">
                <ShieldAlert className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">KI-Kompetenz Check</h2>
              <p className="text-muted-foreground text-xl mb-10 leading-relaxed font-medium">
                Bist du bereit für die Praxis? In diesem Test musst du echte von KI-generierten Inhalten unterscheiden. Ein Muss für jeden angehenden Experten.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <Link href="/assessment">
                  <Button 
                    size="lg" 
                    disabled={progress.completedModules.length < 2} 
                    className="px-12 h-16 rounded-full neon-shadow text-lg font-bold group"
                  >
                    Jetzt Test starten <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </Button>
                </Link>
                {progress.completedModules.length < 2 && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Noch {2 - progress.completedModules.length} Module bis zum Unlock
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
