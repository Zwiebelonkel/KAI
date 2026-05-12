
"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { LevelSelector } from "@/components/LevelSelector"
import { DifficultyLevel, UserProgress } from "@/lib/types"
import { modules } from "@/lib/course-data"
import { ModuleCard } from "@/components/ModuleCard"
import { Button } from "@/components/ui/button"
import { Trophy, ShieldAlert, Award, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  const [progress, setProgress] = React.useState<UserProgress>(() => {
    // In a real app, this would load from a database/localStorage
    return {
      level: null,
      completedModules: [],
      quizScores: {},
      totalProgress: 0
    };
  });

  const handleLevelSelect = (level: DifficultyLevel) => {
    setProgress(prev => ({ ...prev, level }));
  };

  const resetLevel = () => {
    setProgress({
      level: null,
      completedModules: [],
      quizScores: {},
      totalProgress: 0
    });
  };

  if (!progress.level) {
    return <LevelSelector onSelect={handleLevelSelect} />;
  }

  // Filter modules based on level (simplified: show all but mark some as advanced)
  const availableModules = modules;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <Header />
      
      <main className="container mx-auto px-4 max-w-6xl">
        <section className="mb-12 animate-fade-in">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
                  {progress.level}
                </span>
                <button onClick={resetLevel} className="text-xs text-muted-foreground hover:text-primary underline">Level ändern</button>
              </div>
              <h2 className="text-4xl font-bold tracking-tight">Dein Lernpfad</h2>
            </div>
            
            <div className="flex items-center gap-6 p-4 glass-card rounded-2xl border-primary/20">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded-xl text-secondary">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-semibold">Gesamtfortschritt</div>
                  <div className="text-2xl font-bold">{Math.round((progress.completedModules.length / modules.length) * 100)}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableModules.map((module) => {
              const isCompleted = progress.completedModules.includes(module.id);
              const isLocked = progress.level === 'Einsteiger' && module.minLevel === 'Fortgeschritten';
              const moduleProgress = isCompleted ? 100 : 0; // Simplified for demo
              
              return (
                <ModuleCard 
                  key={module.id} 
                  module={module} 
                  isLocked={isLocked}
                  isCompleted={isCompleted}
                  progress={moduleProgress}
                />
              );
            })}
          </div>
        </section>

        <section className="animate-fade-in delay-200">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-12 -top-12 opacity-5 rotate-12 group-hover:rotate-0 transition-transform duration-700">
              <Trophy className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 max-w-2xl">
              <div className="bg-white/10 p-2 rounded-xl w-fit mb-6 border border-white/10">
                <ShieldAlert className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Abschlusstest: KI-Kompetenz Check</h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Bist du bereit, dein Wissen in der Praxis zu testen? Dieser Test prüft deine Fähigkeit, KI-generierte Fehlinformationen im Alltag zu erkennen.
              </p>
              
              <Link href="/assessment">
                <Button 
                  size="lg" 
                  disabled={progress.completedModules.length < 2} 
                  className="px-10 h-14 rounded-full neon-shadow"
                >
                  Zum Transfer-Test <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              {progress.completedModules.length < 2 && (
                <p className="text-xs text-muted-foreground mt-4">
                  Sperre den Test frei, indem du mindestens 2 Module abschließt.
                </p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
