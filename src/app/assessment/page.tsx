
"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  Eye, 
  Volume2, 
  Mail, 
  Image as ImageIcon,
  MessageSquare,
  Globe,
  DollarSign,
  FileText,
  PhoneCall,
  Download,
  FileDown
} from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Certificate } from "@/components/Certificate"
import { UserProgress } from "@/lib/types"
import { getDifficultyColors } from "@/lib/difficulty-colors"
import { cn } from "@/lib/utils"
import { kaiApi } from "@/lib/api-service"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const cases = [
  {
    id: 1,
    title: "Der 'Goldene-Regen'-Post",
    description: "In sozialen Medien kursiert ein Video, in dem ein bekannter Wettermoderator behauptet, dass es bald Goldmünzen regnen wird.",
    clues: ["Asynchron", "Metallische Stimme", "Keine Quelle"],
    options: ["Echt", "KI-Manipuliert"],
    correct: 1,
    explanation: "Hierbei handelt es sich um ein Deepfake. Stimme und Lippen wurden künstlich angepasst, um eine absurde Falschmeldung zu verbreiten.",
    icon: <Volume2 className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 2,
    title: "Angebliche CEO-Mail",
    description: "Du erhältst eine E-Mail deines CEOs mit einer Sprachnachricht. Er bittet dich um eine dringende Überweisung für ein geheimes Projekt.",
    clues: ["Druck", "Ungewöhnlich", "Verdächtig"],
    options: ["Echt", "Betrugsversuch"],
    correct: 1,
    explanation: "Social Engineering nutzt KI-Stimmen (Voice Cloning), um Vertrauen zu erschleichen. Seriöse Firmen fordern niemals Überweisungen per Sprachnachricht an.",
    icon: <Mail className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 3,
    title: "Perfektes Urlaubsfoto",
    description: "Ein Influencer postet ein Foto von einem magischen lila Strand auf Bali. Das Wasser leuchtet neonfarben und der Sand glitzert.",
    clues: ["Unnatürlich", "Verschwommen", "Keine Daten"],
    options: ["Echt", "KI-Generiert"],
    correct: 1,
    explanation: "KI neigt zu übertriebenen Farben und Fehlern in Texturen wie Wasser oder Sand. Oft fehlen EXIF-Daten (Metadaten) in solchen Bildern.",
    icon: <ImageIcon className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 4,
    title: "Der 'Wunder-Bot'-Chat",
    description: "Ein Support-Chat antwortet in Lichtgeschwindigkeit, macht aber eigenartige Grammatikfehler und wiederholt Phrasen.",
    clues: ["Schnell", "Repetitiv", "Emotionslos"],
    options: ["Mensch", "KI-Bot"],
    correct: 1,
    explanation: "Bots sind extrem schnell, bleiben aber bei komplexen oder emotionalen Anliegen oft hängen und nutzen repetitive Satzbausteine.",
    icon: <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 5,
    title: "Breaking News auf X",
    description: "Ein Video zeigt eine Explosion vor einem historischen Monument. Gepostet von einem ganz neuen Account ohne Follower.",
    clues: ["Junger Account", "Keine News", "Logikfehler"],
    options: ["Echt", "KI-Desinformation"],
    correct: 1,
    explanation: "KI-Bilder haben oft architektonische Fehler (z.B. falsche Fensteranzahl) und werden meist über 'Wegwerf-Accounts' gestreut.",
    icon: <Eye className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 6,
    title: "Der Enkeltrick 2.0",
    description: "Eine Oma erhält einen Anruf von ihrem Enkel. Die Stimme klingt exakt wie er, aber er verlangt Geld für eine Kaution.",
    clues: ["Emotionaler Druck", "Voice Cloning", "Geldforderung"],
    options: ["Echt", "KI-Anruf"],
    correct: 1,
    explanation: "KI-Stimmklone können aus nur wenigen Sekunden Originalmaterial erstellt werden. Bei Geldforderungen immer über eine bekannte Nummer zurückrufen!",
    icon: <PhoneCall className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 7,
    title: "Übertriebene Rezensionen",
    description: "Ein neues Produkt hat 500 Fünf-Sterne-Bewertungen innerhalb von 2 Stunden erhalten. Alle Texte klingen sehr ähnlich.",
    clues: ["Zu schnell", "Ähnlicher Stil", "Keine Details"],
    options: ["Echte Kunden", "KI-Bot-Farm"],
    correct: 1,
    explanation: "Große Sprachmodelle werden genutzt, um massenhaft Rezensionen zu schreiben. Verdächtig sind fehlende Details und identische Satzstrukturen.",
    icon: <Globe className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 8,
    title: "Promi-Investment-Tipp",
    description: "Ein Video zeigt Elon Musk, wie er eine neue Krypto-Plattform empfiehlt, die 1000% Gewinn garantiert.",
    clues: ["Unnatürlicher Mund", "Gier-Appell", "Unstimmig"],
    options: ["Echtes Interview", "Deepfake Scam"],
    correct: 1,
    explanation: "Scammer nutzen Deepfakes von Prominenten. Achte auf die Mundbewegungen und darauf, ob das Gesagte zum Ruf der Person passt.",
    icon: <DollarSign className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 9,
    title: "Wissenschaftlicher Abstract",
    description: "Ein Artikel behauptet, dass Bananen gegen Computerviren helfen. Er ist voller Fachbegriffe, Quellen fehlen aber.",
    clues: ["Keine Belege", "Absurdität", "Fachbegriff-Salat"],
    options: ["Wissenschaftlich", "KI-Halluzination"],
    correct: 1,
    explanation: "KI kann Texte generieren, die fundiert klingen, aber inhaltlich völlig falsch sind (Halluzinationen). Überprüfe immer die Quellenangaben.",
    icon: <FileText className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  },
  {
    id: 10,
    title: "E-Mail-Phishing-Check",
    description: "Eine Mail von 'Paypal' informiert dich über eine Kontosperrung. Der Text ist fehlerfrei, aber die Anrede ist 'Sehr geehrter Kunde'.",
    clues: ["Vage Anrede", "Druck", "Link-Vorschau"],
    options: ["Offizielle Mail", "KI-generiertes Phishing"],
    correct: 1,
    explanation: "KI hilft Betrügern, fehlerfreie Phishing-Mails zu schreiben. Seriöse Anbieter nutzen jedoch fast immer eine persönliche Anrede.",
    icon: <ShieldAlert className="w-8 h-8 md:w-12 md:h-12 text-primary" />
  }
];

export default function AssessmentPage() {
  const [currentCase, setCurrentCase] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [isDone, setIsDone] = React.useState(false);
  const [results, setResults] = React.useState<boolean[]>([]);
  const [isExporting, setIsExporting] = React.useState(false);
  const [recipientName, setRecipientName] = React.useState<string | null>(null);
  const [difficultyLevel, setDifficultyLevel] = React.useState<UserProgress["level"]>(null);
  const certificateRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const storedUser = kaiApi.getStoredUser();
    if (storedUser?.displayName || storedUser?.email) {
      setRecipientName(storedUser.displayName || storedUser.email);
    }

    if (kaiApi.isConfigured && kaiApi.getToken()) {
      kaiApi.getProgress()
        .then((progress: UserProgress) => {
          setRecipientName(progress.displayName || progress.email || storedUser?.displayName || storedUser?.email || null);
          setDifficultyLevel(progress.level);
        })
        .catch((error) => console.warn('KAI API progress load failed:', error));
    } else {
      const saved = localStorage.getItem('kai_user_progress');
      if (saved) {
        const progress: UserProgress = JSON.parse(saved);
        setDifficultyLevel(progress.level);
      }
    }
  }, []);

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

  const downloadPDF = async () => {
    if (!certificateRef.current) return;
    setIsExporting(true);
    
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("l", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("KAI-Zertifikat.pdf");
    } catch (error) {
      console.error("Fehler beim Exportieren des PDFs:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const misImg = PlaceHolderImages.find(i => i.id === 'misinformation-hero') || PlaceHolderImages[0];
  const difficultyColors = difficultyLevel ? getDifficultyColors(difficultyLevel) : null;

  if (isDone) {
    const score = results.filter(r => r).length;
    const dateStr = new Date().toLocaleDateString('de-DE');
    
    return (
      <div className="min-h-screen pt-20 pb-20 flex flex-col items-center px-4">
        <Header />
        <div className="max-w-4xl w-full glass-card p-8 md:p-12 rounded-2xl md:rounded-3xl text-center animate-fade-in border-secondary/30">
          <Trophy className="w-16 h-16 md:w-20 md:h-20 text-secondary mx-auto mb-6 violet-shadow rounded-full p-4" />
          <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Check beendet!</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Du hast {score} von {cases.length} Fällen korrekt beurteilt. 
          </p>

          <div className="mb-12 overflow-x-auto p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="min-w-[800px] transform scale-[0.8] md:scale-100 origin-top">
              <Certificate 
                ref={certificateRef}
                score={score} 
                total={cases.length} 
                date={dateStr}
                recipientName={recipientName}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={downloadPDF} 
              disabled={isExporting}
              size="lg" 
              className="rounded-full px-8 h-14 font-bold neon-shadow gap-2"
            >
              <FileDown className="w-5 h-5" /> {isExporting ? "Generiere PDF..." : "Zertifikat als PDF laden"}
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/'} 
              size="lg" 
              className="rounded-full px-8 h-14 font-bold border-white/10 hover:bg-white/5"
            >
              Zurück zum Hauptmenü
            </Button>
          </div>
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
          <div className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest w-fit mx-auto mb-4 border", difficultyColors?.accentBg || "bg-primary/20", difficultyColors?.accentText || "text-primary", difficultyColors?.accentBorder || "border-primary/30")}>
            KI-Kompetenz Check: Praxis-Szenarien
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 tracking-tighter">Echt oder Fake?</h1>
          <p className="text-muted-foreground text-sm md:text-lg font-medium">Szenario {currentCase + 1} von {cases.length}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start mb-12">
          <div className={cn("relative aspect-square rounded-2xl md:rounded-3xl overflow-hidden glass-card animate-fade-in delay-100 border", difficultyColors?.accentBorder || "border-primary/20")}>
             <Image 
                src={misImg.imageUrl} 
                alt={misImg.description} 
                fill
                className="object-cover opacity-10"
             />
             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-8 text-center">
                <div className={cn("mb-4 md:mb-6 p-3 md:p-4 rounded-xl md:rounded-2xl", difficultyColors?.accentBg || "bg-primary/20")}>
                  {React.cloneElement(c.icon, { className: cn("w-8 h-8 md:w-12 md:h-12", difficultyColors?.accentText || "text-primary") })}
                </div>
                <h4 className="text-lg md:text-2xl font-bold mb-3 md:mb-4">{c.title}</h4>
                <p className="text-base md:text-xl font-medium leading-relaxed italic text-white/90">{c.description}</p>
             </div>
          </div>

          <div className="animate-fade-in delay-200">
            <h3 className="text-xl md:text-2xl font-black mb-6">Deine Einschätzung?</h3>
            <div className="space-y-3 md:space-y-4 mb-8">
              {c.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 md:p-6 rounded-xl md:rounded-2xl border-2 text-left transition-all duration-300 flex justify-between items-center
                    ${selected === idx ? (idx === c.correct ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10') : difficultyColors ? cn('border-white/10 bg-white/5', difficultyColors.cardBorder) : 'border-white/10 bg-white/5 hover:border-primary/50'}
                  `}
                >
                  <span className="font-bold text-base md:text-xl">{opt}</span>
                  {selected !== null && idx === c.correct && <CheckCircle className="text-green-500 w-5 h-5 md:w-8 md:h-8" />}
                  {selected === idx && idx !== c.correct && <XCircle className="text-red-500 w-5 h-5 md:w-8 md:h-8" />}
                </button>
              ))}
            </div>

            {selected !== null && (
              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl animate-fade-in shadow-2xl">
                <div className="flex items-center gap-2 mb-4">
                  <div className={cn("w-2 h-2 rounded-full animate-pulse", difficultyColors?.accentText.replace("text-", "bg-") || "bg-primary")} />
                  <p className={cn("text-[10px] md:text-xs font-bold uppercase tracking-widest", difficultyColors?.accentText || "text-primary")}>Die Auflösung</p>
                </div>
                <p className="text-sm md:text-lg text-muted-foreground leading-relaxed font-medium mb-6">{c.explanation}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.clues.map((clue, i) => (
                    <span key={i} className="text-[9px] md:text-[10px] bg-white/10 px-3 py-1.5 rounded-full text-muted-foreground uppercase tracking-tight font-black border border-white/5">
                      {clue}
                    </span>
                  ))}
                </div>

                <Button onClick={next} className={cn("mt-8 w-full gap-2 rounded-xl h-14 md:h-16 font-bold text-lg", difficultyColors?.selectedArrow || "neon-shadow", difficultyColors?.accentShadow)}>
                  {currentCase + 1 < cases.length ? "Nächstes Szenario" : "Ergebnis anzeigen"} <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
