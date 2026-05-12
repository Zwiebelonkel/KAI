
import * as React from "react"
import { modules } from "@/lib/course-data"
import { ModuleClient } from "./ModuleClient"

export async function generateStaticParams() {
  return modules.map((module) => ({
    moduleId: module.id,
  }))
}

export default async function LearnPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  const module = modules.find(m => m.id === moduleId);
  
  if (!module) return <div className="min-h-screen flex items-center justify-center">Modul nicht gefunden</div>;

  return <ModuleClient module={module} />;
}
