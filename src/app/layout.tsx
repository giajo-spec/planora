import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { AppProvider } from "@/lib/state/app-store";

export const metadata: Metadata = {
  title: { default: "Projet Nutrition — vos repas de la semaine, réglés", template: "%s · Projet Nutrition" },
  description:
    "Planification de repas personnalisée, recettes du monde, liste d'épicerie automatique et cuisine guidée pas à pas.",
  applicationName: "Projet Nutrition",
  appleWebApp: { capable: true, title: "Nutrition", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#F6F3EA",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr-CA">
      <body>
        <AppProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
