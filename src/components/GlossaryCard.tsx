
"use client"

import * as React from "react"
import { ChevronDown, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

interface GlossaryCardProps {
  term: string;
  definition: string;
}

export function GlossaryCard({ term, definition }: GlossaryCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-xl glass-card transition-all duration-300 hover:border-primary/50",
          isOpen ? "rounded-b-none border-primary/50" : ""
        )}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-semibold text-lg">{term}</span>
        </div>
        <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 bg-muted/30 rounded-b-xl border-x border-b border-primary/10",
          isOpen ? "max-h-40 p-4 opacity-100" : "max-h-0 p-0 opacity-0 pointer-events-none"
        )}
      >
        <p className="text-muted-foreground leading-relaxed">
          {definition}
        </p>
      </div>
    </div>
  );
}
