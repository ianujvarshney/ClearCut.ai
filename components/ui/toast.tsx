"use client";

import { CheckCircle2, X } from "lucide-react";
import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type ToastContextValue = {
  notify: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const value = useMemo(
    () => ({
      notify: (next: string) => {
        setMessage(next);
        window.setTimeout(() => setMessage(null), 2800);
      }
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {message ? (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-slate-950"
            role="status"
            aria-live="polite"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="flex-1 text-sm font-medium">{message}</p>
            <Button variant="ghost" size="sm" aria-label="Dismiss notification" onClick={() => setMessage(null)}>
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
