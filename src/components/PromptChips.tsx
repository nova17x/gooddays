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
  onSelect: (promptText: string) => void;
  onFreeWrite?: () => void;
}

export default function PromptChips({ onSelect, onFreeWrite }: PromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {onFreeWrite && (
        <button
          onClick={onFreeWrite}
          className="text-xs px-4 py-1.5 rounded-full border-2 border-warm-400 text-warm-600 font-medium hover:bg-warm-400 hover:text-white transition-colors cursor-pointer"
        >
          ✏️ 自由に書く
        </button>
      )}
      {PROMPTS.map((prompt, i) => (
        <button
          key={prompt.short}
          onClick={() => onSelect(prompt.full.trim())}
          className={`text-xs px-3 py-1.5 rounded-full text-text-muted transition-colors cursor-pointer ${chipColors[i % chipColors.length]}`}
        >
          {prompt.short}
        </button>
      ))}
    </div>
  );
}
