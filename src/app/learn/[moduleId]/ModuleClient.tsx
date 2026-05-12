"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { LearningModule, UserProgress } from "@/lib/types"
import { GlossaryCard } from "@/components/GlossaryCard"
import { Quiz } from "@/components/Quiz"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Lightbulb, PlayCircle, CheckCircle } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { ProgressBar } from "@/components/ProgressBar"

interface ModuleClientProps {
  module: LearningModule;
}

export function ModuleClient({ module }: ModuleClientProps) {
  const router = useRouter();
  const [readTerms, setReadTerms] = React.useState<string[]>([]);
  const [isQuizDone, setIsQuizDone] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  // Load state from localStorage on mount
  React.useEffect(() => {
    const saved = localStorage.getItem('kai_user_progress');
    if (saved) {
      const parsed: UserProgress = JSON.parse(saved);
      if (parsed.completedModules.includes(module.id)) {
        setIsQuizDone(true);
      }
    }
  }, [module.id]);

  const handleTermOpen = (term: string) => {
    if (!readTerms.includes(term)) {
      setReadTerms(prev => [...prev, term]);
    }
  };

  const handleQuizComplete = (score: number) => {
    setIsQuizDone(true);
    
    // Save to localStorage
    const saved = localStorage.getItem('kai_user_progress');
    let currentProgress: UserProgress = saved 
      ? JSON.parse(saved) 
      : { level: 'Einsteiger', completedModules: [], quizScores: {}, totalProgress: 0 };
    
    if (!currentProgress.completedModules.includes(module.id)) {
      currentProgress.completedModules.push(module.id);
    }
    currentProgress.quizScores[module.id] = score;
    
    localStorage.setItem('kai_user_progress', JSON.stringify(currentProgress));
  };

  // Calculate local page progress
  React.useEffect(() => {
    const totalItems = module.glossary.length + 1; // +1 for Quiz
    const itemsDone = readTerms.length + (isQuizDone ? 1 : 0);
    setProgress(Math.round((itemsDone / totalItems) * 100));
  }, [readTerms, isQuizDone, module.glossary.length]);

  const imageId = `${module.id.split('-')[0]}-hero`;
  const heroImage = PlaceHolderImages.find(img => img.id === imageId) || 
                    PlaceHolderImages[0];

  return (
    <div className="min-h-screen pt-20 pb-20">
      <Header />
      
      <div className="fixed bottom-0 left-0 right-0 z-40 h-1 bg-background">
        <ProgressBar value={progress} className="h-2 rounded-none" />
      </div>

      <main className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')} 
          className="mb-8 hover:bg-white/5 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Lernpfad
        </Button>

        <div className="mb-12 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{module.title}</h1>
             {isQuizDone && <CheckCircle className="w-8 h-8 text-green-500 animate-in zoom-in" />}
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">{module.description}</p>
        </div>

        <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 glass-card border-white/5 group animate-fade-in delay-100">
          <Image 
            src={heroImage.imageUrl} 
            alt={heroImage.description} 
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-105"
            data-ai-hint={heroImage.imageHint}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-center justify-center">
            <Button size="icon" className="w-20 h-20 rounded-full neon-shadow hover:scale-110 transition-transform">
              <PlayCircle className="w-10 h-10 fill-white" />
            </Button>
          </div>
        </div>

        <article className="prose prose-invert max-w-none mb-16 animate-fade-in delay-200">
          <div className="bg-primary/5 border-l-4 border-primary p-6 rounded-r-2xl mb-12 flex gap-4">
            <Lightbulb className="w-8 h-8 text-primary shrink-0" />
            <div>
              <p className="text-lg text-primary-foreground italic">
                "{module.content}"
              </p>
            </div>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-secondary" /> 
              Glossar: Fachbegriffe verständlich
            </h2>
            <p className="text-muted-foreground mb-6">Öffne die Begriffe, um sie als gelesen zu markieren.</p>
            <div className="grid gap-2">
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

        <section id="quiz" className="animate-fade-in delay-300 scroll-mt-24">
          <Quiz 
            questions={module.quiz} 
            onComplete={handleQuizComplete} 
          />
        </section>

        {isQuizDone && (
          <div className="mt-12 text-center animate-fade-in">
            <Button 
              size="lg" 
              onClick={() => router.push('/')} 
              className="rounded-full px-12 h-14 text-lg neon-shadow"
            >
              Lektion abschließen & zum Lernpfad
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
