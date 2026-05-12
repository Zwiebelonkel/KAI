
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number;
  className?: string;
}

export function ProgressBar({ value, className }: ProgressBarProps) {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setWidth(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <div className={cn("w-full bg-muted rounded-full h-2.5 overflow-hidden", className)}>
      <div 
        className="bg-secondary h-full transition-all duration-700 ease-out rounded-full violet-shadow"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
