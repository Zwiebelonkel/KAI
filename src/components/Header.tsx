
"use client"

import * as React from "react"
import { BrainCircuit, UserCircle, Trophy, BookOpen, CheckCircle2, Sparkles } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { UserProgress } from "@/lib/types"
import { modules } from "@/lib/course-data"
import { ProgressBar } from "./ProgressBar"
import { getRarityColor } from "@/lib/lootbox-data"
import { cn } from "@/lib/utils"

export function Header() {
  const [progress, setProgress] = React.useState<UserProgress | null>(null);

  const loadProgress = () => {
    const saved = localStorage.getItem('kai_user_progress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">KAI <span className="text-primary">:</span> KI Erklärt</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Sheet onOpenChange={(open) => open && loadProgress()}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <UserCircle className="w-4 h-4" />
                <span>Mein Lernstand</span>
              </button>
            </SheetTrigger>
            <SheetContent className="glass-card border-l border-white/10 w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                  <Trophy className="text-secondary w-6 h-6" /> Dein Fortschritt
                </SheetTitle>
                <SheetDescription>
                  Hier siehst du, wie weit du auf deinem Weg zum KI-Experten bist.
                </SheetDescription>
              </SheetHeader>

              {progress ? (
                <div className="space-y-8 pb-12">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Aktuelles Level</span>
                      <span className="text-primary font-bold">{progress.level}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-muted-foreground">Module abgeschlossen</span>
                      <span className="font-bold">{progress.completedModules.length} / {modules.length}</span>
                    </div>
                    <ProgressBar value={Math.round((progress.completedModules.length / modules.length) * 100)} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" /> Trophäen-Sammlung
                    </h4>
                    {progress.trophies && progress.trophies.length > 0 ? (
                      <div className="grid grid-cols-4 gap-3">
                        {progress.trophies.map((t, i) => (
                          <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl group relative hover:scale-110 transition-transform cursor-help">
                            {t.emoji}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: 'currentColor' }} />
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 border border-white/10 rounded-lg text-[10px] whitespace-nowrap z-50 pointer-events-none">
                              <p className="font-bold">{t.name}</p>
                              <p className={cn("font-black uppercase tracking-tighter", getRarityColor(t.rarity))}>{t.rarity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-2xl">
                        <p className="text-xs text-muted-foreground">Noch keine Trophäen gesammelt.<br/>Schließe ein Quiz ab!</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-secondary mb-4">Status Lektionen</h4>
                    <div className="space-y-3">
                      {modules.map((m) => {
                        const isDone = progress.completedModules.includes(m.id);
                        return (
                          <div key={m.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${isDone ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
                            <div className="flex items-center gap-3">
                              {isDone ? <CheckCircle2 className="w-4 h-4 text-secondary" /> : <BookOpen className="w-4 h-4 text-muted-foreground" />}
                              <span className="text-sm font-medium">{m.title}</span>
                            </div>
                            {isDone && (
                              <span className="text-xs font-bold text-secondary">
                                {progress.quizScores[m.id] !== undefined ? `${progress.quizScores[m.id]} Pkt.` : "✓"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {progress.completedModules.length >= modules.length && (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/10 text-center">
                      <p className="text-sm font-semibold mb-2">Alle Grundlagen gemeistert!</p>
                      <Link href="/assessment">
                        <button className="text-xs text-secondary hover:underline font-bold">Zum Abschlusstest gehen</button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Noch kein Fortschritt vorhanden. Starte jetzt deinen Lernpfad!</p>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
