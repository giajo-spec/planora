import type { Config } from "tailwindcss";

/**
 * Jetons de design « Projet Nutrition » — énergique et moderne.
 * Toutes les couleurs de l'interface passent par ces jetons.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#14151A", soft: "#2E3039", muted: "#565A68" },
        paper: { DEFAULT: "#F6F3EA", deep: "#ECE7D9" },
        surface: "#FFFFFF",
        line: { DEFAULT: "#E3DDCD", strong: "#C9C1AC" },
        lime: { DEFAULT: "#C6F432", deep: "#8DB80A", soft: "#F0FCCB" },
        tomato: { DEFAULT: "#FF5B2E", deep: "#B8360C", soft: "#FFE4D9" },
        violet: { DEFAULT: "#5B3DF5", deep: "#3F25C9", soft: "#E9E4FF" },
        sky: { DEFAULT: "#2F9BFF", deep: "#0B5CAD", soft: "#DDEEFF" },
        sun: { DEFAULT: "#FFB21E", deep: "#8A5A00", soft: "#FFF1D1" },
        mint: { DEFAULT: "#16C47F", deep: "#0B7A4E", soft: "#D6F7E8" },
        danger: { DEFAULT: "#C8261B", soft: "#FDE4E1" },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque Variable"', "system-ui", "sans-serif"],
        sans: ['"DM Sans Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 7vw, 5.25rem)", { lineHeight: "0.95", letterSpacing: "-0.035em", fontWeight: "800" }],
        "display-lg": ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-md": ["1.75rem", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "750" }],
        "cook-step": ["clamp(1.5rem, 4.8vw, 2.4rem)", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
      },
      borderRadius: {
        card: "1.75rem",
        xl2: "1.25rem",
      },
      boxShadow: {
        pop: "0 3px 0 0 #14151A",
        "pop-lg": "0 5px 0 0 #14151A",
        card: "0 1px 0 0 rgba(20,21,26,0.04), 0 8px 24px -12px rgba(20,21,26,0.18)",
        nav: "0 -8px 30px -12px rgba(20,21,26,0.25)",
      },
      spacing: {
        tap: "2.75rem",
        "safe-b": "env(safe-area-inset-bottom)",
      },
      keyframes: {
        "pop-in": { "0%": { transform: "scale(0.94)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        "slide-up": { "0%": { transform: "translateY(16px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        "sheet-up": { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
        wiggle: { "0%,100%": { transform: "rotate(0)" }, "25%": { transform: "rotate(-6deg)" }, "75%": { transform: "rotate(6deg)" } },
        "ring-alert": { "0%,100%": { boxShadow: "0 0 0 0 rgba(255,91,46,0.7)" }, "50%": { boxShadow: "0 0 0 14px rgba(255,91,46,0)" } },
        "check-pop": { "0%": { transform: "scale(0.6)" }, "60%": { transform: "scale(1.15)" }, "100%": { transform: "scale(1)" } },
      },
      animation: {
        "pop-in": "pop-in 180ms cubic-bezier(.2,.9,.3,1.2) both",
        "slide-up": "slide-up 280ms cubic-bezier(.2,.8,.2,1) both",
        "sheet-up": "sheet-up 260ms cubic-bezier(.2,.8,.2,1) both",
        wiggle: "wiggle 400ms ease-in-out 3",
        "ring-alert": "ring-alert 1.1s ease-out infinite",
        "check-pop": "check-pop 220ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
