import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/manrope";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { ToastProvider } from "@/components/ui/toast";
import { AppProvider } from "@/lib/state/app-store";

export const metadata: Metadata = {
  title: { default: "PLANORA — vos repas de la semaine, réglés", template: "%s · PLANORA" },
  description:
    "Planification de repas personnalisée, recettes du monde, liste d'épicerie automatique et cuisine guidée pas à pas.",
  applicationName: "PLANORA",
  appleWebApp: { capable: true, title: "PLANORA", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#F6F1E8",
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
