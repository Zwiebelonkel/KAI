"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { DifficultyLevel, LearningModule, QuizQuestion } from "@/lib/types"
import { AdminLearningModule, AdminModuleInput, kaiApi } from "@/lib/api-service"
import { toast } from "@/hooks/use-toast"
import { AlertCircle, Database, Eye, EyeOff, Loader2, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react"

const EMPTY_MODULE: AdminModuleInput = {
  id: "",
  title: "",
  description: "",
  icon: "Sparkles",
  content: "",
  minLevel: "Einsteiger",
  glossary: [{ term: "", definition: "" }],
  quiz: [
    {
      id: "q1-neues-modul",
      question: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      explanation: "",
    },
  ],
  isPublished: true,
};

function toAdminInput(module: AdminLearningModule): AdminModuleInput {
  return {
    id: module.id,
    title: module.title,
    description: module.description,
    icon: module.icon,
    content: module.content,
    minLevel: module.minLevel,
    glossary: module.glossary.length ? module.glossary : [{ term: "", definition: "" }],
    quiz: module.quiz.length ? module.quiz : EMPTY_MODULE.quiz,
    isPublished: module.isPublished ?? true,
  };
}

function sanitizeModule(module: AdminModuleInput): AdminModuleInput {
  return {
    ...module,
    id: module.id.trim(),
    title: module.title.trim(),
    description: module.description.trim(),
    content: module.content.trim(),
    glossary: module.glossary.filter((item) => item.term.trim() || item.definition.trim()),
    quiz: module.quiz
      .filter((question) => question.question.trim())
      .map((question, index) => ({
        ...question,
        id: question.id.trim() || `q${index + 1}-${module.id.trim() || "modul"}`,
        options: question.options.map((option) => option.trim()),
      })),
  };
}

export default function AdminPage() {
  const [modules, setModules] = React.useState<AdminLearningModule[]>([]);
  const [form, setForm] = React.useState<AdminModuleInput>(EMPTY_MODULE);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const loadModules = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setModules(await kaiApi.listAdminModules());
    } catch (adminError) {
      try {
        const publishedModules = await kaiApi.listModules();
        setModules(publishedModules.map((module) => ({ ...module, isPublished: true })));
        setError("Der Admin-Endpunkt /admin/modules ist noch nicht verfügbar. Angezeigt werden deshalb nur öffentlich sichtbare Module.");
      } catch (moduleError) {
        setError(moduleError instanceof Error ? moduleError.message : "Module konnten nicht geladen werden.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadModules();
  }, [loadModules]);

  const updateForm = <K extends keyof AdminModuleInput>(key: K, value: AdminModuleInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_MODULE, glossary: [...EMPTY_MODULE.glossary], quiz: EMPTY_MODULE.quiz.map((q) => ({ ...q, options: [...q.options] })) });
  };

  const startEdit = (module: AdminLearningModule) => {
    setEditingId(module.id);
    setForm(toAdminInput(module));
  };

  const saveModule = async () => {
    const payload = sanitizeModule(form);
    if (!payload.id || !payload.title || !payload.description || !payload.content) {
      setError("Bitte fülle ID, Titel, Beschreibung und Inhalt aus.");
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      if (editingId) {
        await kaiApi.updateAdminModule(editingId, payload);
      } else {
        await kaiApi.createAdminModule(payload);
      }
      toast({ title: "Modul gespeichert", description: `${payload.title} wurde in der Datenbank aktualisiert.` });
      await loadModules();
      setEditingId(payload.id);
      setForm(payload);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Modul konnte nicht gespeichert werden.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!window.confirm("Dieses Modul wirklich dauerhaft löschen?")) return;
    setError(null);
    try {
      await kaiApi.deleteAdminModule(moduleId);
      toast({ title: "Modul gelöscht", description: "Das Modul wurde aus der Datenbank entfernt." });
      await loadModules();
      if (editingId === moduleId) startCreate();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Modul konnte nicht gelöscht werden.");
    }
  };

  const toggleVisibility = async (module: AdminLearningModule) => {
    const next = { ...toAdminInput(module), isPublished: !(module.isPublished ?? true) };
    setError(null);
    try {
      await kaiApi.updateAdminModule(module.id, next);
      await loadModules();
    } catch (visibilityError) {
      setError(visibilityError instanceof Error ? visibilityError.message : "Sichtbarkeit konnte nicht geändert werden.");
    }
  };

  const updateGlossary = (index: number, key: "term" | "definition", value: string) => {
    const next = form.glossary.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    updateForm("glossary", next);
  };

  const updateQuiz = (index: number, question: QuizQuestion) => {
    updateForm("quiz", form.quiz.map((item, i) => (i === index ? question : item)));
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <Header />
      <main className="container mx-auto px-4 max-w-7xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-3">Admin</div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">Module verwalten</h1>
            <p className="text-muted-foreground max-w-2xl">
              Erstelle, bearbeite, lösche und veröffentliche Lernmodule direkt über den KAI-Webservice.
            </p>
          </div>
          <Button onClick={loadModules} variant="outline" className="gap-2 rounded-full border-white/10">
            <RefreshCw className="w-4 h-4" /> Neu laden
          </Button>
        </div>

        {error && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid lg:grid-cols-[0.9fr_1.4fr] gap-8 items-start">
          <Card className="glass-card border-white/10 p-5 md:p-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-xl font-bold flex items-center gap-2"><Database className="w-5 h-5 text-primary" /> Aktive Module</h2>
              <Button onClick={startCreate} size="sm" className="gap-2 rounded-full"><Plus className="w-4 h-4" /> Neu</Button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" /> Module werden geladen...</div>
            ) : (
              <div className="space-y-3">
                {modules.map((module) => (
                  <div key={module.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold">{module.title}</div>
                        <div className="text-[11px] text-muted-foreground mt-1">{module.id}</div>
                        <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary">
                          {module.isPublished ?? true ? "Sichtbar" : "Versteckt"} · {module.minLevel}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(module)} aria-label="Bearbeiten"><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => toggleVisibility(module)} aria-label="Sichtbarkeit ändern">
                          {module.isPublished ?? true ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteModule(module.id)} aria-label="Löschen"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                      </div>
                    </div>
                  </div>
                ))}
                {!modules.length && <p className="py-8 text-center text-sm text-muted-foreground">Noch keine Module gefunden.</p>}
              </div>
            )}
          </Card>

          <Card className="glass-card border-primary/20 p-5 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight">{editingId ? "Modul bearbeiten" : "Neues Modul"}</h2>
                <p className="text-sm text-muted-foreground">Änderungen werden über den Admin-Endpunkt in der Datenbank gespeichert.</p>
              </div>
              <Button onClick={saveModule} disabled={isSaving} className="gap-2 rounded-full neon-shadow">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Speichern
              </Button>
            </div>

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="moduleId">Modul-ID</Label>
                  <Input id="moduleId" value={form.id} onChange={(e) => updateForm("id", e.target.value)} placeholder="z.B. prompt-engineering" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Titel</Label>
                  <Input id="title" value={form.title} onChange={(e) => updateForm("title", e.target.value)} placeholder="Name des Moduls" />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Kurzbeschreibung</Label>
                <Input id="description" value={form.description} onChange={(e) => updateForm("description", e.target.value)} placeholder="Worum geht es?" />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Icon</Label>
                  <Select value={form.icon} onValueChange={(value) => updateForm("icon", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Sparkles", "TrendingUp", "Grid", "Cpu", "Database", "Brain", "Bot", "BookOpen"].map((icon) => <SelectItem key={icon} value={icon}>{icon}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Mindest-Level</Label>
                  <Select value={form.minLevel} onValueChange={(value: DifficultyLevel) => updateForm("minLevel", value)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Einsteiger", "Basics", "Fortgeschritten"].map((level) => <SelectItem key={level} value={level}>{level}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 mt-6 cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => updateForm("isPublished", e.target.checked)} className="h-4 w-4 accent-primary" />
                  <span className="text-sm font-bold">Sichtbar veröffentlichen</span>
                </label>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Lerninhalt</Label>
                <Textarea id="content" value={form.content} onChange={(e) => updateForm("content", e.target.value)} className="min-h-[140px]" placeholder="Der Haupttext des Moduls..." />
              </div>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg">Glossar</h3>
                  <Button variant="outline" size="sm" onClick={() => updateForm("glossary", [...form.glossary, { term: "", definition: "" }])} className="gap-2"><Plus className="w-4 h-4" /> Begriff</Button>
                </div>
                {form.glossary.map((item, index) => (
                  <div key={index} className="grid md:grid-cols-[0.8fr_1fr_auto] gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Input value={item.term} onChange={(e) => updateGlossary(index, "term", e.target.value)} placeholder="Begriff" />
                    <Textarea value={item.definition} onChange={(e) => updateGlossary(index, "definition", e.target.value)} placeholder="Definition" />
                    <Button variant="ghost" size="icon" onClick={() => updateForm("glossary", form.glossary.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                  </div>
                ))}
              </section>

              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-lg">Quiz</h3>
                  <Button variant="outline" size="sm" onClick={() => updateForm("quiz", [...form.quiz, { id: `q${form.quiz.length + 1}-${form.id || "modul"}`, question: "", options: ["", "", "", ""], correctIndex: 0, explanation: "" }])} className="gap-2"><Plus className="w-4 h-4" /> Frage</Button>
                </div>
                {form.quiz.map((question, index) => (
                  <div key={index} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex justify-between gap-3">
                      <Input value={question.question} onChange={(e) => updateQuiz(index, { ...question, question: e.target.value })} placeholder={`Frage ${index + 1}`} />
                      <Button variant="ghost" size="icon" onClick={() => updateForm("quiz", form.quiz.filter((_, i) => i !== index))}><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      {question.options.map((option, optionIndex) => (
                        <Input key={optionIndex} value={option} onChange={(e) => updateQuiz(index, { ...question, options: question.options.map((item, i) => i === optionIndex ? e.target.value : item) })} placeholder={`Antwort ${optionIndex + 1}`} />
                      ))}
                    </div>
                    <div className="grid md:grid-cols-[220px_1fr] gap-3">
                      <Select value={String(question.correctIndex)} onValueChange={(value) => updateQuiz(index, { ...question, correctIndex: Number(value) })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Antwort 1 ist korrekt</SelectItem>
                          <SelectItem value="1">Antwort 2 ist korrekt</SelectItem>
                          <SelectItem value="2">Antwort 3 ist korrekt</SelectItem>
                          <SelectItem value="3">Antwort 4 ist korrekt</SelectItem>
                        </SelectContent>
                      </Select>
                      <Textarea value={question.explanation} onChange={(e) => updateQuiz(index, { ...question, explanation: e.target.value })} placeholder="Erklärung" />
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
