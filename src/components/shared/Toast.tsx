"use client";

import React, { useEffect, useState, createContext, useContext, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  toast: {
    success: (msg: string, duration?: number) => void;
    error: (msg: string, duration?: number) => void;
    warning: (msg: string, duration?: number) => void;
    info: (msg: string, duration?: number) => void;
  };
  dismiss: (id: string) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

// ─── Toast Item ───────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const COLORS: Record<ToastType, string> = {
  success: "bg-emerald-500",
  error: "bg-red-500",
  warning: "bg-amber-500",
  info: "bg-blue-500",
};

const BG: Record<ToastType, string> = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const t1 = setTimeout(() => setVisible(true), 10);
    // Auto dismiss
    const t2 = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, toast.duration || 4000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg
        transition-all duration-300 max-w-xs w-full
        ${BG[toast.type]}
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}
      `}
    >
      {/* Icon */}
      <div className={`w-6 h-6 rounded-full ${COLORS[toast.type]} text-white flex items-center justify-center text-xs font-bold flex-shrink-0`}>
        {ICONS[toast.type]}
      </div>

      {/* Message */}
      <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>

      {/* Close */}
      <button
        onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
        className="text-current opacity-60 hover:opacity-100 text-lg leading-none transition-opacity flex-shrink-0"
      >
        ×
      </button>
    </div>
  );
}

// ─── Provider + Container ─────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const add = useCallback((type: ToastType, message: string, duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string, duration?: number) => add("success", msg, duration),
    error: (msg: string, duration?: number) => add("error", msg, duration),
    warning: (msg: string, duration?: number) => add("warning", msg, duration),
    info: (msg: string, duration?: number) => add("info", msg, duration),
  };

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      {/* Toast Container — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <div className="flex flex-col gap-2 pointer-events-auto">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

// ─── Standalone Toast (without context, for simple usage) ─────────────────────
interface StandaloneToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose?: () => void;
}

export function StandaloneToast({ message, type = "success", visible, onClose }: StandaloneToastProps) {
  if (!message) return null;

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
        flex items-center gap-3 px-5 py-3 rounded-xl border shadow-xl
        transition-all duration-400
        ${BG[type]}
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <div className={`w-6 h-6 rounded-full ${COLORS[type]} text-white flex items-center justify-center text-xs font-bold`}>
        {ICONS[type]}
      </div>
      <p className="text-sm font-semibold">{message}</p>
      {onClose && (
        <button onClick={onClose} className="opacity-60 hover:opacity-100 text-lg leading-none ml-2">×</button>
      )}
    </div>
  );
}
