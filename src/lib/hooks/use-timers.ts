"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Minuteries simultanées, basées sur l'horloge (précises même si l'onglet ralentit). */
export interface CookingTimer {
  id: string;
  label: string;
  durationMs: number;
  /** Fin prévue (ms epoch) quand la minuterie tourne. */
  endsAt: number | null;
  /** Temps restant figé quand la minuterie est en pause. */
  remainingMs: number;
  finished: boolean;
  /** Alarme acquittée par l'utilisateur. */
  acknowledged: boolean;
}

function beep(ctx: AudioContext) {
  const now = ctx.currentTime;
  for (let i = 0; i < 3; i++) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, now + i * 0.35);
    gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.35 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.35 + 0.25);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + i * 0.35);
    osc.stop(now + i * 0.35 + 0.3);
  }
}

export function remainingOf(timer: CookingTimer, now: number): number {
  return timer.endsAt != null ? Math.max(0, timer.endsAt - now) : timer.remainingMs;
}

export function formatClock(ms: number): string {
  const total = Math.ceil(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const mm = String(m).padStart(h ? 2 : 1, "0");
  return h ? `${h}:${mm}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}

export function useTimers() {
  const [timers, setTimers] = useState<CookingTimer[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const audio = useRef<AudioContext | null>(null);

  const ensureAudio = useCallback(() => {
    if (typeof window === "undefined") return null;
    try {
      audio.current ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      if (audio.current.state === "suspended") void audio.current.resume();
      return audio.current;
    } catch {
      return null;
    }
  }, []);

  const running = timers.some((t) => t.endsAt != null || (t.finished && !t.acknowledged));

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  // Détection des minuteries terminées → alerte sonore, vibration, visuelle.
  useEffect(() => {
    const done = timers.filter((t) => t.endsAt != null && t.endsAt <= now);
    if (done.length === 0) return;
    setTimers((list) =>
      list.map((t) => (t.endsAt != null && t.endsAt <= now ? { ...t, endsAt: null, remainingMs: 0, finished: true } : t)),
    );
    const ctx = ensureAudio();
    if (ctx) beep(ctx);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate?.([300, 150, 300, 150, 300]);
  }, [now, timers, ensureAudio]);

  // Rappel sonore toutes les 5 s tant que l'alarme n'est pas acquittée.
  const ringing = timers.filter((t) => t.finished && !t.acknowledged).length;
  useEffect(() => {
    if (!ringing) return;
    const id = setInterval(() => {
      const ctx = ensureAudio();
      if (ctx) beep(ctx);
    }, 5000);
    return () => clearInterval(id);
  }, [ringing, ensureAudio]);

  const start = useCallback(
    (label: string, seconds: number) => {
      ensureAudio(); // déverrouille l'audio grâce au geste utilisateur
      const t = Date.now();
      setNow(t);
      setTimers((list) => [
        ...list,
        {
          id: `${t}-${Math.random().toString(36).slice(2, 7)}`,
          label,
          durationMs: seconds * 1000,
          endsAt: t + seconds * 1000,
          remainingMs: seconds * 1000,
          finished: false,
          acknowledged: false,
        },
      ]);
    },
    [ensureAudio],
  );

  const pause = useCallback((id: string) => {
    const t = Date.now();
    setTimers((list) => list.map((x) => (x.id === id && x.endsAt != null ? { ...x, remainingMs: Math.max(0, x.endsAt - t), endsAt: null } : x)));
  }, []);

  const resume = useCallback((id: string) => {
    const t = Date.now();
    setNow(t);
    setTimers((list) => list.map((x) => (x.id === id && x.endsAt == null && !x.finished ? { ...x, endsAt: t + x.remainingMs } : x)));
  }, []);

  const addTime = useCallback((id: string, seconds: number) => {
    const t = Date.now();
    setNow(t);
    setTimers((list) =>
      list.map((x) => {
        if (x.id !== id) return x;
        if (x.finished) return { ...x, finished: false, acknowledged: false, endsAt: t + seconds * 1000, remainingMs: seconds * 1000 };
        return x.endsAt != null ? { ...x, endsAt: x.endsAt + seconds * 1000 } : { ...x, remainingMs: x.remainingMs + seconds * 1000 };
      }),
    );
  }, []);

  const remove = useCallback((id: string) => setTimers((list) => list.filter((x) => x.id !== id)), []);
  const acknowledge = useCallback((id: string) => setTimers((list) => list.map((x) => (x.id === id ? { ...x, acknowledged: true } : x))), []);

  return { timers, now, start, pause, resume, addTime, remove, acknowledge };
}
