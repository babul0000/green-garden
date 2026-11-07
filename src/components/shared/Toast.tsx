"use client";

import React, { useEffect, useState, createContext, useContext, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastOptions {
  duration?: number;
  title?: string;
}

export interface ToastItemData {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
  duration: number;
}

// ─── Global Event Emitter for Toastify ─────────────────────────────────────────
type ToastListener = (toast: ToastItemData) => void;
const listeners = new Set<ToastListener>();

export const toast = {
  success: (message: string, options?: ToastOptions) => {
    emitToast("success", message, options);
  },
  error: (message: string, options?: ToastOptions) => {
    emitToast("error", message, options);
  },
  warning: (message: string, options?: ToastOptions) => {
    emitToast("warning", message, options);
  },
  info: (message: string, options?: ToastOptions) => {
    emitToast("info", message, options);
  },
};

function emitToast(type: ToastType, message: string, options?: ToastOptions) {
  const item: ToastItemData = {
    id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    type,
    message,
    title: options?.title,
    duration: options?.duration || 3500,
  };
  listeners.forEach((fn) => fn(item));
}

// ─── Toastify Style Icons & Themes ────────────────────────────────────────────
const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  warning: "⚠",
  info: "ℹ",
};

const THEMES: Record<
  ToastType,
  {
    bg: string;
    border: string;
    text: string;
    iconBg: string;
    progress: string;
  }
> = {
  success: {
    bg: "bg-stone-900 text-stone-100",
    border: "border-emerald-500/40",
    text: "text-emerald-400",
    iconBg: "bg-emerald-500 text-stone-950",
    progress: "bg-emerald-400",
  },
  error: {
    bg: "bg-stone-900 text-stone-100",
    border: "border-rose-500/40",
    text: "text-rose-400",
    iconBg: "bg-rose-500 text-white",
    progress: "bg-rose-500",
  },
  warning: {
    bg: "bg-stone-900 text-stone-100",
    border: "border-amber-500/40",
    text: "text-amber-400",
    iconBg: "bg-amber-500 text-stone-950",
    progress: "bg-amber-400",
  },
  info: {
    bg: "bg-stone-900 text-stone-100",
    border: "border-teal-500/40",
    text: "text-teal-400",
    iconBg: "bg-teal-500 text-stone-950",
    progress: "bg-teal-400",
  },
};

// ─── Toast Card Component ─────────────────────────────────────────────────────
function ToastCard({
  item,
  onDismiss,
}: {
  item: ToastItemData;
  onDismiss: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const theme = THEMES[item.type];

  useEffect(() => {
    // Entrance
    const tEntry = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(tEntry);
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 20;
    const step = 100 / (item.duration / intervalTime);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          setVisible(false);
          setTimeout(onDismiss, 250);
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isPaused, item.duration, onDismiss]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, 250);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`
        pointer-events-auto relative w-full sm:w-96 rounded-2xl border shadow-2xl overflow-hidden
        transition-all duration-300 transform select-none backdrop-blur-md
        ${theme.bg} ${theme.border}
        ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 -translate-y-4 scale-95"}
      `}
    >
      <div className="flex items-start gap-3.5 p-4">
        {/* Type Icon Badge */}
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-sm ${theme.iconBg}`}
        >
          {ICONS[item.type]}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-2">
          {item.title && (
            <h5 className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${theme.text}`}>
              {item.title}
            </h5>
          )}
          <p className="text-xs sm:text-sm font-medium text-stone-200 leading-snug">
            {item.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="text-stone-400 hover:text-white text-base leading-none transition-colors p-1 -mr-1 -mt-1 cursor-pointer"
          title="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Toastify Progress Bar */}
      <div className="w-full h-1 bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all ease-linear ${theme.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── ToastContainer Component ─────────────────────────────────────────────────
export function ToastContainer({
  position = "top-right",
}: {
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}) {
  const [toasts, setToasts] = useState<ToastItemData[]>([]);

  useEffect(() => {
    const handleNewToast = (item: ToastItemData) => {
      setToasts((prev) => [...prev, item]);
    };

    listeners.add(handleNewToast);
    return () => {
      listeners.delete(handleNewToast);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const posClass =
    position === "top-right"
      ? "top-5 right-5 sm:top-6 sm:right-6"
      : position === "top-left"
      ? "top-5 left-5 sm:top-6 sm:left-6"
      : position === "bottom-left"
      ? "bottom-5 left-5 sm:bottom-6 sm:left-6"
      : "bottom-5 right-5 sm:bottom-6 sm:right-6";

  return (
    <div
      aria-live="polite"
      className={`fixed z-[999999] flex flex-col gap-2.5 max-w-[90vw] sm:max-w-md pointer-events-none ${posClass}`}
    >
      {toasts.map((item) => (
        <ToastCard
          key={item.id}
          item={item}
          onDismiss={() => removeToast(item.id)}
        />
      ))}
    </div>
  );
}

// ─── Backward-compatible Legacy StandaloneToast & ToastProvider ───────────────
export function StandaloneToast({
  message,
  type = "success",
  visible,
  onClose,
}: {
  message: string;
  type?: ToastType;
  visible: boolean;
  onClose?: () => void;
}) {
  if (!visible || !message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-y-1/2 z-[99999] pointer-events-auto">
      <ToastCard
        item={{
          id: "standalone",
          type,
          message,
          duration: 3500,
        }}
        onDismiss={() => {
          if (onClose) onClose();
        }}
      />
    </div>
  );
}

// Context for legacy useToast()
interface ToastContextValue {
  toast: typeof toast;
}

const ToastContext = createContext<ToastContextValue>({ toast });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer position="top-right" />
    </ToastContext.Provider>
  );
}
