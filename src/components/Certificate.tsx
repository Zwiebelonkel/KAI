
"use client"

import * as React from "react"
import { BrainCircuit, Award, Star, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface CertificateProps {
  score: number;
  total: number;
  date: string;
}

export const Certificate = React.forwardRef<HTMLDivElement, CertificateProps>(({ score, total, date }, ref) => {
  const percent = Math.round((score / total) * 100);
  
  let title = "KI-Entdecker";
  let description = "Du hast die ersten Schritte in die faszinierende Welt der Künstlichen Intelligenz gewagt.";

  if (percent === 100) {
    title = "KI Singularitäts-Bezwinger";
    description = "Absolutes Expertenwissen! Du hast alle Herausforderungen mit Bravour gemeistert.";
  } else if (percent >= 80) {
    title = "KI-Experte";
    description = "Hervorragendes Verständnis für KI-Modelle und deren praktische Anwendung.";
  } else if (percent >= 60) {
    title = "KI-Fortgeschrittener";
    description = "Ein solides Fundament in den wichtigsten KI-Konzepten wurde erfolgreich nachgewiesen.";
  } else if (percent >= 40) {
    title = "KI-Grundlagen-Kenner";
    description = "Die Basiskonzepte der KI wurden verstanden und erfolgreich angewendet.";
  }

  return (
    <div 
      ref={ref}
      className="w-[800px] h-[600px] bg-white text-black p-12 flex flex-col items-center justify-between relative overflow-hidden border-[16px] border-slate-900"
      style={{ fontFamily: 'serif' }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-50" />
      
      {/* Border Decorations */}
      <div className="absolute top-4 left-4 right-4 bottom-4 border-2 border-slate-300 pointer-events-none" />
      
      <div className="flex flex-col items-center z-10">
        <div className="bg-slate-900 p-4 rounded-xl mb-6">
          <BrainCircuit className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-sm font-bold tracking-[0.3em] uppercase mb-4 text-slate-500">Zertifikat über den Abschluss</h1>
        <h2 className="text-5xl font-black mb-8 text-slate-900 text-center uppercase tracking-tighter">KAI : KI Erklärt</h2>
      </div>

      <div className="flex flex-col items-center z-10 max-w-2xl text-center">
        <p className="text-xl mb-4 italic text-slate-600">Hiermit wird bestätigt, dass der Teilnehmer den</p>
        <h3 className="text-4xl font-bold mb-6 text-slate-900">KI-Kompetenz Check</h3>
        <p className="text-lg mb-8 text-slate-700 leading-relaxed px-12">
          mit einem Ergebnis von <span className="font-bold text-slate-900">{percent}% ({score} von {total} Punkten)</span> erfolgreich absolviert hat.
        </p>
        
        <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-200 mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Award className="w-8 h-8 text-slate-900" />
            <h4 className="text-2xl font-black uppercase text-slate-900 tracking-tight">{title}</h4>
          </div>
          <p className="text-sm text-slate-500 max-w-md mx-auto">{description}</p>
        </div>
      </div>

      <div className="w-full flex justify-between items-end z-10">
        <div className="flex flex-col items-start">
          <div className="w-48 border-b-2 border-slate-900 mb-2" />
          <p className="text-sm font-bold text-slate-900">Datum: {date}</p>
          <p className="text-xs text-slate-400">KAI Lernplattform</p>
        </div>

        <div className="relative">
          <div className="w-32 h-32 rounded-full border-4 border-slate-200 flex items-center justify-center opacity-30">
            <ShieldCheck className="w-16 h-16 text-slate-200" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Star className="w-8 h-8 text-slate-300 fill-slate-300" />
          </div>
          <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold text-slate-300 uppercase tracking-widest">Offizielles Siegel</p>
        </div>
      </div>
    </div>
  )
});

Certificate.displayName = "Certificate";
