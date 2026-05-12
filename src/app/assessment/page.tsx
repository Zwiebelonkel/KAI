
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
    description: "In sozialen Medien kursiert ein Video, in dem ein bekannter Wettermoderator behauptet, dass es bald Goldmünzen regnen wird, verursacht durch ein neues Experiment in der Stratosphäre.",
    clues: ["Lippenbewegungen asynchron", "Stimme klingt leicht metallisch", "Keine seriöse Quelle bestätigt die News"],
    options: ["Echt", "KI-Manipuliert"],
    correct: 1,
    explanation: "Hierbei handelt es sich um ein sogenanntes Deepfake. Die Stimme wurde künstlich generiert (Voice Cloning) und die Lippenbewegungen nachträglich angepasst.",
    icon: <Volume2 className="w-12 h-12 text-primary" />
  },
  {
    id: 2,
    title: "Angebliche CEO-Mail",
    description: "Du erhältst eine E-Mail deines CEOs mit einer Sprachnachricht. Er bittet dich, dringend eine Überweisung zu tätigen, da er gerade am Flughafen ist und sein System nicht funktioniert.",
    clues: ["Dringlichkeit erzeugt Druck", "Ungewöhnliche Bitte", "Stimme perfekt, aber Kontext verdächtig"],
    options: ["Echt", "Betrugsversuch (Social Engineering)"],
    correct: 1,
    explanation: "Social Engineering Angriffe nutzen oft KI-Stimmen, um Vertrauen zu erschleichen. Seriöse Firmen fordern niemals Überweisungen per Sprachnachricht an.",
    icon: <Mail className="w-12 h-12 text-primary" />
  },
  {
    id: 3,
    title: "Das perfekte Urlaubsfoto",
    description: "Ein Reiseinfluencer postet ein Foto von einem magischen lila Strand auf Bali, den noch nie jemand zuvor gesehen hat. Das Wasser leuchtet in Neonfarben.",
    clues: ["Farben wirken unnatürlich", "Texturen im Hintergrund verschwimmen seltsam", "Keine Standortdaten verfügbar"],
    options: ["Echt", "KI-Generiert"],
    correct: 1,
    explanation: "KI-Bildgeneratoren neigen zu übertriebenen Farben und Fehlern in komplexen Texturen (wie Wasser oder Sand). Solche 'perfekten' Orte sind oft rein digital.",
    icon: <ImageIcon className="w-12 h-12 text-primary" />
  },
  {
    id: 4,
    title: "Der 'Wunder-Bot'-Chat",
    description: "Ein Kundensupport-Chat antwortet dir in Lichtgeschwindigkeit auf Deutsch, macht aber eigenartige Grammatikfehler und wiederholt ständig denselben Satzbau.",
    clues: ["Extreme Geschwindigkeit", "Repetitive Phrasen", "Kein Eingehen auf emotionale Nuancen"],
    options: ["Mensch", "KI-Bot"],
    correct: 1,
    explanation: "Bots sind extrem schnell, können aber bei komplexen oder emotionalen Anliegen 'hängen' bleiben oder unnatürliche Satzmuster wiederholen.",
    icon: <ShieldAlert className="w-12 h-12 text-primary" />
  },
  {
    id: 5,
    title: "Breaking News auf X",
    description: "Ein Video zeigt eine Explosion vor dem Weißen Haus. Es wurde von einem Account mit blauem Haken gepostet, der erst seit 2 Stunden existiert.",
    clues: ["Junger Account", "Keine Berichterstattung in TV-Sendern", "Details im Video (Fensterreihen) wirken unlogisch"],
    options: ["Echt", "KI-Desinformation"],
    correct: 1,
    explanation: "Desinformation nutzt oft frische Accounts mit gekauften Haken. KI-Bilder haben oft architektonische Fehler (z.B. falsche Fensteranzahl).",
    icon: <Eye className="w-12 h-12 text-primary" />
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
          <h2 className="text-4xl font-bold mb-4">Test beendet!</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Du hast {score} von {cases.length} Fällen korrekt beurteilt. 
            {score === cases.length ? " Wahnsinn! Ein echter Profi." : score >= 3 ? " Gut gemacht, aber bleib wachsam!" : " Da ist noch Luft nach oben."}
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
            Transfer-Test: KI im Alltag
          </div>
          <h1 className="text-4xl font-bold mb-4">Erkennst du den Schwindel?</h1>
          <p className="text-muted-foreground">Szenario {currentCase + 1} von {cases.length}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
          <div className="relative aspect-square rounded-3xl overflow-hidden glass-card animate-fade-in delay-100 border-primary/20">
             <Image 
                src={misImg.imageUrl} 
                alt={misImg.description} 
                fill
                className="object-cover opacity-20"
             />
             <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-6 bg-primary/20 p-4 rounded-full">
                  {c.icon}
                </div>
                <h4 className="text-xl font-bold mb-4">{c.title}</h4>
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
                  <span className="font-semibold text-lg">{opt}</span>
                  {selected !== null && idx === c.correct && <CheckCircle className="text-green-500 w-6 h-6" />}
                  {selected === idx && idx !== c.correct && <XCircle className="text-red-500 w-6 h-6" />}
                </button>
              ))}
            </div>

            {selected !== null && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl animate-fade-in">
                <p className="text-sm font-semibold text-primary mb-2">Die Erklärung:</p>
                <p className="text-muted-foreground leading-relaxed">{c.explanation}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.clues.map((clue, i) => (
                    <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded-md text-muted-foreground uppercase tracking-tight">
                      {clue}
                    </span>
                  ))}
                </div>

                <Button onClick={next} className="mt-6 w-full gap-2 rounded-xl h-12">
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
