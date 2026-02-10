"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import PromptChips from "./PromptChips";
import { PLACEHOLDER_MESSAGES } from "@/lib/constants";

interface DiaryEditorProps {
  date: string;
  initialBody?: string;
  onSave: (body: string) => void;
}

export default function DiaryEditor({
  date,
  initialBody = "",
  onSave,
}: DiaryEditorProps) {
  const [body, setBody] = useState(initialBody);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const placeholder = useMemo(() => {
    const index = Math.abs(date.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % PLACEHOLDER_MESSAGES.length;
    return PLACEHOLDER_MESSAGES[index];
  }, [date]);

  // Auto-save with debounce
  useEffect(() => {
    if (body === initialBody) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onSave(body);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [body, initialBody, onSave]);

  const handlePromptSelect = useCallback((text: string) => {
    setBody((prev) => (prev ? prev + "\n" + text : text));
    textareaRef.current?.focus();
  }, []);

  const handleManualSave = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave(body);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <PromptChips onSelect={handlePromptSelect} />
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[200px] p-4 rounded-xl border border-warm-200 bg-white/80 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent resize-y leading-relaxed transition-shadow"
      />
      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs transition-opacity ${
            saved ? "opacity-100 text-warm-500" : "opacity-0"
          }`}
        >
          保存しました
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-light">{body.length}文字</span>
          <button
            onClick={handleManualSave}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-warm-400 to-warm-500 text-white text-sm font-medium hover:from-warm-500 hover:to-warm-600 transition-all cursor-pointer"
          >
            保存する
          </button>
        </div>
      </div>
    </div>
  );
}
