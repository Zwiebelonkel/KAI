"use client"

import * as React from "react"
import { DifficultyLevel } from "@/lib/types"
import { getDifficultyColors } from "@/lib/difficulty-colors"
import { Button } from "@/components/ui/button"
import { Sparkles, BarChart3, Binary, ArrowRight, BrainCircuit, Trophy, ShieldCheck, WandSparkles } from "lucide-react"
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
      translateY: [34, 0],
      opacity: [0, 1],
      duration: 950,
      delay: stagger(85),
      easing: "easeOutExpo",
    });

    const orbs = anime({
      targets: rootRef.current.querySelectorAll("[data-anime=\"orb\"]"),
      translateY: [-14, 14],
      scale: [0.94, 1.06],
      duration: 3200,
      delay: stagger(260),
      easing: "easeInOutSine",
    });

    const cards = anime({
      targets: rootRef.current.querySelectorAll("[data-anime=\"glass-card\"]"),
      translateY: [24, 0],
      opacity: [0, 1],
      duration: 800,
      delay: stagger(110),
      easing: "easeOutExpo",
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
      cards.cancel();
    };
  }, []);

  const options = [
    { 
      id: 'Einsteiger' as DifficultyLevel, 
      title: 'Einsteiger', 
      desc: 'Keine Vorkenntnisse nötig. Wir starten bei Null.', 
      icon: <Sparkles className="w-6 h-6" />,
      colors: getDifficultyColors('Einsteiger')
    },
    { 
      id: 'Basics' as DifficultyLevel, 
      title: 'Grundlagen', 
      desc: 'Du weißt was Daten sind und willst tiefer graben.', 
      icon: <BarChart3 className="w-6 h-6" />,
      colors: getDifficultyColors('Basics')
    },
    { 
      id: 'Fortgeschritten' as DifficultyLevel, 
      title: 'Experte', 
      desc: 'Mathe & Logik schrecken dich nicht ab. Deep Dive.', 
      icon: <Binary className="w-6 h-6" />,
      colors: getDifficultyColors('Fortgeschritten')
    }
  ];

  const handleOptionSelect = (level: DifficultyLevel) => {
    setSelected(level);
    onSelect(level);
  };

  const stats = [
    { label: "Micro-Lektionen", value: "5+", icon: <BrainCircuit className="h-4 w-4" /> },
    { label: "Lootbox Rewards", value: "31", icon: <Trophy className="h-4 w-4" /> },
    { label: "Fake-Check", value: "10", icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden px-4 py-8 md:py-12">
      <div className="mesh-bg" />
      <div data-anime="orb" className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/25 blur-[90px]" />
      <div data-anime="orb" className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-cyan-400/15 blur-[80px]" />
      <div data-anime="orb" className="pointer-events-none absolute bottom-10 -right-20 h-96 w-96 rounded-full bg-secondary/20 blur-[100px]" />

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col justify-center gap-12">
        <section className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="space-y-8 text-center lg:text-left">
            <div data-anime="intro" className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-primary shadow-2xl backdrop-blur-2xl lg:mx-0">
              <WandSparkles className="h-4 w-4" /> KI Lernen mit Style
            </div>

            <div className="space-y-5">
              <h1 data-anime="intro" className="text-5xl font-black leading-[0.92] tracking-[-0.08em] text-white sm:text-6xl md:text-7xl xl:text-8xl">
                Lerne KI.<br />
                <span className="liquid-gradient-text">Wie Magie.</span>
              </h1>
              <p data-anime="intro" className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-white/68 md:text-xl lg:mx-0">
                KAI verwandelt künstliche Intelligenz in einen interaktiven Lernpfad mit Quizzen, Belohnungen, Zertifikat und einem Design, das sich wie flüssiges Glas anfühlt.
              </p>
            </div>

            <div data-anime="intro" className="flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                disabled={!selected}
                onClick={() => selected && onSelect(selected)}
                className="group h-14 w-full rounded-full px-9 text-base font-black shadow-[0_0_50px_rgba(77,150,255,0.35)] sm:w-auto"
              >
                Lernpfad starten <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Button>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/45">
                Level anklicken und direkt starten
              </p>
            </div>

            <div data-anime="intro" className="grid gap-3 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="liquid-glass rounded-3xl p-4 text-left">
                  <div className="mb-3 flex items-center justify-between text-white/50">
                    {stat.icon}
                    <span className="text-2xl font-black text-white">{stat.value}</span>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/45">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div data-anime="intro" className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="liquid-orb absolute -inset-10 rounded-[3rem] opacity-80" />
            <div className="liquid-glass relative overflow-hidden rounded-[2.5rem] p-5 md:p-7">
              <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/25 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-secondary/25 blur-3xl" />

              <div className="relative rounded-[2rem] border border-white/10 bg-black/20 p-5 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-white/45">KAI Dashboard</p>
                    <h2 className="mt-1 text-2xl font-black tracking-tight">Dein Skill-Boost</h2>
                  </div>
                  <div className="rounded-2xl bg-primary/20 p-3 text-primary neon-shadow">
                    <BrainCircuit className="h-7 w-7" />
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Prompt Basics", "78%", "w-[78%]", "bg-primary"],
                    ["KI-Bilder erkennen", "54%", "w-[54%]", "bg-secondary"],
                    ["Deepfake Radar", "91%", "w-[91%]", "bg-emerald-400"],
                  ].map(([label, value, width, color]) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <div className="mb-3 flex items-center justify-between text-sm font-bold">
                        <span>{label}</span>
                        <span className="text-white/55">{value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white/10">
                        <div className={cn("h-full rounded-full", width, color)} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  {["🧠", "💎", "🚀"].map((emoji) => (
                    <div key={emoji} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center text-3xl shadow-inner">
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleOptionSelect(opt.id)}
              data-anime="glass-card"
              className={cn(
                "liquid-glass group relative overflow-hidden rounded-[2rem] p-6 text-left transition-all duration-300 hover:-translate-y-2 hover:border-white/25",
                selected === opt.id ? cn(opt.colors.selectedBorder, opt.colors.selectedShadow) : "border-white/12"
              )}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100", opt.colors.gradient)} />
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
              <div className="relative z-10">
                <div className={cn("mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] transition-transform group-hover:scale-110", opt.colors.accentText)}>
                  {opt.icon}
                </div>
                <h3 className="mb-2 text-2xl font-black tracking-tight">{opt.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-white/58">{opt.desc}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/40">Level wählen</span>
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full border transition-all", selected === opt.id ? opt.colors.selectedArrow : "border-white/15 bg-white/[0.04] text-white/50 group-hover:text-white")}>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}
