"use client"

import * as React from "react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { DifficultyLevel, LessonImage, QuizQuestion } from "@/lib/types"
import { AdminLearningModule, AdminModuleCompletionPoint, AdminModuleInput, kaiApi } from "@/lib/api-service"
import { getModuleIcon, getModuleIconOption, moduleIconOptions } from "@/lib/module-icons"
import { toast } from "@/hooks/use-toast"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { AlertCircle, BarChart3, Database, Eye, EyeOff, ImageIcon, Loader2, LockKeyhole, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react"

const ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "1234";
const ADMIN_PIN_SESSION_KEY = "kai_admin_pin_unlocked";

const EMPTY_MODULE: AdminModuleInput = {
  id: "",
  title: "",
  description: "",
  icon: "Sparkles",
  content: "",
  minLevel: "Einsteiger",
  glossary: [{ term: "", definition: "" }],
  lessonImages: [],
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
    lessonImages: module.lessonImages || [],
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
    lessonImages: (module.lessonImages || [])
      .filter((image) => image.imageUrl.trim())
      .map((image, index) => ({
        ...image,
        id: image.id.trim() || `bild-${index + 1}-${module.id.trim() || "modul"}`,
        imageUrl: image.imageUrl.trim(),
        alt: image.alt.trim() || `Bild ${index + 1} zu ${module.title.trim() || "dieser Lektion"}`,
      })),
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

function isModuleFormIncomplete(module: AdminModuleInput): boolean {
  const hasEmptyBaseField = [module.id, module.title, module.description, module.icon, module.content, module.minLevel].some(
    (value) => !value.trim()
  );

  if (hasEmptyBaseField || module.glossary.length === 0 || module.quiz.length === 0) return true;

  const hasEmptyGlossaryField = module.glossary.some((item) => !item.term.trim() || !item.definition.trim());
  const hasIncompleteLessonImage = (module.lessonImages || []).some((image) => !image.imageUrl.trim() || !image.alt.trim() || !image.placement);
  const hasEmptyQuizField = module.quiz.some(
    (question) =>
      !question.id.trim() ||
      !question.question.trim() ||
      question.options.length !== 4 ||
      question.options.some((option) => !option.trim()) ||
      !question.explanation.trim()
  );

  return hasEmptyGlossaryField || hasIncompleteLessonImage || hasEmptyQuizField;
}

export default function AdminPage() {
  const [modules, setModules] = React.useState<AdminLearningModule[]>([]);
  const [form, setForm] = React.useState<AdminModuleInput>(EMPTY_MODULE);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [pin, setPin] = React.useState("");
  const [pinError, setPinError] = React.useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [openStatsModuleId, setOpenStatsModuleId] = React.useState<string | null>(null);
  const [completionStats, setCompletionStats] = React.useState<Record<string, AdminModuleCompletionPoint[]>>({});
  const [loadingStatsModuleId, setLoadingStatsModuleId] = React.useState<string | null>(null);

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
    setIsUnlocked(sessionStorage.getItem(ADMIN_PIN_SESSION_KEY) === "true");
  }, []);

  React.useEffect(() => {
    if (isUnlocked) loadModules();
  }, [isUnlocked, loadModules]);

  const submitPin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (pin !== ADMIN_PIN) {
      setPinError("Der PIN ist nicht korrekt.");
      setPin("");
      return;
    }

    sessionStorage.setItem(ADMIN_PIN_SESSION_KEY, "true");
    setPinError(null);
    setIsUnlocked(true);
  };

  const updateForm = <K extends keyof AdminModuleInput>(key: K, value: AdminModuleInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const startCreate = () => {
    setEditingId(null);
    setForm({ ...EMPTY_MODULE, glossary: [...EMPTY_MODULE.glossary], lessonImages: [], quiz: EMPTY_MODULE.quiz.map((q) => ({ ...q, options: [...q.options] })) });
  };

  const startEdit = (module: AdminLearningModule) => {
    setEditingId(module.id);
    setForm(toAdminInput(module));
  };

  const saveModule = async () => {
    if (isModuleFormIncomplete(form)) {
      setError("Bitte fülle alle Felder aus, bevor du das Modul speicherst.");
      return;
    }

    const payload = sanitizeModule(form);

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

  const toggleCompletionStats = async (moduleId: string) => {
    const shouldOpen = openStatsModuleId !== moduleId;
    setOpenStatsModuleId(shouldOpen ? moduleId : null);

    if (!shouldOpen || completionStats[moduleId]) return;

    setLoadingStatsModuleId(moduleId);
    setError(null);
    try {
      const stats = await kaiApi.getAdminModuleCompletions(moduleId);
      setCompletionStats((current) => ({ ...current, [moduleId]: stats }));
    } catch (statsError) {
      setError(statsError instanceof Error ? statsError.message : "Abschlussdaten konnten nicht geladen werden.");
    } finally {
      setLoadingStatsModuleId(null);
    }
  };

  const updateGlossary = (index: number, key: "term" | "definition", value: string) => {
    const next = form.glossary.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    updateForm("glossary", next);
  };

  const updateLessonImage = (index: number, image: LessonImage) => {
    updateForm("lessonImages", (form.lessonImages || []).map((item, i) => (i === index ? image : item)));
  };

  const addLessonImage = () => {
    const nextIndex = (form.lessonImages || []).length + 1;
    updateForm("lessonImages", [
      ...(form.lessonImages || []),
      {
        id: `bild-${nextIndex}-${form.id || "modul"}`,
        imageUrl: "",
        alt: "",
        placement: "after-content",
      },
    ]);
  };

  const updateQuiz = (index: number, question: QuizQuestion) => {
    updateForm("quiz", form.quiz.map((item, i) => (i === index ? question : item)));
  };

  const SelectedIcon = getModuleIcon(form.icon);
  const selectedIconLabel = getModuleIconOption(form.icon).label;
  const isSaveDisabled = isSaving || isModuleFormIncomplete(form);
  if (!isUnlocked) {
    return (
      <div className="min-h-screen pt-24 pb-20 overflow-hidden">
        <div className="mesh-bg" />
        <Header />
        <main className="container mx-auto px-4 max-w-xl">
          <Card className="glass-card border-primary/20 p-6 md:p-10 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary neon-shadow">
                <LockKeyhole className="h-8 w-8" />
              </div>
              <div className="mb-8 text-center">
                <div className="text-primary text-xs font-black uppercase tracking-[0.25em] mb-3">Admin gesperrt</div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-3">PIN eingeben</h1>
                <p className="text-sm text-muted-foreground">
                  Bitte gib den vierstelligen Admin-PIN ein, bevor Module geladen oder bearbeitet werden.
                </p>
              </div>

              <form onSubmit={submitPin} className="space-y-5">
                <div className="grid gap-2">
                  <Label htmlFor="adminPin">Vierstelliger PIN</Label>
                  <Input
                    id="adminPin"
                    value={pin}
                    onChange={(event) => {
                      setPin(event.target.value.replace(/\D/g, "").slice(0, 4));
                      setPinError(null);
                    }}
                    inputMode="numeric"
                    pattern="[0-9]{4}"
                    maxLength={4}
                    autoComplete="one-time-code"
                    placeholder="••••"
                    className="h-14 text-center text-2xl font-black tracking-[0.6em]"
                    aria-invalid={Boolean(pinError)}
                    aria-describedby={pinError ? "adminPinError" : undefined}
                    autoFocus
                  />
                  {pinError && <p id="adminPinError" className="text-sm text-red-300">{pinError}</p>}
                </div>

                <Button type="submit" disabled={pin.length !== 4} className="w-full h-12 rounded-full neon-shadow font-bold">
                  Admin entsperren
                </Button>
              </form>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                Der PIN kann über <code className="rounded bg-white/10 px-1.5 py-0.5">NEXT_PUBLIC_ADMIN_PIN</code> gesetzt werden.
              </p>
            </div>
          </Card>
        </main>
      </div>
    );
  }

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
                {modules.map((module) => {
                  const ModuleIcon = getModuleIcon(module.icon);

                  return (
                    <div key={module.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="rounded-xl bg-primary/10 p-2 text-primary shrink-0">
                            <ModuleIcon className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold">{module.title}</div>
                            <div className="text-[11px] text-muted-foreground mt-1">{module.id}</div>
                            <div className="mt-2 text-[10px] font-black uppercase tracking-wider text-primary">
                              {module.isPublished ?? true ? "Sichtbar" : "Versteckt"} · {module.minLevel} · {module.icon}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button variant="ghost" size="icon" onClick={() => toggleCompletionStats(module.id)} aria-label="Abschlussverlauf anzeigen"><BarChart3 className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => startEdit(module)} aria-label="Bearbeiten"><Pencil className="w-4 h-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => toggleVisibility(module)} aria-label="Sichtbarkeit ändern">
                            {module.isPublished ?? true ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteModule(module.id)} aria-label="Löschen"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                        </div>
                      </div>
                      {openStatsModuleId === module.id && (
                        <div className="mt-4 rounded-2xl border border-primary/20 bg-background/40 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-sm font-black">Tagesverlauf Abschlüsse</div>
                              <div className="text-[11px] text-muted-foreground">Wird erst beim Öffnen geladen.</div>
                            </div>
                            {loadingStatsModuleId === module.id && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
                          </div>
                          {(completionStats[module.id]?.length ?? 0) > 0 ? (
                            <div className="h-48">
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={completionStats[module.id]} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                                  <defs>
                                    <linearGradient id={`completionGradient-${module.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                                  <XAxis dataKey="day" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                                  <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "12px" }} labelFormatter={(label) => `Tag: ${label}`} formatter={(value) => [value, "Abschlüsse"]} />
                                  <Area type="monotone" dataKey="completions" stroke="hsl(var(--primary))" fill={`url(#completionGradient-${module.id})`} strokeWidth={2} />
                                </AreaChart>
                              </ResponsiveContainer>
                            </div>
                          ) : (
                            loadingStatsModuleId !== module.id && <p className="py-8 text-center text-xs text-muted-foreground">Noch keine Abschlüsse für dieses Modul.</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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
              <Button onClick={saveModule} disabled={isSaveDisabled} className="gap-2 rounded-full neon-shadow">
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
                    <SelectTrigger className="h-12">
                      <span className="flex items-center gap-2">
                        <span className="rounded-lg bg-primary/10 p-1.5 text-primary">
                          <SelectedIcon className="w-4 h-4" />
                        </span>
                        <span>{form.icon}</span>
                      </span>
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {moduleIconOptions.map(({ name, label, Icon }) => (
                        <SelectItem key={name} value={name}>
                          <span className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-primary" />
                            <span>{name}</span>
                            <span className="text-xs text-muted-foreground">{label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-muted-foreground">
                    <SelectedIcon className="w-6 h-6 text-primary" />
                    <span>Vorschau: <strong className="text-foreground">{selectedIconLabel}</strong></span>
                  </div>
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
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-lg flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> Bilder in der Lektion</h3>
                    <p className="text-xs text-muted-foreground">Füge Bild-URLs ein und wähle, an welcher Stelle der Lektion sie erscheinen.</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={addLessonImage} className="gap-2"><Plus className="w-4 h-4" /> Bild</Button>
                </div>
                {(form.lessonImages || []).map((image, index) => (
                  <div key={image.id || index} className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="grid md:grid-cols-[1fr_220px_auto] gap-3">
                      <Input value={image.imageUrl} onChange={(e) => updateLessonImage(index, { ...image, imageUrl: e.target.value })} placeholder="https://.../bild.jpg" />
                      <Select value={image.placement} onValueChange={(value: LessonImage["placement"]) => updateLessonImage(index, { ...image, placement: value })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="after-description">Nach der Beschreibung</SelectItem>
                          <SelectItem value="after-content">Nach dem Lerninhalt</SelectItem>
                          <SelectItem value="before-glossary">Vor dem Glossar</SelectItem>
                          <SelectItem value="before-quiz">Vor dem Quiz</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => updateForm("lessonImages", (form.lessonImages || []).filter((_, i) => i !== index))} aria-label="Bild löschen"><Trash2 className="w-4 h-4 text-red-400" /></Button>
                    </div>
                    <Input value={image.alt} onChange={(e) => updateLessonImage(index, { ...image, alt: e.target.value })} placeholder="Alternativtext / Bildbeschreibung" />
                    {image.imageUrl && (
                      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={image.imageUrl} alt={image.alt || "Bildvorschau"} className="max-h-48 w-full object-cover" />
                      </div>
                    )}
                  </div>
                ))}
                {!(form.lessonImages || []).length && (
                  <p className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-4 text-sm text-muted-foreground">
                    Noch keine zusätzlichen Bilder. Die Lektion funktioniert weiterhin ohne Bildblöcke.
                  </p>
                )}
              </section>

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
