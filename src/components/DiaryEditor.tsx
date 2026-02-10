"use client";

import { useState, useEffect, useRef } from "react";
import { PLACEHOLDER_MESSAGES } from "@/lib/constants";
import ConfirmDialog from "@/components/ConfirmDialog";

interface DiaryEditorProps {
  prompt: string;
  initialBody?: string;
  onSave: (body: string) => void;
  onCancel?: () => void;
  onDelete?: () => void;
  autoSave?: boolean;
}

export default function DiaryEditor({
  prompt,
  initialBody = "",
  onSave,
  onCancel,
  onDelete,
  autoSave = false,
}: DiaryEditorProps) {
  const [body, setBody] = useState(initialBody);
  const [saved, setSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const placeholder =
    PLACEHOLDER_MESSAGES[
    Math.abs(
      prompt
        .split("")
        .reduce((a, c) => a + c.charCodeAt(0), 0)
    ) % PLACEHOLDER_MESSAGES.length
    ];

  // Auto-save with debounce (only for existing entries)
  useEffect(() => {
    if (!autoSave || body === initialBody) return;

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
  }, [body, initialBody, onSave, autoSave]);

  // Focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleManualSave = () => {
    if (body.trim() === "") return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    onSave(body);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-bg-card border border-warm-100 rounded-2xl p-6 shadow-sm">
      {prompt && (
        <p className="text-sm text-warm-400 font-medium mb-2">{prompt}</p>
      )}
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={prompt ? "ここに書いてください..." : placeholder}
        className="w-full min-h-[120px] p-3 rounded-xl border border-warm-200 bg-white/80 text-text placeholder:text-text-light focus:outline-none focus:ring-2 focus:ring-warm-300 focus:border-transparent resize-y leading-relaxed transition-shadow"
      />
      <div className="flex items-center justify-between mt-3">
        <span
          className={`text-xs transition-opacity ${saved ? "opacity-100 text-warm-500" : "opacity-0"
            }`}
        >
          保存しました
        </span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-text-light">{body.length}文字</span>
          {onDelete && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 rounded-full text-sm text-red-400 hover:bg-red-50 transition-colors cursor-pointer"
            >
              削除
            </button>
          )}
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-full text-sm text-text-muted hover:bg-warm-100 transition-colors cursor-pointer"
            >
              キャンセル
            </button>
          )}
          <button
            onClick={handleManualSave}
            disabled={body.trim() === ""}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-warm-400 to-warm-500 text-white text-sm font-medium hover:from-warm-500 hover:to-warm-600 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

