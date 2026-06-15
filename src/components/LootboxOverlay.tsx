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
    }, revealedCount === 0 ? 250 : 850);

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
    }, 1500);
  };

  const handleFinish = () => {
    if (trophies.length > 0 && revealedCount === trophies.length) onClose(trophies);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-2xl w-full p-8 text-center">
        {state === 'idle' && (
          <div className="animate-fade-in">
            <div className="w-32 h-32 bg-primary/20 rounded-3xl mx-auto mb-8 flex items-center justify-center border-2 border-primary/50 neon-shadow animate-bounce">
              <Gift className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Modul-Belohnung!</h2>
            <p className="text-muted-foreground mb-8">Du hast eine KAI-Lootbox mit 3 Items verdient. Was wird wohl drin sein?</p>
            <Button onClick={handleOpen} size="lg" className="rounded-full px-12 h-14 text-lg neon-shadow">
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
            <div className="relative animate-in zoom-in duration-700">
              <div className="mb-5 flex justify-center">
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
                <div className="mx-auto mb-6 max-w-sm rounded-2xl border border-white/10 bg-black/40 p-4 text-left shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200">
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

              <h2 className="text-4xl font-black mb-3">Deine Lootbox-Items</h2>
              <p className="text-muted-foreground mb-8">
                {revealedCount < trophies.length ? 'Die Items kommen nacheinander aus der Box...' : 'Alle 3 Items wurden zu deiner Sammlung hinzugefügt!'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {trophies.map((trophy, index) => {
                  const isRevealed = index < revealedCount;

                  return (
                    <div
                      key={trophy.id}
                      className={cn(
                        "rounded-3xl border p-5 shadow-2xl backdrop-blur-sm transition-all duration-500",
                        isRevealed
                          ? "scale-100 border-white/10 bg-white/5 opacity-100 animate-in zoom-in slide-in-from-bottom-8"
                          : "scale-90 border-white/5 bg-white/[0.02] opacity-30"
                      )}
                    >
                      {isRevealed ? (
                        <>
                          <div className="text-6xl sm:text-7xl mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                            {trophy.emoji}
                          </div>
                          <div className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-2", getRarityColor(trophy.rarity))}>
                            {trophy.rarity}
                          </div>
                          <h3 className="text-lg sm:text-xl font-black leading-tight">{trophy.name}</h3>
                        </>
                      ) : (
                        <div className="flex min-h-[154px] flex-col items-center justify-center text-white/40">
                          <Gift className="mb-3 h-12 w-12 animate-pulse" />
                          <span className="text-xs font-bold uppercase tracking-[0.2em]">Item {index + 1}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleFinish} disabled={revealedCount < trophies.length} size="lg" className="rounded-full px-12 h-14 text-lg neon-shadow">
                Items einsammeln <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
