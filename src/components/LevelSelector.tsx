
"use client"

import * as React from "react"
import { DifficultyLevel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart3, Binary, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface LevelSelectorProps {
  onSelect: (level: DifficultyLevel) => void;
}

export function LevelSelector({ onSelect }: LevelSelectorProps) {
  const [selected, setSelected] = React.useState<DifficultyLevel | null>(null);

  const options = [
    { 
      id: 'Einsteiger' as DifficultyLevel, 
      title: 'Einsteiger', 
      desc: 'Keine Vorkenntnisse nötig. Wir starten bei Null.', 
      icon: <Sparkles className="w-6 h-6" />,
      color: "text-blue-400"
    },
    { 
      id: 'Basics' as DifficultyLevel, 
      title: 'Grundlagen', 
      desc: 'Du weißt was Daten sind und willst tiefer graben.', 
      icon: <BarChart3 className="w-6 h-6" />,
      color: "text-violet-400"
    },
    { 
      id: 'Fortgeschritten' as DifficultyLevel, 
      title: 'Experte', 
      desc: 'Mathe & Logik schrecken dich nicht ab. Deep Dive.', 
      icon: <Binary className="w-6 h-6" />,
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Willkommen bei KAI</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Wähle dein aktuelles Wissensniveau aus, damit wir deinen Lernpfad maßschneidern können.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            className={cn(
              "p-8 rounded-2xl glass-card text-left transition-all duration-300 group hover:-translate-y-1 border-2",
              selected === opt.id ? "border-primary violet-shadow" : "border-transparent"
            )}
          >
            <div className={cn("mb-6 bg-white/5 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform", opt.color)}>
              {opt.icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{opt.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{opt.desc}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <Button 
          size="lg" 
          disabled={!selected} 
          onClick={() => selected && onSelect(selected)}
          className="px-12 h-14 text-lg rounded-full neon-shadow"
        >
          Lernpfad starten <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
