
"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Copy, 
  Code, 
  Database, 
  Brain, 
  TrendingUp, 
  Grid, 
  Cpu, 
  BookOpen, 
  CheckCircle2 
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface GlossaryItem {
  term: string;
  definition: string;
}

interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function AdminPage() {
  const [moduleId, setModuleId] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [icon, setIcon] = React.useState("Sparkles")
  const [minLevel, setMinLevel] = React.useState("Einsteiger")
  const [content, setContent] = React.useState("")
  const [glossary, setGlossary] = React.useState<GlossaryItem[]>([{ term: "", definition: "" }])
  const [quiz, setQuiz] = React.useState<QuizItem[]>([
    { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" }
  ])

  const generateCode = () => {
    const escape = (str: string) => str.replace(/'/g, "\\'").replace(/\n/g, "\\n");
    
    const glossaryCode = glossary
      .filter(item => item.term || item.definition)
      .map(item => `      { term: '${escape(item.term)}', definition: '${escape(item.definition)}' }`)
      .join(",\n");

    const quizCode = quiz
      .filter(q => q.question)
      .map((q, idx) => `      {
        id: 'q${idx + 1}-${moduleId || "modul"}',
        question: '${escape(q.question)}',
        options: [
          '${escape(q.options[0] || "Antwort 1")}',
          '${escape(q.options[1] || "Antwort 2")}',
          '${escape(q.options[2] || "Antwort 3")}',
          '${escape(q.options[3] || "Antwort 4")}'
        ],
        correctIndex: ${q.correctIndex},
        explanation: '${escape(q.explanation)}'
      }`)
      .join(",\n");

    return `{
    id: '${moduleId || "neues-modul"}',
    title: '${title || "Neuer Titel"}',
    description: '${description || "Beschreibung..."}',
    icon: '${icon}',
    minLevel: '${minLevel}',
    content: '${content || "Inhalt..."}',
    glossary: [
${glossaryCode || "      { term: 'Begriff', definition: 'Definition' }"}
    ],
    quiz: [
${quizCode || "      { id: 'q1', question: 'Frage?', options: ['A','B','C','D'], correctIndex: 0, explanation: 'Erklärung' }"}
    ]
  },`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCode());
    toast({
      title: "Code kopiert!",
      description: "Du kannst den Block nun in src/lib/course-data.ts einfügen.",
    });
  };

  const addGlossaryItem = () => setGlossary([...glossary, { term: "", definition: "" }]);
  const removeGlossaryItem = (index: number) => setGlossary(glossary.filter((_, i) => i !== index));

  const addQuizItem = () => setQuiz([...quiz, { question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" }]);
  const removeQuizItem = (index: number) => setQuiz(quiz.filter((_, i) => i !== index));

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Header />
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter flex items-center justify-center gap-3">
            <Code className="text-primary w-10 h-10" /> KI Modul Builder
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Erstelle neue Lerninhalte für KAI und generiere den fertigen TypeScript-Code.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Form Side */}
          <div className="space-y-8">
            <Card className="p-6 md:p-8 glass-card border-primary/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Basis-Daten
              </h2>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="moduleId">Modul ID (eindeutig)</Label>
                  <Input 
                    id="moduleId" 
                    placeholder="z.B. machine-learning-deep-dive" 
                    value={moduleId} 
                    onChange={e => setModuleId(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input 
                    id="title" 
                    placeholder="Name des Moduls" 
                    value={title} 
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="desc">Kurzbeschreibung</Label>
                  <Input 
                    id="desc" 
                    placeholder="Worum geht es?" 
                    value={description} 
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Icon</Label>
                    <Select value={icon} onValueChange={setIcon}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle ein Icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Sparkles", "TrendingUp", "Grid", "Cpu", "Database", "Brain", "Bot", "BookOpen"].map(i => (
                          <SelectItem key={i} value={i}>{i}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Mindest-Level</Label>
                    <Select value={minLevel} onValueChange={setMinLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wähle ein Level" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Einsteiger", "Basics", "Fortgeschritten"].map(l => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Haupt-Lerninhalt (Einleitung)</Label>
                  <Textarea 
                    id="content" 
                    className="min-h-[120px]" 
                    placeholder="Der Text, der groß oben erscheint..." 
                    value={content} 
                    onChange={e => setContent(e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6 md:p-8 glass-card border-secondary/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-secondary" /> Glossar-Begriffe
              </h2>
              <div className="space-y-6">
                {glossary.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/10 relative group">
                    <button 
                      onClick={() => removeGlossaryItem(idx)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Begriff</Label>
                        <Input 
                          placeholder="z.B. Neuron" 
                          value={item.term} 
                          onChange={e => {
                            const next = [...glossary];
                            next[idx].term = e.target.value;
                            setGlossary(next);
                          }}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Definition</Label>
                        <Textarea 
                          placeholder="Kurze Erklärung..." 
                          value={item.definition} 
                          onChange={e => {
                            const next = [...glossary];
                            next[idx].definition = e.target.value;
                            setGlossary(next);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addGlossaryItem} className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" /> Begriff hinzufügen
                </Button>
              </div>
            </Card>

            <Card className="p-6 md:p-8 glass-card border-primary/20">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" /> Quiz-Fragen
              </h2>
              <div className="space-y-8">
                {quiz.map((q, qIdx) => (
                  <div key={qIdx} className="p-6 rounded-2xl bg-white/5 border border-white/10 relative group">
                    <button 
                      onClick={() => removeQuizItem(qIdx)}
                      className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label>Frage {qIdx + 1}</Label>
                        <Input 
                          placeholder="Deine Frage?" 
                          value={q.question} 
                          onChange={e => {
                            const next = [...quiz];
                            next[qIdx].question = e.target.value;
                            setQuiz(next);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="grid gap-1">
                            <Label className="text-[10px]">Option {oIdx + 1}</Label>
                            <Input 
                              placeholder={`Antwort ${oIdx + 1}`} 
                              value={opt} 
                              onChange={e => {
                                const next = [...quiz];
                                next[qIdx].options[oIdx] = e.target.value;
                                setQuiz(next);
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="grid gap-2">
                        <Label>Richtige Antwort (Index 0-3)</Label>
                        <Select 
                          value={q.correctIndex.toString()} 
                          onValueChange={val => {
                            const next = [...quiz];
                            next[qIdx].correctIndex = parseInt(val);
                            setQuiz(next);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Option 1</SelectItem>
                            <SelectItem value="1">Option 2</SelectItem>
                            <SelectItem value="2">Option 3</SelectItem>
                            <SelectItem value="3">Option 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>Erklärung für die Auflösung</Label>
                        <Textarea 
                          placeholder="Warum ist das korrekt?" 
                          value={q.explanation} 
                          onChange={e => {
                            const next = [...quiz];
                            next[qIdx].explanation = e.target.value;
                            setQuiz(next);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addQuizItem} className="w-full gap-2 border-dashed">
                  <Plus className="w-4 h-4" /> Frage hinzufügen
                </Button>
              </div>
            </Card>
          </div>

          {/* Output Side */}
          <div className="lg:sticky lg:top-24">
            <Card className="p-6 md:p-8 glass-card border-primary/40 bg-black/40">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Code className="w-5 h-5 text-primary" /> TypeScript Block
                </h2>
                <Button onClick={copyToClipboard} size="sm" className="gap-2 neon-shadow">
                  <Copy className="w-4 h-4" /> Code kopieren
                </Button>
              </div>
              <div className="relative">
                <pre className="p-4 bg-black/60 rounded-xl overflow-x-auto text-xs font-mono text-primary/90 min-h-[500px] leading-relaxed border border-white/5">
                  {generateCode()}
                </pre>
                <div className="absolute top-4 right-4 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 italic">
                Hinweis: Kopiere diesen Block und füge ihn in das Array in <code className="text-primary">src/lib/course-data.ts</code> ein.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
