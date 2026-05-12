
"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ShieldAlert, CheckCircle, XCircle, ArrowRight, Trophy, Eye, Volume2, Mail, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const cases = [
  {
    id: 1,
    title: "Der 'Goldene-Regen'-Post",
    description: "In sozialen Medien kursiert ein Video, in dem ein bekannter Wettermoderator behauptet, dass es bald Goldmünzen regnen wird.",
    clues: ["Asynchron", "Metallische Stimme", "Keine Quelle"],
    options: ["Echt", "KI-Manipuliert"],
    correct: 1,
    explanation: "Hierbei handelt es sich um ein Deepfake. Stimme und Lippen wurden künstlich angepasst.",
    icon: <Volume2 className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 2,
    title: "Angebliche CEO-Mail",
    description: "Du erhältst eine E-Mail deines CEOs mit einer Sprachnachricht. Er bittet dich um eine dringende Überweisung.",
    clues: ["Druck", "Ungewöhnlich", "Verdächtig"],
    options: ["Echt", "Betrugsversuch"],
    correct: 1,
    explanation: "Social Engineering nutzt KI-Stimmen, um Vertrauen zu erschleichen. Seriöse Firmen tun dies nie.",
    icon: <Mail className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 3,
    title: "Perfektes Urlaubsfoto",
    description: "Ein Influencer postet ein Foto von einem magischen lila Strand auf Bali. Das Wasser leuchtet neonfarben.",
    clues: ["Unnatürlich", "Verschwommen", "Keine Daten"],
    options: ["Echt", "KI-Generiert"],
    correct: 1,
    explanation: "KI neigt zu übertriebenen Farben und Fehlern in Texturen wie Wasser oder Sand.",
    icon: <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 4,
    title: "Der 'Wunder-Bot'-Chat",
    description: "Ein Support-Chat antwortet in Lichtgeschwindigkeit, macht aber eigenartige Grammatikfehler.",
    clues: ["Schnell", "Repetitiv", "Emotionslos"],
    options: ["Mensch", "KI-Bot"],
    correct: 1,
    explanation: "Bots sind extrem schnell, bleiben aber bei komplexen oder emotionalen Anliegen oft hängen.",
    icon: <ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 5,
    title: "Breaking News auf X",
    description: "Ein Video zeigt eine Explosion vor dem Weißen Haus. Gepostet von einem ganz neuen Account.",
    clues: ["Junger Account", "Keine News", "Logikfehler"],
    options: ["Echt", "KI-Desinformation"],
    correct: 1,
    explanation: "KI-Bilder haben oft architektonische Fehler (z.B. falsche Fensteranzahl).",
    icon: <Eye className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  }
];

export default function AssessmentPage() {
  const [currentCase, setCurrentCase] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [isDone, setIsDone] = React.useState(false);
  const [results, setResults] = React.useState<boolean[]>([]);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === cases[currentCase].correct;
    setResults([...results, isCorrect]);
  };

  const next = () => {
    if (currentCase + 1 < cases.length) {
      setCurrentCase(currentCase + 1);
      setSelected(null);
    } else {
      setIsDone(true);
    }
  };

  const misImg = PlaceHolderImages.find(i => i.id === 'misinformation-hero') || PlaceHolderImages[0];

  if (isDone) {
    const score = results.filter(r => r).length;
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center px-4">
        <Header />
        <div className="max-w-xl w-full glass-card p-8 md:p-12 rounded-2xl md:rounded-3xl text-center animate-fade-in border-secondary/30">
          <Trophy className="w-16 h-16 md:w-20 md:h-20 text-secondary mx-auto mb-6 violet-shadow rounded-full p-4" />
          <h2 className="text-3xl md:text-4xl font-black mb-4">Test beendet!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Du hast {score} von {cases.length} Fällen korrekt beurteilt. 
            {score === cases.length ? " Wahnsinn! Ein echter Profi." : score >= 3 ? " Gut gemacht!" : " Bleib wachsam."}
          </p>
          <Button onClick={() => window.location.href = '/'} size="lg" className="w-full sm:w-auto rounded-full px-12 h-14 font-bold">
            Zurück zum Hauptmenü
          </Button>
        </div>
      </div>
    );
  }

  const c = cases[currentCase];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <Header />
      <main className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 md:mb-12 text-center animate-fade-in">
          <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto mb-4">
            Transfer-Test: KI im Alltag
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2 md:mb-4 tracking-tighter">Erkennst du den Schwindel?</h1>
          <p className="text-muted-foreground text-sm md:text-base font-medium">Szenario {currentCase + 1} von {cases.length}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-12">
          <div className="relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden glass-card animate-fade-in delay-100 border-primary/20">
             <Image 
                src={misImg.imageUrl} 
                alt={misImg.description} 
                fill
                className="object-cover opacity-10"
             />
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 text-center">
                <div className="mb-4 md:mb-6 bg-primary/20 p-3 md:p-4 rounded-xl md:rounded-2xl">
                  {c.icon}
                </div>
                <h4 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{c.title}</h4>
                <p className="text-base md:text-lg font-medium leading-relaxed italic">{c.description}</p>
             </div>
          </div>

          <div className="animate-fade-in delay-200">
            <h3 className="text-xl md:text-2xl font-black mb-6">Was sagst du?</h3>
            <div className="space-y-3 md:space-y-4 mb-8">
              {c.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 md:p-5 rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 flex justify-between items-center
                    ${selected === idx ? (idx === c.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : 'border-white/10 bg-white/5 hover:border-primary/50'}
                  `}
                >
                  <span className="font-semibold text-base md:text-lg">{opt}</span>
                  {selected !== null && idx === c.correct && <CheckCircle className="text-green-500 w-5 h-5 md:w-6 md:h-6" />}
                  {selected === idx && idx !== c.correct && <XCircle className="text-red-500 w-5 h-5 md:w-6 md:h-6" />}
                </button>
              ))}
            </div>

            {selected !== null && (
              <div className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl animate-fade-in">
                <p className="text-[10px] font-bold text-primary mb-2 uppercase tracking-widest">Die Erklärung:</p>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed font-medium">{c.explanation}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.clues.map((clue, i) => (
                    <span key={i} className="text-[9px] bg-white/10 px-2 py-1 rounded-md text-muted-foreground uppercase tracking-tight font-bold">
                      {clue}
                    </span>
                  ))}
                </div>

                <Button onClick={next} className="mt-6 w-full gap-2 rounded-xl h-12 font-bold">
                  {currentCase + 1 < cases.length ? "Nächstes Szenario" : "Ergebnis anzeigen"} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
