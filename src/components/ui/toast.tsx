"use client";

import { CheckCircle2 } from "lucide-react";
import { createContext, useCallback, useContext, useRef, useState } from "react";

interface ToastContextValue {
  notify(message: string): void;
}

const ToastContext = createContext<ToastContextValue>({ notify: () => {} });

/** Notifications discrètes, annoncées aux lecteurs d'écran. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<{ id: number; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((text: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage({ id: Date.now(), text });
    timer.current = setTimeout(() => setMessage(null), 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ notify }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-[calc(6.5rem+env(safe-area-inset-bottom))] z-[60] flex justify-center px-4 lg:bottom-8"
      >
        {message && (
          <div key={message.id} className="flex animate-slide-up items-center gap-2 rounded-full bg-ink px-5 py-3 font-semibold text-paper shadow-card">
            <CheckCircle2 aria-hidden className="size-5 text-lime" />
            {message.text}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
