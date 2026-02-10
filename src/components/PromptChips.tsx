"use client";

import { PROMPTS } from "@/lib/constants";

const chipColors = [
  "bg-warm-100 hover:bg-warm-200",
  "bg-accent-light hover:bg-accent",
  "bg-orange-50 hover:bg-orange-100",
  "bg-amber-50 hover:bg-amber-100",
  "bg-yellow-50 hover:bg-yellow-100",
  "bg-warm-100 hover:bg-warm-200",
  "bg-accent-light hover:bg-accent",
];

interface PromptChipsProps {
  onSelect: (text: string) => void;
}

export default function PromptChips({ onSelect }: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      {PROMPTS.map((prompt, i) => (
        <button
          key={prompt.short}
          onClick={() => onSelect(prompt.full)}
          className={`text-xs px-3 py-1.5 rounded-full text-text-muted transition-colors cursor-pointer ${chipColors[i % chipColors.length]}`}
        >
          {prompt.short}
        </button>
      ))}
    </div>
  );
}
