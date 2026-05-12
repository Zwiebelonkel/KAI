
"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { ShieldAlert, CheckCircle, XCircle, ArrowRight, Trophy } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

const cases = [
  {
    id: 1,
    title: "Der 'Goldene-Regen'-Post",
    description: "In sozialen Medien kursiert ein Video, in dem ein bekannter Wettermoderator behauptet, dass es bald Goldmünzen regnen wird, verursacht durch ein neues Experiment in der Stratosphäre.",
    clues: ["Lippenbewegungen asynchron", "Stimme klingt leicht metallisch", "Keine seriöse Quelle bestätigt die News"],
    options: ["Echt", "KI-Manipuliert"],
    correct: 1,
    explanation: "Hierbei handelt es sich um ein sogenanntes Deepfake. Die Stimme wurde künstlich generiert (Voice Cloning) und die Lippenbewegungen nachträglich angepasst."
  },
  {
    id: 2,
    title: "Angebliche CEO-Mail",
    description: "Du erhältst eine E-Mail deines CEOs mit einer Sprachnachricht. Er bittet dich, dringend eine Überweisung an einen neuen Lieferanten zu tätigen, da er gerade am Flughafen ist und sein System nicht funktioniert.",
    clues: ["Dringlichkeit erzeugt Druck", "Ungewöhnliche Bitte", "Stimme perfekt, aber Kontext verdächtig"],
    options: ["Echt", "Betrugsversuch (Social Engineering/KI)"],
    correct: 1,
    explanation: "Social Engineering Angriffe nutzen oft KI-Stimmen, um Vertrauen zu erschleichen. Seriöse Firmen fordern niemals Überweisungen per Sprachnachricht an."
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
        <div className="max-w-xl w-full glass-card p-12 rounded-3xl text-center animate-fade-in border-secondary/30">
          <Trophy className="w-20 h-20 text-secondary mx-auto mb-6 violet-shadow rounded-full p-4" />
          <h2 className="text-4xl font-bold mb-4">Test bestanden!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Du hast {score} von {cases.length} Fällen korrekt beurteilt. Du bist nun besser gewappnet gegen KI-Fehlinformationen.
          </p>
          <Button onClick={() => window.location.href = '/'} size="lg" className="rounded-full px-12">
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
        <div className="mb-12 text-center animate-fade-in">
          <div className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest w-fit mx-auto mb-4">
            Finale Prüfung
          </div>
          <h1 className="text-4xl font-bold mb-4">Erkennst du den Schwindel?</h1>
          <p className="text-muted-foreground">Fall {currentCase + 1} von {cases.length}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card animate-fade-in delay-100">
             <Image 
                src={misImg.imageUrl} 
                alt={misImg.description} 
                fill
                className="object-cover opacity-50"
             />
             <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
                <ShieldAlert className="w-16 h-16 text-primary mb-4 block mx-auto opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <p className="text-lg font-medium leading-relaxed italic">{c.description}</p>
             </div>
          </div>

          <div className="animate-fade-in delay-200">
            <h3 className="text-2xl font-bold mb-6">Was sagst du?</h3>
            <div className="space-y-4 mb-8">
              {c.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex justify-between items-center
                    ${selected === idx ? (idx === c.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : 'border-white/10 bg-white/5 hover:border-primary/50'}
                  `}
                >
                  <span className="font-semibold">{opt}</span>
                  {selected !== null && idx === c.correct && <CheckCircle className="text-green-500 w-6 h-6" />}
                  {selected === idx && idx !== c.correct && <XCircle className="text-red-500 w-6 h-6" />}
                </button>
              ))}
            </div>

            {selected !== null && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-fade-in">
                <p className="text-sm font-semibold text-primary mb-2">Didaktische Begründung:</p>
                <p className="text-muted-foreground leading-relaxed">{c.explanation}</p>
                <Button onClick={next} className="mt-6 w-full gap-2 rounded-xl">
                  Nächster Fall <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
