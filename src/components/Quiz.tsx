
"use client"

import * as React from "react"
import { QuizQuestion } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, ArrowRight, RefreshCcw } from "lucide-react"
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
      onComplete(score + (selectedOption === questions[currentIndex].correctIndex ? 1 : 0));
    }
  };

  const currentQuestion = questions[currentIndex];

  if (isFinished) {
    return (
      <div className="text-center p-8 glass-card rounded-2xl animate-fade-in">
        <div className="mb-4 flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-secondary" />
        </div>
        <h3 className="text-2xl font-bold mb-2">Quiz abgeschlossen!</h3>
        <p className="text-muted-foreground mb-6">
          Du hast {score} von {questions.length} Fragen richtig beantwortet.
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="gap-2">
          <RefreshCcw className="w-4 h-4" /> Noch einmal
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl border-primary/20 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <span className="text-sm font-medium text-primary uppercase tracking-wider">Mini-Quiz</span>
        <span className="text-sm text-muted-foreground">Frage {currentIndex + 1} von {questions.length}</span>
      </div>

      <h3 className="text-xl font-semibold mb-6 leading-tight">{currentQuestion.question}</h3>

      <div className="space-y-3 mb-8">
        {currentQuestion.options.map((option, idx) => {
          let optionStyles = "border-white/10 bg-white/5 hover:bg-white/10";
          
          if (showFeedback) {
            if (idx === currentQuestion.correctIndex) {
              optionStyles = "border-green-500/50 bg-green-500/10 text-green-400";
            } else if (idx === selectedOption) {
              optionStyles = "border-red-500/50 bg-red-500/10 text-red-400";
            } else {
              optionStyles = "opacity-50";
            }
          } else if (selectedOption === idx) {
            optionStyles = "border-primary bg-primary/10 text-primary-foreground";
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(idx)}
              disabled={showFeedback}
              className={cn(
                "w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between",
                optionStyles
              )}
            >
              <span>{option}</span>
              {showFeedback && idx === currentQuestion.correctIndex && <CheckCircle2 className="w-5 h-5" />}
              {showFeedback && idx === selectedOption && idx !== currentQuestion.correctIndex && <XCircle className="w-5 h-5" />}
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mb-8 p-4 bg-primary/5 border border-primary/10 rounded-xl animate-fade-in">
          <p className="text-sm text-primary font-semibold mb-1">Erklärung:</p>
          <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
        </div>
      )}

      <div className="flex justify-end">
        {!showFeedback ? (
          <Button 
            onClick={handleCheckAnswer} 
            disabled={selectedOption === null}
            className="neon-shadow px-8"
          >
            Überprüfen
          </Button>
        ) : (
          <Button onClick={handleNext} className="gap-2 px-8">
            {currentIndex + 1 < questions.length ? "Nächste Frage" : "Abschließen"} 
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
