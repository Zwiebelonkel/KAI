import type { LucideIcon } from "lucide-react"
import {
  Activity,
  BarChart3,
  Binary,
  BookOpen,
  Bot,
  Brain,
  BriefcaseBusiness,
  Bug,
  ChartNoAxesCombined,
  CheckCircle2,
  CircuitBoard,
  Cloud,
  Code2,
  Cpu,
  Database,
  FileCode2,
  Fingerprint,
  FlaskConical,
  Gauge,
  GitBranch,
  Globe,
  GraduationCap,
  Grid,
  KeyRound,
  Layers3,
  Lightbulb,
  LockKeyhole,
  MessageSquareText,
  Microscope,
  Network,
  Rocket,
  Route,
  Search,
  Server,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TerminalSquare,
  TrendingUp,
  Users,
  WandSparkles,
  Workflow,
  Zap,
} from "lucide-react"

export type ModuleIconOption = {
  name: string;
  label: string;
  Icon: LucideIcon;
};

export const moduleIconOptions: ModuleIconOption[] = [
  { name: "Sparkles", label: "Sparkles", Icon: Sparkles },
  { name: "WandSparkles", label: "Magic", Icon: WandSparkles },
  { name: "Brain", label: "KI & Lernen", Icon: Brain },
  { name: "Bot", label: "Bot", Icon: Bot },
  { name: "Cpu", label: "Prozessor", Icon: Cpu },
  { name: "CircuitBoard", label: "Schaltkreis", Icon: CircuitBoard },
  { name: "Binary", label: "Binary", Icon: Binary },
  { name: "Code2", label: "Code", Icon: Code2 },
  { name: "TerminalSquare", label: "Terminal", Icon: TerminalSquare },
  { name: "FileCode2", label: "Code-Datei", Icon: FileCode2 },
  { name: "Database", label: "Datenbank", Icon: Database },
  { name: "Server", label: "Server", Icon: Server },
  { name: "Cloud", label: "Cloud", Icon: Cloud },
  { name: "Network", label: "Netzwerk", Icon: Network },
  { name: "Workflow", label: "Workflow", Icon: Workflow },
  { name: "GitBranch", label: "Branching", Icon: GitBranch },
  { name: "Layers3", label: "Layer", Icon: Layers3 },
  { name: "Grid", label: "Grid", Icon: Grid },
  { name: "BookOpen", label: "Lerninhalt", Icon: BookOpen },
  { name: "GraduationCap", label: "Akademie", Icon: GraduationCap },
  { name: "Lightbulb", label: "Idee", Icon: Lightbulb },
  { name: "Microscope", label: "Analyse", Icon: Microscope },
  { name: "FlaskConical", label: "Experiment", Icon: FlaskConical },
  { name: "Search", label: "Recherche", Icon: Search },
  { name: "MessageSquareText", label: "Prompt", Icon: MessageSquareText },
  { name: "ShieldAlert", label: "Risiko", Icon: ShieldAlert },
  { name: "ShieldCheck", label: "Sicherheit", Icon: ShieldCheck },
  { name: "LockKeyhole", label: "Datenschutz", Icon: LockKeyhole },
  { name: "Fingerprint", label: "Identität", Icon: Fingerprint },
  { name: "KeyRound", label: "Zugriff", Icon: KeyRound },
  { name: "TrendingUp", label: "Trend", Icon: TrendingUp },
  { name: "BarChart3", label: "Statistik", Icon: BarChart3 },
  { name: "ChartNoAxesCombined", label: "Wachstum", Icon: ChartNoAxesCombined },
  { name: "Gauge", label: "Performance", Icon: Gauge },
  { name: "Activity", label: "Aktivität", Icon: Activity },
  { name: "Target", label: "Ziel", Icon: Target },
  { name: "Route", label: "Lernpfad", Icon: Route },
  { name: "Rocket", label: "Start", Icon: Rocket },
  { name: "Zap", label: "Power", Icon: Zap },
  { name: "BriefcaseBusiness", label: "Business", Icon: BriefcaseBusiness },
  { name: "Users", label: "Team", Icon: Users },
  { name: "Globe", label: "Global", Icon: Globe },
  { name: "Settings2", label: "Einstellungen", Icon: Settings2 },
  { name: "Bug", label: "Debugging", Icon: Bug },
  { name: "CheckCircle2", label: "Erfolg", Icon: CheckCircle2 },
];

export const moduleIconMap = moduleIconOptions.reduce<Record<string, LucideIcon>>((icons, option) => {
  icons[option.name] = option.Icon;
  return icons;
}, {});

export function getModuleIcon(name: string): LucideIcon {
  return moduleIconMap[name] || Sparkles;
}

export function getModuleIconOption(name: string): ModuleIconOption {
  return moduleIconOptions.find((option) => option.name === name) || moduleIconOptions[0];
}
