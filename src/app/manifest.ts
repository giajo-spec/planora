import type { MetadataRoute } from "next";

/** Manifeste PWA (base pour une future version installable / hors ligne). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PLANORA",
    short_name: "PLANORA",
    description: "Planifiez vos repas, faites l'épicerie et cuisinez pas à pas.",
    start_url: "/accueil",
    display: "standalone",
    background_color: "#F6F1E8",
    theme_color: "#16140F",
    lang: "fr-CA",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
