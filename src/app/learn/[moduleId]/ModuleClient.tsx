
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { LearningModule, UserProgress, Trophy } from "@/lib/types"
import { GlossaryCard } from "@/components/GlossaryCard"
import { Quiz } from "@/components/Quiz"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Lightbulb, PlayCircle, CheckCircle, Sparkles } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { kaiApi } from "@/lib/api-service"
import { ProgressBar } from "@/components/ProgressBar"
import { LootboxOverlay } from "@/components/LootboxOverlay"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface ModuleClientProps {
  module: LearningModule;
}

export function ModuleClient({ module }: ModuleClientProps) {
  const router = useRouter();
  const [readTerms, setReadTerms] = React.useState<string[]>([]);
  const [isQuizDone, setIsQuizDone] = React.useState(false);
  const [showLootbox, setShowLootbox] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [userProgress, setUserProgress] = React.useState<UserProgress | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.from(".animate-reveal", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out"
      });
      
      gsap.from(".hero-visual", {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        ease: "power2.out"
      });
    }
  }, { scope: containerRef });

  // Load user progress from the API when configured; keep local fallback for dev.
  React.useEffect(() => {
    const loadProgress = async () => {
      if (kaiApi.isConfigured && kaiApi.getToken()) {
        const remoteProgress = await kaiApi.getProgress();
        setUserProgress(remoteProgress);
        setIsQuizDone(remoteProgress.completedModules.includes(module.id));
        return;
      }

      const saved = localStorage.getItem('kai_user_progress');
      if (saved) {
        const parsed: UserProgress = JSON.parse(saved);
        setUserProgress(parsed);
        setIsQuizDone(parsed.completedModules.includes(module.id));
      }
    };

    loadProgress().catch((error) => console.warn('KAI API progress load failed:', error));
  }, [module.id]);

  const handleTermOpen = (term: string) => {
    if (!readTerms.includes(term)) {
      setReadTerms(prev => [...prev, term]);
    }
  };

  const persistProgress = (nextProgress: UserProgress) => {
    setUserProgress(nextProgress);
    if (kaiApi.isConfigured && kaiApi.getToken()) {
      kaiApi.saveProgress(nextProgress).catch((error) => console.warn('KAI API progress save failed:', error));
    } else {
      localStorage.setItem('kai_user_progress', JSON.stringify(nextProgress));
    }
  };

  const handleQuizComplete = (score: number) => {
    const currentProgress: UserProgress = userProgress || {
      level: 'Einsteiger',
      completedModules: [],
      quizScores: {},
      totalProgress: 0,
      trophies: [],
    };

    const wasAlreadyDone = currentProgress.completedModules.includes(module.id);
    const nextProgress: UserProgress = {
      ...currentProgress,
      completedModules: wasAlreadyDone
        ? currentProgress.completedModules
        : [...currentProgress.completedModules, module.id],
      quizScores: { ...currentProgress.quizScores, [module.id]: score },
    };

    if (!wasAlreadyDone) {
      setShowLootbox(true);
      kaiApi.submitModuleCompletion(module.id).catch((error) => console.warn('KAI API completion submit failed:', error));
    }
    persistProgress(nextProgress);
    setIsQuizDone(true);
  };

  const handleLootboxClose = (trophies: Trophy[]) => {
    if (userProgress) {
      persistProgress({
        ...userProgress,
        trophies: [...(userProgress.trophies || []), ...trophies],
      });
    }
    setShowLootbox(false);
  };

  React.useEffect(() => {
    const totalItems = module.glossary.length + 1; 
    const itemsDone = readTerms.length + (isQuizDone ? 1 : 0);
    setProgress(Math.round((itemsDone / totalItems) * 100));
  }, [readTerms, isQuizDone, module.glossary.length]);

  const imageId = `${module.id.split('-')[0]}-hero`;
  const heroImage = PlaceHolderImages.find(img => img.id === imageId) || 
                    PlaceHolderImages[0];

  return (
    <div className="min-h-screen pt-20 pb-20 overflow-x-hidden" ref={containerRef}>
      <div className="mesh-bg" />
      <Header />
      
      {showLootbox && <LootboxOverlay onClose={handleLootboxClose} />}

      <div className="fixed bottom-0 left-0 right-0 z-[60] h-1.5 bg-background">
        <ProgressBar value={progress} className="h-full rounded-none" />
      </div>

      <main className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')} 
          className="mb-8 md:mb-12 hover:bg-white/5 -ml-2 md:-ml-4 rounded-full group animate-reveal text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Zurück zum Lernpfad
        </Button>

        <div className="mb-10 md:mb-16 animate-reveal">
          <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-6">
             <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight">{module.title}</h1>
             {isQuizDone && (
               <div className="bg-green-500/20 p-2 rounded-full border border-green-500/30">
                 <CheckCircle className="w-6 h-6 md:w-10 md:h-10 text-green-500 animate-in zoom-in spin-in-12 duration-700" />
               </div>
             )}
          </div>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-medium max-w-3xl">{module.description}</p>
        </div>

        <div className="relative aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-12 md:mb-16 glass-card border-white/10 group hero-visual shadow-primary/10 shadow-2xl">
          <Image 
            src={heroImage.imageUrl} 
            alt={heroImage.description} 
            fill
            className="object-cover transition-transform duration-[3s] group-hover:scale-110"
            data-ai-hint={heroImage.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-center justify-center">
            <Button size="icon" className="w-16 h-16 md:w-24 md:h-24 rounded-full neon-shadow hover:scale-110 transition-transform bg-primary text-white border-0">
              <PlayCircle className="w-8 h-8 md:w-12 md:h-12 fill-white" />
            </Button>
          </div>
        </div>

        <article className="max-w-none mb-16 md:mb-24 space-y-12 md:space-y-20">
          <div className="animate-reveal p-6 md:p-12 rounded-2xl md:rounded-[2.5rem] premium-gradient border border-white/5 flex flex-col md:flex-row gap-6 md:gap-8 items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:rotate-12 transition-transform duration-700 hidden md:block">
               <Sparkles className="w-32 h-32 text-primary" />
            </div>
            <div className="bg-primary/20 p-3 md:p-4 rounded-xl md:rounded-2xl relative z-10 neon-shadow animate-float">
               <Lightbulb className="w-6 h-6 md:w-10 md:h-10 text-primary" />
            </div>
            <div className="relative z-10">
              <p className="text-xl md:text-3xl font-bold italic leading-snug tracking-tight text-white/90">
                "{module.content}"
              </p>
            </div>
          </div>
          
          <div className="animate-reveal">
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 flex items-center gap-3 md:gap-4 tracking-tight">
              <div className="bg-secondary/20 p-2 md:p-3 rounded-xl md:rounded-2xl text-secondary violet-shadow">
                <BookOpen className="w-6 h-6 md:w-8 md:h-8" /> 
              </div>
              Glossar: Fachbegriffe
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 font-medium">Öffne die Begriffe, um sie tiefgreifend zu verstehen.</p>
            <div className="grid gap-3 md:gap-4">
              {module.glossary.map((item, idx) => (
                <GlossaryCard 
                  key={idx} 
                  term={item.term} 
                  definition={item.definition} 
                  onOpen={() => handleTermOpen(item.term)}
                  isRead={readTerms.includes(item.term)}
                />
              ))}
            </div>
          </div>
        </article>

        <section id="quiz" className="animate-reveal scroll-mt-24">
          <Quiz 
            questions={module.quiz} 
            onComplete={handleQuizComplete} 
          />
        </section>

        {isQuizDone && (
          <div className="mt-12 md:mt-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Button 
              size="lg" 
              onClick={() => router.push('/')} 
              className="w-full sm:w-auto rounded-full px-12 md:px-16 h-14 md:h-16 text-lg md:text-xl font-bold neon-shadow group"
            >
              Lektion abschließen <ArrowLeft className="ml-4 w-5 h-5 md:w-6 md:h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
