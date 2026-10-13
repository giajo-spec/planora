"use client";

import { useMemo } from "react";
import { navigate, splitRoute, useRoute } from "./router";

export function usePathname(): string {
  return splitRoute(useRoute()).pathname;
}

export function useSearchParams(): URLSearchParams {
  const { search } = splitRoute(useRoute());
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useRouter() {
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => {},
    prefetch: () => {},
  };
}

export function notFound(): never {
  throw new Error("NEXT_NOT_FOUND");
}
