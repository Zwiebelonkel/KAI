"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/Header"
import { modules } from "@/lib/course-data"
import { GlossaryCard } from "@/components/GlossaryCard"
import { Quiz } from "@/components/Quiz"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Lightbulb, PlayCircle } from "lucide-react"
import Image from "next/image"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export async function generateStaticParams() {
  return modules.map((module) => ({
    moduleId: module.id,
  }))
}

export default function LearnPage() {
  const params = useParams();
  const moduleId = params?.moduleId as string;
  const router = useRouter();
  const module = modules.find(m => m.id === moduleId);
  
  if (!module) return <div className="min-h-screen flex items-center justify-center">Modul nicht gefunden</div>;

  const imageId = `${module.id.split('-')[0]}-hero`;
  const heroImage = PlaceHolderImages.find(img => img.id === imageId) || 
                    PlaceHolderImages[0] || 
                    { 
                      imageUrl: "https://picsum.photos/seed/default/800/400", 
                      description: "Lernmodul Bild", 
                      imageHint: "technology" 
                    };

  return (
    <div className="min-h-screen pt-20 pb-20">
      <Header />
      
      <main className="container mx-auto px-4 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')} 
          className="mb-8 hover:bg-white/5 -ml-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Zurück zum Lernpfad
        </Button>

        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{module.title}</h1>
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
          
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-secondary" /> 
            Glossar: Fachbegriffe verständlich
          </h2>
          <div className="grid gap-2">
            {module.glossary.map((item, idx) => (
              <GlossaryCard key={idx} term={item.term} definition={item.definition} />
            ))}
          </div>
        </article>

        <section id="quiz" className="animate-fade-in delay-300">
          <Quiz 
            questions={module.quiz} 
            onComplete={(score) => {
              console.log(`Quiz abgeschlossen mit Score: ${score}`);
            }} 
          />
        </section>
      </main>
    </div>
  );
}
