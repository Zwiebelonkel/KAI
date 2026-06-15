
"use client"

import * as React from "react"
import { BrainCircuit, UserCircle, Trophy, BookOpen, CheckCircle2, Sparkles, LogOut } from "lucide-react"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { UserProgress } from "@/lib/types"
import { modules as fallbackModules } from "@/lib/course-data"
import { kaiApi } from "@/lib/api-service"
import { ProgressBar } from "./ProgressBar"
import { getRarityColor } from "@/lib/lootbox-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function Header() {
  const [progress, setProgress] = React.useState<UserProgress | null>(null);

  const [moduleCount, setModuleCount] = React.useState(fallbackModules.length);

  const loadProgress = () => {
    if (kaiApi.isConfigured && kaiApi.getToken()) {
      kaiApi.getProgress()
        .then(setProgress)
        .catch((error) => console.warn('KAI API progress load failed:', error));
      kaiApi.listModules()
        .then((remoteModules) => setModuleCount(remoteModules.length))
        .catch(() => setModuleCount(fallbackModules.length));
      return;
    }

    const saved = localStorage.getItem('kai_user_progress');
    if (saved) setProgress(JSON.parse(saved));
  };

  const handleLogout = () => {
    kaiApi.logout();
    window.location.href = '/';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <BrainCircuit className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </div>
          <span className="text-base md:text-xl font-bold tracking-tight">KAI <span className="text-primary">:</span> <span className="hidden sm:inline">KI Erklärt</span></span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Sheet onOpenChange={(open) => open && loadProgress()}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
                <UserCircle className="w-4 h-4" />
                <span><span className="hidden xs:inline">Mein </span>Lernstand</span>
              </button>
            </SheetTrigger>
            <SheetContent className="glass-card border-l border-white/10 w-full sm:max-w-md overflow-y-auto pt-10">
              <SheetHeader className="mb-6 md:mb-8">
                <SheetTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <Trophy className="text-secondary w-5 h-5 md:w-6 md:h-6" /> Dein Fortschritt
                </SheetTitle>
                <SheetDescription>
                  Hier siehst du, wie weit du auf deinem Weg zum KI-Experten bist.
                </SheetDescription>
              </SheetHeader>

              {progress ? (
                <div className="space-y-6 md:space-y-8 pb-12">
                  <div className="p-4 rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">Aktuelles Level</span>
                      <span className="text-primary font-bold text-sm">{progress.level}</span>
                    </div>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs md:text-sm font-medium text-muted-foreground">Module</span>
                      <span className="font-bold text-sm">{progress.completedModules.length} / {moduleCount}</span>
                    </div>
                    <ProgressBar value={Math.round((progress.completedModules.length / moduleCount) * 100)} />
                  </div>

                  <div>
                    <h4 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-primary mb-4 flex items-center gap-2">
                      <Sparkles className="w-3 h-3 md:w-4 md:h-4" /> Trophäen-Sammlung
                    </h4>
                    {progress.trophies && progress.trophies.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 md:gap-3">
                        {progress.trophies.map((t, i) => (
                          <div key={i} className="aspect-square bg-white/5 border border-white/10 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl group relative hover:scale-110 transition-transform cursor-help">
                            {t.emoji}
                            <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black/90 border border-white/10 rounded-lg text-[10px] whitespace-nowrap z-50 pointer-events-none">
                              <p className="font-bold">{t.name}</p>
                              <p className={cn("font-black uppercase tracking-tighter", getRarityColor(t.rarity))}>{t.rarity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-xl md:rounded-2xl">
                        <p className="text-[10px] md:text-xs text-muted-foreground">Noch keine Trophäen.<br/>Schließe ein Quiz ab!</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-secondary mb-4">Lektionen</h4>
                    <div className="space-y-2 md:space-y-3">
                      {fallbackModules.map((m) => {
                        const isDone = progress.completedModules.includes(m.id);
                        return (
                          <div key={m.id} className={`flex items-center justify-between p-3 rounded-lg md:rounded-xl border transition-colors ${isDone ? 'bg-secondary/10 border-secondary/30' : 'bg-white/5 border-white/5 opacity-50'}`}>
                            <div className="flex items-center gap-3">
                              {isDone ? <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-secondary" /> : <BookOpen className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground" />}
                              <span className="text-[10px] md:text-sm font-medium">{m.title}</span>
                            </div>
                            {isDone && (
                              <span className="text-[10px] font-bold text-secondary">
                                {progress.quizScores[m.id] !== undefined ? `${progress.quizScores[m.id]} Pkt.` : "✓"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>


                  {kaiApi.isConfigured && (
                    <Button variant="outline" onClick={handleLogout} className="w-full rounded-full gap-2 border-white/10">
                      <LogOut className="w-4 h-4" /> Ausloggen
                    </Button>
                  )}

                  {progress.completedModules.length >= moduleCount && (
                    <div className="p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-secondary/20 to-primary/20 border border-white/10 text-center">
                      <p className="text-xs md:text-sm font-semibold mb-2">Alle Grundlagen gemeistert!</p>
                      <Link href="/assessment">
                        <button className="text-[10px] text-secondary hover:underline font-bold">Zum Abschlusstest</button>
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">Starte jetzt deinen Lernpfad!</p>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
