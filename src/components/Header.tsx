
"use client"

import { BrainCircuit, UserCircle } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5 h-16">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-1.5 rounded-lg group-hover:rotate-12 transition-transform duration-300">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">KAI <span className="text-primary">:</span> KI Erklärt</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <UserCircle className="w-4 h-4" />
            <span>Mein Lernstand</span>
          </button>
        </div>
      </div>
    </header>
  );
}
