"use client";

import { useSyncExternalStore } from "react";

/**
 * Routeur par hachage (#/plan?jour=2) pour la version HTML autonome.
 * Les ancres internes (#fonctionnalites) ne changent pas la route : elles font défiler la page.
 */
let currentRoute = readRoute();
const listeners = new Set<() => void>();

function readRoute(): string {
  if (typeof window === "undefined") return "/";
  const hash = window.location.hash;
  return hash.startsWith("#/") ? hash.slice(1) : "/";
}

if (typeof window !== "undefined") {
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash;
    if (hash.startsWith("#/")) {
      currentRoute = hash.slice(1);
      listeners.forEach((l) => l());
      window.scrollTo({ top: 0 });
    } else if (hash.length > 1) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: "smooth" });
    }
  });
}

export function navigate(href: string) {
  if (href.startsWith("#") && !href.startsWith("#/")) {
    window.location.hash = href;
    return;
  }
  window.location.hash = href.startsWith("/") ? href : `/${href}`;
}

export function useRoute(): string {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => currentRoute,
    () => "/",
  );
}

export function splitRoute(route: string): { pathname: string; search: string } {
  const i = route.indexOf("?");
  return i >= 0 ? { pathname: route.slice(0, i), search: route.slice(i + 1) } : { pathname: route, search: "" };
}
