"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
      onClick={onCancel}
    >
      <div
        className="bg-bg-card rounded-2xl p-5 sm:p-6 shadow-lg max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-center mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-5 py-2 min-h-[44px] rounded-full text-sm text-text-muted hover:bg-warm-100 transition-colors cursor-pointer"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 min-h-[44px] rounded-full text-sm bg-warm-500 text-white hover:bg-warm-600 transition-colors cursor-pointer"
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
}
