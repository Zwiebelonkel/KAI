"use client"

import * as React from "react"
import { BrainCircuit, LogIn, UserPlus, Loader2, AlertCircle, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { kaiApi, AuthUser } from "@/lib/api-service"
import { cn } from "@/lib/utils"

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser) => void;
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [displayName, setDisplayName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const isRegister = mode === "register";

  const handleGuestLogin = () => {
    setError(null);
    onAuthenticated(kaiApi.startGuestSession());
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const auth = isRegister
        ? await kaiApi.register(email, password, displayName.trim() || undefined)
        : await kaiApi.login(email, password);
      onAuthenticated(auth.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anmeldung fehlgeschlagen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      <div className="mesh-bg" />
      <div className="w-full max-w-md glass-card rounded-[2rem] border-white/10 p-6 md:p-8 relative overflow-hidden animate-fade-in">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="bg-primary p-3 rounded-2xl neon-shadow mb-4">
              <BrainCircuit className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter mb-2">Willkommen bei KAI</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Melde dich an, damit dein Lernstand sicher in der Datenbank gespeichert wird – oder starte als Gast nur für diese Session.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 rounded-full bg-white/5 border border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={cn("rounded-full py-2 text-sm font-bold transition-colors", !isRegister ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode("register")}
              className={cn("rounded-full py-2 text-sm font-bold transition-colors", isRegister ? "bg-primary text-white" : "text-muted-foreground hover:text-white")}
            >
              Registrieren
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="grid gap-2">
                <Label htmlFor="displayName">Name (optional)</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Dein Name" autoComplete="name" />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="du@example.com" autoComplete="email" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Passwort</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={isRegister ? "Mindestens 8 Zeichen" : "Dein Passwort"} autoComplete={isRegister ? "new-password" : "current-password"} minLength={isRegister ? 8 : undefined} required />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" disabled={isSubmitting} className="w-full h-14 rounded-full font-bold neon-shadow gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : isRegister ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
              {isSubmitting ? "Bitte warten..." : isRegister ? "Account erstellen" : "Einloggen"}
            </Button>
          </form>

          <div className="mt-6 border-t border-white/10 pt-6">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleGuestLogin}
              className="w-full h-14 rounded-full font-bold gap-2 border-white/10"
            >
              <UserRound className="w-5 h-5" />
              Als Gast starten
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Dein Gast-Fortschritt bleibt nur lokal in diesem Browser-Tab. Nach einer neuen Session beginnst du wieder von vorn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
