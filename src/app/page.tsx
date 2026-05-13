
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

  const isAssessmentUnlocked = progress.completedModules.length >= 2;

  return (
    <div className="min-h-screen pt-20 pb-12 overflow-x-hidden" ref={containerRef}>
      <div className="mesh-bg" />
      <Header />
      
      <main className="container mx-auto px-4 max-w-6xl">
        <section className="mb-12 md:mb-16 hero-content">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-8 md:mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                  {progress.level}
                </span>
                <button 
                  onClick={resetLevel} 
                  className="text-xs text-muted-foreground hover:text-primary transition-colors border-b border-transparent hover:border-primary"
                >
                  Level ändern
                </button>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50 leading-tight">
                Dein Lernpfad
              </h2>
              <p className="text-muted-foreground text-base md:text-lg max-w-xl leading-relaxed">
                Meistere die Grundlagen der künstlichen Intelligenz Schritt für Schritt und sammle exklusive Trophäen.
              </p>
            </div>
            
            <div className="flex items-center gap-4 p-4 md:p-6 glass-card rounded-2xl md:rounded-3xl border-white/5 relative group overflow-hidden w-full md:w-auto">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-secondary/20 p-2 md:p-3 rounded-xl md:rounded-2xl text-secondary violet-shadow animate-float">
                  <Award className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Fortschritt</div>
                  <div className="text-2xl md:text-3xl font-black text-white">{Math.round((progress.completedModules.length / modules.length) * 100)}<span className="text-secondary">%</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
          <div className="p-8 md:p-16 rounded-[1.5rem] md:rounded-[2.5rem] glass-card relative overflow-hidden group border-white/10">
            <div className="absolute -right-20 -top-20 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000 hidden md:block">
              <Trophy className="w-96 h-96" />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-50" />
            
            <div className="relative z-10 max-w-2xl">
              <div className="bg-primary/20 p-3 md:p-4 rounded-xl md:rounded-2xl w-fit mb-6 md:mb-8 border border-primary/30 neon-shadow animate-float">
                <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight">KI-Kompetenz Check</h2>
              <p className="text-muted-foreground text-base md:text-xl mb-8 leading-relaxed font-medium">
                Bist du bereit für die Praxis? In diesem Test musst du echte von KI-generierten Inhalten unterscheiden. Ein Muss für jeden angehenden Experten.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {isAssessmentUnlocked ? (
                  <Link href="/assessment" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      className="w-full sm:px-12 h-14 md:h-16 rounded-full neon-shadow text-base md:text-lg font-bold group"
                    >
                      Test starten <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    size="lg" 
                    disabled
                    className="w-full sm:px-12 h-14 md:h-16 rounded-full text-base md:text-lg font-bold opacity-50 cursor-not-allowed"
                  >
                    Test gesperrt <ArrowRight className="ml-2 w-5 h-5 md:w-6 md:h-6" />
                  </Button>
                )}
                
                {!isAssessmentUnlocked && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground font-semibold">
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
