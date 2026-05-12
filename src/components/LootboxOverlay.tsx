
"use client"

import * as React from "react"
import { Trophy, Rarity } from "@/lib/types"
import { getRandomTrophy, getRarityColor } from "@/lib/lootbox-data"
import { Button } from "./ui/button"
import { Sparkles, Gift, Share2, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LootboxOverlayProps {
  onClose: (trophy: Trophy) => void;
}

export function LootboxOverlay({ onClose }: LootboxOverlayProps) {
  const [state, setState] = React.useState<'idle' | 'shaking' | 'revealing' | 'done'>('idle');
  const [trophy, setTrophy] = React.useState<Trophy | null>(null);

  const handleOpen = () => {
    setState('shaking');
    setTimeout(() => {
      const newTrophy = getRandomTrophy();
      setTrophy(newTrophy);
      setState('revealing');
    }, 1500);
  };

  const handleFinish = () => {
    if (trophy) onClose(trophy);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="max-w-md w-full p-8 text-center">
        {state === 'idle' && (
          <div className="animate-fade-in">
            <div className="w-32 h-32 bg-primary/20 rounded-3xl mx-auto mb-8 flex items-center justify-center border-2 border-primary/50 neon-shadow animate-bounce">
              <Gift className="w-16 h-16 text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Modul-Belohnung!</h2>
            <p className="text-muted-foreground mb-8">Du hast eine KAI-Lootbox verdient. Was wird wohl drin sein?</p>
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
            <p className="text-xl font-bold text-secondary animate-pulse uppercase tracking-widest">Wird geöffnet...</p>
          </div>
        )}

        {state === 'revealing' && (
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full animate-pulse" />
            <div className="relative animate-in zoom-in spin-in duration-700">
              <div className="text-[120px] mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                {trophy?.emoji}
              </div>
              <div className={cn("text-sm font-bold uppercase tracking-[0.2em] mb-2", trophy && getRarityColor(trophy.rarity))}>
                {trophy?.rarity}
              </div>
              <h2 className="text-4xl font-black mb-2">{trophy?.name}</h2>
              <p className="text-muted-foreground mb-12">Zu deiner Sammlung hinzugefügt!</p>
              
              <Button onClick={handleFinish} size="lg" className="rounded-full px-12 h-14 text-lg neon-shadow">
                Trophäe einsammeln <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
