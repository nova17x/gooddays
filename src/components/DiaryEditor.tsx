"use client";

import { useState, useEffect, useRef } from "react";
import { PLACEHOLDER_MESSAGES } from "@/lib/constants";
import ConfirmDialog from "@/components/ConfirmDialog";
import confetti from "canvas-confetti";

const MOODS = ["😊", "😐", "😢", "😡", "😌", "🤔", "😴", "🤩"];

interface DiaryEditorProps {
  prompt: string;
  initialBody?: string;
  initialMood?: string;
  onSave: (body: string, mood?: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  autoSave?: boolean;
}

export default function DiaryEditor({
  prompt,
  initialBody = "",
  initialMood,
  onSave,
  onCancel,
  onDelete,
  autoSave = false,
}: DiaryEditorProps) {
  const [body, setBody] = useState(initialBody);
  const [mood, setMood] = useState<string | undefined>(initialMood);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  const isFirstRender = useRef(true);

  const placeholder =
    PLACEHOLDER_MESSAGES[
    Math.abs(
      prompt
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0)
    ) % PLACEHOLDER_MESSAGES.length
    ];

  // Auto-grow textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [body]);

  // Auto-save with debounce (only for existing entries)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!autoSave) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      onSave(body, mood);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [body, mood, onSave, autoSave]);

  // Focus textarea on mount
  useEffect(() => {
    // Only focus if creating a new entry or explicitly editing?
    // Current behavior: always focus.
    textareaRef.current?.focus();
  }, []);

  const handleManualSave = () => {
    if (body.trim() === "") return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave(body, mood);
    setSaved(true);

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD166', '#06D6A0', '#118AB2', '#EF476F'],
      disableForReducedMotion: true
    });

    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-bg-card border border-warm-100 rounded-2xl p-4 sm:p-6 shadow-sm transition-all duration-300">
      <div className="flex flex-col gap-3 mb-3">
        {prompt && (
          <p className="text-sm text-warm-400 font-medium">{prompt}</p>
        )}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`text-2xl w-10 h-10 flex items-center justify-center rounded-full transition-all ${mood === m
                ? "bg-warm-100 scale-110 shadow-sm"
                : "hover:bg-warm-50 opacity-70 hover:opacity-100"
                }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={prompt ? "ここに書いてください..." : placeholder}
        className="w-full min-h-[120px] p-3 rounded-xl border border-warm-200 bg-white/80 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent resize-none leading-relaxed transition-shadow overflow-hidden"
      />
      <div className="flex flex-wrap items-center justify-between mt-3 gap-2">
        <span
          className={`text-xs transition-opacity ${saved ? "opacity-100 text-warm-500" : "opacity-0"
            }`}
        >
          保存しました
        </span>
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          <span className="text-xs text-text-light">{body.length}文字</span>
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 min-h-[44px] rounded-full text-sm text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
            >
              削除
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 min-h-[44px] rounded-full text-sm text-text-muted hover:bg-warm-100 transition-colors cursor-pointer"
            >
              キャンセル
            </button>
          )}
          <button
            onClick={handleManualSave}
            disabled={body.trim() === ""}
            className="px-5 py-2 min-h-[44px] rounded-full bg-gradient-to-r from-warm-400 to-warm-500 text-white text-sm font-medium hover:from-warm-500 hover:to-warm-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            保存する
          </button>
        </div>
      </div>
      {showDeleteConfirm && onDelete && (
        <ConfirmDialog
          message="この日記を削除しますか？"
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete();
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
}

