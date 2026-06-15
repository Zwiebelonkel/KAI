"use client"

import * as React from "react"
import { Trophy } from "@/lib/types"
import { getRandomTrophies, getRarityColor } from "@/lib/lootbox-data"
import { Button } from "./ui/button"
import { Gift, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LootboxOverlayProps {
  onClose: (trophies: Trophy[]) => void;
}

export function LootboxOverlay({ onClose }: LootboxOverlayProps) {
  const [state, setState] = React.useState<'idle' | 'shaking' | 'revealing'>('idle');
  const [trophies, setTrophies] = React.useState<Trophy[]>([]);

  const handleOpen = () => {
    setState('shaking');
    setTimeout(() => {
      const newTrophies = getRandomTrophies(3);
      setTrophies(newTrophies);
      setState('revealing');
    }, 1500);
  };

  const handleFinish = () => {
    if (trophies.length > 0) onClose(trophies);
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
            <div className="relative animate-in zoom-in spin-in duration-700">
              <h2 className="text-4xl font-black mb-3">Deine Lootbox-Items</h2>
              <p className="text-muted-foreground mb-8">Alle 3 Items wurden zu deiner Sammlung hinzugefügt!</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                {trophies.map((trophy, index) => (
                  <div key={`${trophy.id}-${index}`} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm">
                    <div className="text-6xl sm:text-7xl mb-4 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                      {trophy.emoji}
                    </div>
                    <div className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-2", getRarityColor(trophy.rarity))}>
                      {trophy.rarity}
                    </div>
                    <h3 className="text-lg sm:text-xl font-black leading-tight">{trophy.name}</h3>
                  </div>
                ))}
              </div>

              <Button onClick={handleFinish} size="lg" className="rounded-full px-12 h-14 text-lg neon-shadow">
                Items einsammeln <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
