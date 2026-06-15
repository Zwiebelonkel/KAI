"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { ModuleClient } from "./[moduleId]/ModuleClient"
import { modules as fallbackModules } from "@/lib/course-data"
import { kaiApi } from "@/lib/api-service"
import { LearningModule } from "@/lib/types"
import Link from "next/link"

function LearnModuleContent() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  const [module, setModule] = React.useState<LearningModule | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;

    async function loadModule() {
      setIsLoading(true);
      setError(null);

      if (!moduleId) {
        setError('Kein Modul ausgewählt.');
        setIsLoading(false);
        return;
      }

      const localModule = fallbackModules.find((item) => item.id === moduleId);
      if (localModule) {
        setModule(localModule);
        setIsLoading(false);
        return;
      }

      try {
        const remoteModule = await kaiApi.getModule(moduleId);
        if (isMounted) setModule(remoteModule);
      } catch (loadError) {
        console.warn('KAI module load failed:', loadError);
        if (isMounted) setError('Dieses Modul konnte nicht geladen werden.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadModule();
    return () => {
      isMounted = false;
    };
  }, [moduleId]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Lektion wird geladen...</div>;
  }

  if (!module || error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <h1 className="text-3xl font-black">Modul nicht gefunden</h1>
        <p className="text-muted-foreground">{error || 'Bitte wähle ein Modul aus deinem Lernpfad.'}</p>
        <Link href="/" className="text-primary font-bold underline underline-offset-4">Zurück zum Lernpfad</Link>
      </div>
    );
  }

  return <ModuleClient module={module} />;
}

export default function LearnModulePage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted-foreground">Lektion wird geladen...</div>}>
      <LearnModuleContent />
    </React.Suspense>
  );
}
