"use client"

import * as React from "react"
import { Trophy } from "@/lib/types"
import { getRandomTrophies, getRarityColor, RARITY_CHANCES, RARITY_ORDER } from "@/lib/lootbox-data"
import { Button } from "./ui/button"
import { Gift, ArrowRight, Percent, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface LootboxOverlayProps {
  onClose: (trophies: Trophy[]) => void;
}

export function LootboxOverlay({ onClose }: LootboxOverlayProps) {
  const [state, setState] = React.useState<'idle' | 'shaking' | 'revealing'>('idle');
  const [trophies, setTrophies] = React.useState<Trophy[]>([]);
  const [revealedCount, setRevealedCount] = React.useState(0);
  const [showChances, setShowChances] = React.useState(false);

  React.useEffect(() => {
    if (state !== 'revealing' || revealedCount >= trophies.length) return;

    const revealTimer = window.setTimeout(() => {
      setRevealedCount((currentCount) => Math.min(currentCount + 1, trophies.length));
    }, revealedCount === 0 ? 150 : 350);

    return () => window.clearTimeout(revealTimer);
  }, [revealedCount, state, trophies.length]);

  const handleOpen = () => {
    setState('shaking');
    setRevealedCount(0);
    setShowChances(false);
    setTimeout(() => {
      const newTrophies = getRandomTrophies(3);
      setTrophies(newTrophies);
      setState('revealing');
    }, 700);
  };

  const handleFinish = () => {
    if (trophies.length > 0 && revealedCount === trophies.length) onClose(trophies);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/90 p-3 backdrop-blur-xl animate-in fade-in duration-200 sm:p-6">
      <div className="w-full max-w-2xl p-3 text-center sm:p-8">
        {state === 'idle' && (
          <div className="animate-fade-in">
            <div className="w-32 h-32 bg-primary/20 rounded-3xl mx-auto mb-8 flex items-center justify-center border-2 border-primary/50 neon-shadow animate-bounce">
              <Gift className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Modul-Belohnung!</h2>
            <p className="mb-4 text-sm text-muted-foreground sm:mb-8 sm:text-base">Du hast eine KAI-Lootbox mit 3 Items verdient. Was wird wohl drin sein?</p>
            <Button onClick={handleOpen} size="lg" className="h-12 rounded-full px-8 text-base neon-shadow sm:h-14 sm:px-12 sm:text-lg">
              Box öffnen
            </Button>
          </div>
        )}

        {state === 'shaking' && (
          <div className="animate-shake">
            <div className="w-32 h-32 bg-secondary/20 rounded-3xl mx-auto mb-8 flex items-center justify-center border-2 border-secondary/50 violet-shadow">
              <Gift className="w-16 h-16 text-secondary" />
            </div>
            <p className="text-xl font-bold text-secondary animate-pulse uppercase tracking-widest">3 Items werden geöffnet...</p>
          </div>
        )}

        {state === 'revealing' && (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
            <div className="relative animate-in zoom-in duration-300">
              <div className="mb-3 flex justify-center sm:mb-5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowChances((isVisible) => !isVisible)}
                  className="h-8 rounded-full border-white/15 bg-white/10 px-3 text-xs text-white hover:bg-white/20"
                >
                  {showChances ? <X className="mr-1.5 h-3.5 w-3.5" /> : <Percent className="mr-1.5 h-3.5 w-3.5" />}
                  Chancen anzeigen
                </Button>
              </div>

              {showChances && (
                <div className="mx-auto mb-4 max-w-sm rounded-2xl border border-white/10 bg-black/40 p-3 text-left shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200 sm:mb-6 sm:p-4">
                  <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Seltenheits-Chancen pro Item</p>
                  <div className="space-y-2">
                    {RARITY_ORDER.map((rarity) => (
                      <div key={rarity} className="flex items-center justify-between text-sm">
                        <span className={cn("font-bold", getRarityColor(rarity))}>{rarity}</span>
                        <span className="tabular-nums text-white">{RARITY_CHANCES[rarity]}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h2 className="mb-2 text-2xl font-black sm:mb-3 sm:text-4xl">Deine Lootbox-Items</h2>
              <p className="mb-4 text-sm text-muted-foreground sm:mb-8 sm:text-base">
                {revealedCount < trophies.length ? 'Die Items kommen nacheinander aus der Box...' : 'Alle 3 Items wurden zu deiner Sammlung hinzugefügt!'}
              </p>

              <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-10 sm:gap-4">
                {trophies.map((trophy, index) => {
                  const isRevealed = index < revealedCount;

                  return (
                    <div
                      key={trophy.id}
                      className={cn(
                        "rounded-2xl border p-2 shadow-2xl backdrop-blur-sm transition-all duration-200 sm:rounded-3xl sm:p-5",
                        isRevealed
                          ? "scale-100 border-white/10 bg-white/5 opacity-100 animate-in zoom-in slide-in-from-bottom-8"
                          : "scale-90 border-white/5 bg-white/[0.02] opacity-30"
                      )}
                    >
                      {isRevealed ? (
                        <>
                          <div className="mb-2 text-4xl drop-shadow-[0_0_30px_rgba(255,255,255,0.5)] sm:mb-4 sm:text-7xl">
                            {trophy.emoji}
                          </div>
                          <div className={cn("mb-1 text-[10px] font-bold uppercase tracking-[0.12em] sm:mb-2 sm:text-xs sm:tracking-[0.2em]", getRarityColor(trophy.rarity))}>
                            {trophy.rarity}
                          </div>
                          <h3 className="text-xs font-black leading-tight sm:text-xl">{trophy.name}</h3>
                        </>
                      ) : (
                        <div className="flex min-h-[96px] flex-col items-center justify-center text-white/40 sm:min-h-[154px]">
                          <Gift className="mb-2 h-8 w-8 animate-pulse sm:mb-3 sm:h-12 sm:w-12" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs sm:tracking-[0.2em]">Item {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleFinish} disabled={revealedCount < trophies.length} size="lg" className="h-12 rounded-full px-8 text-base neon-shadow sm:h-14 sm:px-12 sm:text-lg">
                Items einsammeln <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
