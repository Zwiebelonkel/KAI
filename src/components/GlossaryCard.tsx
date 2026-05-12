"use client"

import * as React from "react"
import { ChevronDown, BookOpen, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlossaryCardProps {
  term: string;
  definition: string;
  onOpen?: () => void;
  isRead?: boolean;
}

export function GlossaryCard({ term, definition, onOpen, isRead }: GlossaryCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState && onOpen) {
      onOpen();
    }
  };

  return (
    <div className="mb-4">
      <button
        onClick={handleToggle}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl glass-card transition-all duration-300 hover:border-primary/50",
          isOpen ? "rounded-b-none border-primary/50" : "",
          isRead && !isOpen ? "border-green-500/30" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <BookOpen className={cn("w-5 h-5", isRead ? "text-green-500" : "text-primary")} />
          <span className="font-semibold text-lg">{term}</span>
          {isRead && <CheckCircle2 className="w-4 h-4 text-green-500" />}
        </div>
        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 bg-muted/30 rounded-b-xl border-x border-b border-primary/10",
          isOpen ? "max-h-60 p-4 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
        )}
      >
        <p className="text-muted-foreground leading-relaxed">
          {definition}
        </p>
      </div>
    </div>
  );
}
