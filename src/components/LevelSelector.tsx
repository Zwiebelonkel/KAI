
"use client"

import * as React from "react"
import { DifficultyLevel } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart3, Binary, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { anime, stagger } from "@/lib/anime"

interface LevelSelectorProps {
  onSelect: (level: DifficultyLevel) => void;
}

export function LevelSelector({ onSelect }: LevelSelectorProps) {
  const [selected, setSelected] = React.useState<DifficultyLevel | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!rootRef.current) return;
    const intro = anime({
      targets: rootRef.current.querySelectorAll("[data-anime=\"intro\"]"),
      translateY: [28, 0],
      opacity: [0, 1],
      duration: 900,
      delay: stagger(90),
      easing: "easeOutExpo",
    });

    const orbs = anime({
      targets: rootRef.current.querySelectorAll("[data-anime=\"orb\"]"),
      translateY: [-10, 10],
      scale: [0.96, 1.04],
      duration: 2800,
      delay: stagger(320),
      easing: "easeInOutSine",
    });

    orbs.animations.forEach((animation) => {
      animation.onfinish = () => {
        animation.reverse();
        animation.play();
      };
    });

    return () => {
      intro.cancel();
      orbs.cancel();
    };
  }, []);

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
    <div ref={rootRef} className="relative max-w-5xl mx-auto py-8 md:py-12 px-4 animate-fade-in overflow-hidden">
      <div data-anime="orb" className="pointer-events-none absolute -top-16 left-8 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
      <div data-anime="orb" className="pointer-events-none absolute top-32 -right-10 h-52 w-52 rounded-full bg-secondary/20 blur-3xl" />
      <div data-anime="intro" className="relative z-10 text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">Willkommen bei KAI</h1>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-medium">
          Wähle dein Wissensniveau aus, damit wir deinen Lernpfad maßschneidern können.
        </p>
      </div>

      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            data-anime="intro"
            className={cn(
              "p-6 md:p-8 rounded-2xl glass-card text-left transition-all duration-300 group hover:-translate-y-1 border-2 relative overflow-hidden",
              selected === opt.id ? "border-primary violet-shadow" : "border-transparent"
            )}
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className={cn("mb-4 md:mb-6 bg-white/5 p-3 rounded-xl w-fit group-hover:scale-110 transition-transform", opt.color)}>
              {opt.icon}
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">{opt.title}</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed font-medium">{opt.desc}</p>
          </button>
        ))}
      </div>

      <div data-anime="intro" className="relative z-10 flex justify-center">
        <Button 
          size="lg" 
          disabled={!selected} 
          onClick={() => selected && onSelect(selected)}
          className="w-full sm:w-auto px-12 h-14 text-lg rounded-full neon-shadow font-bold"
        >
          Lernpfad starten <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
