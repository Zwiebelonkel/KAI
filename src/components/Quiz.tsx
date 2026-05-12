
"use client"

import * as React from "react"
import { QuizQuestion } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export function Quiz({ questions, onComplete }: QuizProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(null);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [isFinished, setIsFinished] = React.useState(false);

  const handleOptionClick = (index: number) => {
    if (showFeedback) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === questions[currentIndex].correctIndex;
    if (isCorrect) setScore(s => s + 1);
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
      onComplete(score);
    }
  };

  const currentQuestion = questions[currentIndex];

  if (isFinished) {
    return (
      <div className="text-center p-8 md:p-12 glass-card rounded-2xl md:rounded-3xl animate-fade-in border-secondary/30">
        <div className="mb-6 flex justify-center">
          <div className="bg-secondary/20 p-3 md:p-4 rounded-full violet-shadow">
            <Trophy className="w-8 h-8 md:w-12 md:h-12 text-secondary" />
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold mb-2">Modul gemeistert!</h3>
        <p className="text-muted-foreground text-base md:text-lg mb-8">
          Du hast {score} von {questions.length} Fragen richtig beantwortet.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.location.reload()} variant="outline" className="w-full sm:w-auto gap-2 rounded-full px-8">
            <RefreshCcw className="w-4 h-4" /> Quiz wiederholen
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 md:p-8 rounded-2xl md:rounded-3xl border-primary/20 animate-fade-in shadow-xl">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] md:text-sm font-bold text-primary uppercase tracking-widest">Wissenscheck</span>
        </div>
        <span className="text-[10px] md:text-sm font-medium text-muted-foreground">Frage {currentIndex + 1} von {questions.length}</span>
      </div>

      <h3 className="text-xl md:text-2xl font-bold mb-6 md:mb-8 leading-snug">{currentQuestion.question}</h3>

      <div className="space-y-3 md:space-y-4 mb-8 md:mb-10">
        {currentQuestion.options.map((option, idx) => {
          let optionStyles = "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20";
          
          if (showFeedback) {
            if (idx === currentQuestion.correctIndex) {
              optionStyles = "border-green-500/50 bg-green-500/10 text-green-400";
            } else if (idx === selectedOption) {
              optionStyles = "border-red-500/50 bg-red-500/10 text-red-400";
            } else {
              optionStyles = "opacity-50 grayscale";
            }
          } else if (selectedOption === idx) {
            optionStyles = "border-primary bg-primary/10 text-primary ring-2 ring-primary/20";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={showFeedback}
              className={cn(
                "w-full text-left p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all duration-300 flex items-center justify-between group",
                optionStyles
              )}
            >
              <span className="font-medium text-base md:text-lg">{option}</span>
              {showFeedback && idx === currentQuestion.correctIndex && <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />}
              {showFeedback && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle className="w-5 h-5 md:w-6 md:h-6" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mb-8 md:mb-10 p-5 md:p-6 bg-primary/5 border border-primary/10 rounded-xl md:rounded-2xl animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <p className="text-[10px] md:text-sm text-primary font-bold uppercase tracking-wider">Erklärung</p>
          </div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showFeedback ? (
          <Button 
            onClick={handleCheckAnswer} 
            disabled={selectedOption === null}
            className="w-full sm:w-auto neon-shadow px-12 h-12 rounded-full text-base md:text-lg"
          >
            Antwort prüfen
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full sm:w-auto gap-2 px-12 h-12 rounded-full text-base md:text-lg group">
            {currentIndex + 1 < questions.length ? "Nächste Frage" : "Lektion beenden"} 
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
}
