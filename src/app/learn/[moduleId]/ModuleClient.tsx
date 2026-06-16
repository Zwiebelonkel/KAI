"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { LearningModule, UserProgress, Trophy } from "@/lib/types";
import { GlossaryCard } from "@/components/GlossaryCard";
import { Quiz } from "@/components/Quiz";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  PlayCircle,
  CheckCircle,
  Sparkles,
  FileText,
} from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { kaiApi } from "@/lib/api-service";
import { ProgressBar } from "@/components/ProgressBar";
import { getDifficultyColors } from "@/lib/difficulty-colors";
import { LootboxOverlay } from "@/components/LootboxOverlay";
import { cn } from "@/lib/utils";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ModuleClientProps {
  module: LearningModule;
}

function splitLessonContent(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function getEmbeddableVideoUrl(videoLink?: string): string | null {
  if (!videoLink) return null;

  try {
    const url = new URL(videoLink);
    if (!/^https?:$/.test(url.protocol)) return null;

    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const videoId =
        url.searchParams.get("v") ||
        url.pathname.split("/").filter(Boolean).at(-1);
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const videoId = url.pathname.split("/").filter(Boolean).at(-1);
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

function renderLessonBlock(block: string, index: number, accentText: string) {
  if (/^#{1,3}\s+/.test(block)) {
    return (
      <h3
        key={index}
        className="pt-3 text-2xl md:text-3xl font-black tracking-tight text-white"
      >
        {block.replace(/^#{1,3}\s+/, "")}
      </h3>
    );
  }

  const lines = block
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const isList =
    lines.length > 1 && lines.every((line) => /^[-*•]\s+/.test(line));

  if (isList) {
    return (
      <ul key={index} className="space-y-3 pl-2">
        {lines.map((line, lineIndex) => (
          <li
            key={lineIndex}
            className="flex gap-3 text-base md:text-lg leading-8 text-white/82"
          >
            <span
              className={cn(
                "mt-3 h-2 w-2 shrink-0 rounded-full",
                accentText.replace("text-", "bg-"),
              )}
            />
            <span>{line.replace(/^[-*•]\s+/, "")}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <p
      key={index}
      className="text-base md:text-lg leading-8 md:leading-9 text-white/82"
    >
      {block}
    </p>
  );
}

export function ModuleClient({ module: initialModule }: ModuleClientProps) {
  const router = useRouter();
  const [module, setModule] = React.useState(initialModule);
  const [readTerms, setReadTerms] = React.useState<string[]>([]);
  const [isQuizDone, setIsQuizDone] = React.useState(false);
  const [showLootbox, setShowLootbox] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [userProgress, setUserProgress] = React.useState<UserProgress | null>(
    null,
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        gsap.from(".animate-reveal", {
          y: 40,
          opacity: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
        });

        gsap.from(".hero-visual", {
          scale: 1.1,
          opacity: 0,
          duration: 1.2,
          ease: "power2.out",
        });
      }
    },
    { scope: containerRef },
  );

  // Refresh the module from the API so database-backed lesson images are visible in lessons.
  React.useEffect(() => {
    let isMounted = true;
    setModule(initialModule);

    if (kaiApi.isConfigured) {
      kaiApi
        .getModule(initialModule.id)
        .then((remoteModule) => {
          if (isMounted) setModule(remoteModule);
        })
        .catch((error) => console.warn("KAI module refresh failed:", error));
    }

    return () => {
      isMounted = false;
    };
  }, [initialModule]);

  // Load user progress from the API when configured; keep local fallback for dev.
  React.useEffect(() => {
    const loadProgress = async () => {
      if (kaiApi.isConfigured && kaiApi.getToken()) {
        const remoteProgress = await kaiApi.getProgress();
        setUserProgress(remoteProgress);
        setIsQuizDone(remoteProgress.completedModules.includes(module.id));
        return;
      }

      const saved = localStorage.getItem("kai_user_progress");
      if (saved) {
        const parsed: UserProgress = JSON.parse(saved);
        setUserProgress(parsed);
        setIsQuizDone(parsed.completedModules.includes(module.id));
      }
    };

    loadProgress().catch((error) =>
      console.warn("KAI API progress load failed:", error),
    );
  }, [module.id]);

  const handleTermOpen = (term: string) => {
    if (!readTerms.includes(term)) {
      setReadTerms((prev) => [...prev, term]);
    }
  };

  const persistProgress = (nextProgress: UserProgress) => {
    setUserProgress(nextProgress);
    if (kaiApi.isConfigured && kaiApi.getToken()) {
      kaiApi
        .saveProgress(nextProgress)
        .catch((error) => console.warn("KAI API progress save failed:", error));
    } else {
      localStorage.setItem("kai_user_progress", JSON.stringify(nextProgress));
    }
  };

  const handleQuizComplete = (score: number) => {
    const currentProgress: UserProgress = userProgress || {
      level: "Einsteiger",
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
      kaiApi
        .submitModuleCompletion(module.id)
        .catch((error) =>
          console.warn("KAI API completion submit failed:", error),
        );
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

  const imageId = `${module.id.split("-")[0]}-hero`;
  const heroImage =
    PlaceHolderImages.find((img) => img.id === imageId) || PlaceHolderImages[0];
  const difficultyColors = getDifficultyColors(module.minLevel);
  const lessonImages = module.lessonImages || [];
  const lessonContentBlocks = splitLessonContent(module.content);
  const embeddableVideoUrl = getEmbeddableVideoUrl(module.videoLink);
  const renderLessonImages = (
    placement: NonNullable<LearningModule["lessonImages"]>[number]["placement"],
  ) => {
    const images = lessonImages.filter(
      (image) => image.placement === placement && image.imageUrl,
    );
    if (!images.length) return null;

    return (
      <div className="animate-reveal grid gap-6">
        {images.map((image) => (
          <figure
            key={image.id}
            className={cn(
              "overflow-hidden rounded-2xl md:rounded-[2rem] border bg-white/[0.03]",
              difficultyColors.accentBorder,
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={image.alt}
              className="max-h-[520px] w-full object-cover"
            />
            {image.alt && (
              <figcaption className="px-5 py-3 text-sm text-muted-foreground">
                {image.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen pt-20 pb-20 overflow-x-hidden"
      ref={containerRef}
    >
      <div className="mesh-bg" />
      <Header />

      {showLootbox && <LootboxOverlay onClose={handleLootboxClose} />}

      <div className="fixed bottom-0 left-0 right-0 z-[60] h-1.5 bg-background">
        <ProgressBar
          value={progress}
          className={cn("h-full rounded-none", difficultyColors.progressTrack)}
          indicatorClassName={difficultyColors.progress}
        />
      </div>

      <main className="container mx-auto px-4 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-8 md:mb-12 hover:bg-white/5 -ml-2 md:-ml-4 rounded-full group animate-reveal text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />{" "}
          Zurück zum Lernpfad
        </Button>

        <div className="mb-10 md:mb-16 animate-reveal">
          <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight">
              {module.title}
            </h1>
            {isQuizDone && (
              <div className="bg-green-500/20 p-2 rounded-full border border-green-500/30">
                <CheckCircle className="w-6 h-6 md:w-10 md:h-10 text-green-500 animate-in zoom-in spin-in-12 duration-700" />
              </div>
            )}
          </div>
          <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed font-medium max-w-3xl">
            {module.description}
          </p>
        </div>

        {renderLessonImages("after-description")}

        <div
          className={cn(
            "relative aspect-video rounded-2xl md:rounded-[2.5rem] overflow-hidden mb-12 md:mb-16 glass-card group hero-visual shadow-2xl border",
            difficultyColors.accentBorder,
            difficultyColors.accentShadow,
          )}
        >
          {embeddableVideoUrl ? (
            <iframe
              src={embeddableVideoUrl}
              title={`Video zu ${module.title}`}
              className="absolute inset-0 h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <>
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                fill
                className="object-cover transition-transform duration-[3s] group-hover:scale-110"
                data-ai-hint={heroImage.imageHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-center justify-center">
                <Button
                  size="icon"
                  className={cn(
                    "w-16 h-16 md:w-24 md:h-24 rounded-full hover:scale-110 transition-transform border-0",
                    difficultyColors.selectedArrow,
                    difficultyColors.accentShadow,
                  )}
                >
                  <PlayCircle className="w-8 h-8 md:w-12 md:h-12 fill-white" />
                </Button>
              </div>
            </>
          )}
        </div>

        <article className="max-w-none mb-16 md:mb-24 space-y-12 md:space-y-20">
          <section
            className={cn(
              "animate-reveal rounded-2xl md:rounded-[2.5rem] border bg-card/85 p-6 md:p-12 shadow-2xl backdrop-blur-xl",
              difficultyColors.accentBorder,
              difficultyColors.accentShadow,
            )}
            aria-labelledby="lesson-content-title"
          >
            <div className="mb-8 flex items-start gap-4 md:gap-5">
              <div
                className={cn(
                  "p-3 md:p-4 rounded-xl md:rounded-2xl border",
                  difficultyColors.accentBg,
                  difficultyColors.accentBorder,
                  difficultyColors.accentText,
                )}
              >
                <FileText className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <div>
                <p
                  className={cn(
                    "mb-2 text-sm md:text-base font-black uppercase tracking-[0.3em]",
                    difficultyColors.accentText,
                  )}
                >
                  Lerninhalt
                </p>
                <h2
                  id="lesson-content-title"
                  className="text-2xl md:text-4xl font-black tracking-tight"
                >
                  {module.title}
                </h2>
              </div>
            </div>
            <div className="space-y-6 md:space-y-8">
              {lessonContentBlocks.map((block, index) =>
                renderLessonBlock(block, index, difficultyColors.accentText),
              )}
            </div>
          </section>

          {renderLessonImages("after-content")}
          {renderLessonImages("before-glossary")}

          <div className="animate-reveal">
            <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 flex items-center gap-3 md:gap-4 tracking-tight">
              <div
                className={cn(
                  "p-2 md:p-3 rounded-xl md:rounded-2xl border",
                  difficultyColors.accentBg,
                  difficultyColors.accentBorder,
                  difficultyColors.accentText,
                  difficultyColors.accentShadow,
                )}
              >
                <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
              </div>
              Glossar: Fachbegriffe
            </h2>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 font-medium">
              Öffne die Begriffe, um sie tiefgreifend zu verstehen.
            </p>
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

        {renderLessonImages("before-quiz")}

        <section id="quiz" className="animate-reveal scroll-mt-24">
          <Quiz questions={module.quiz} onComplete={handleQuizComplete} />
        </section>

        {isQuizDone && (
          <div className="mt-12 md:mt-20 text-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Button
              size="lg"
              onClick={() => router.push("/")}
              className="w-full sm:w-auto rounded-full px-12 md:px-16 h-14 md:h-16 text-lg md:text-xl font-bold neon-shadow group"
            >
              Lektion abschließen{" "}
              <ArrowLeft className="ml-4 w-5 h-5 md:w-6 md:h-6 rotate-180 group-hover:translate-x-2 transition-transform" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
