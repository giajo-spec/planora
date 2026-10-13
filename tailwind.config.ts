import type { Config } from "tailwindcss";

/**
 * Jetons de design PLANORA — luxe discret.
 * Ivoire, noir chaud et or champagne ; accents minéraux et feutrés.
 * Toutes les couleurs de l'interface passent par ces jetons.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#16140F", soft: "#2C2820", muted: "#6B6457" },
        paper: { DEFAULT: "#F6F1E8", deep: "#ECE4D5" },
        surface: "#FFFDF8",
        line: { DEFAULT: "#E4DACA", strong: "#CBBDA3" },
        gold: { DEFAULT: "#C6A46C", deep: "#7A5B2B", soft: "#F2E8D5", light: "#E2CC9F" },
        terra: { DEFAULT: "#B4643E", deep: "#874425", soft: "#F4E2D7" },
        plum: { DEFAULT: "#5C3A5A", deep: "#462846", soft: "#EEE3EC" },
        slate: { DEFAULT: "#48677F", deep: "#2E4A60", soft: "#E2E9EF" },
        amber: { DEFAULT: "#D6A445", deep: "#6F4C0E", soft: "#F7ECD2" },
        sage: { DEFAULT: "#6F8A69", deep: "#3B5A39", soft: "#E4EBDE" },
        danger: { DEFAULT: "#A3302A", soft: "#F5E0DC" },
      },
      fontFamily: {
        display: ['"Fraunces Variable"', "Georgia", "serif"],
        sans: ['"Manrope Variable"', "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 7vw, 5.5rem)", { lineHeight: "1", letterSpacing: "-0.025em", fontWeight: "400" }],
        "display-lg": ["clamp(2.1rem, 4.5vw, 3.4rem)", { lineHeight: "1.05", letterSpacing: "-0.02em", fontWeight: "400" }],
        "display-md": ["1.85rem", { lineHeight: "1.15", letterSpacing: "-0.015em", fontWeight: "400" }],
        "cook-step": ["clamp(1.5rem, 4.8vw, 2.4rem)", { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "400" }],
      },
      borderRadius: {
        card: "1.5rem",
        xl2: "1.25rem",
      },
      boxShadow: {
        pop: "0 1px 2px rgba(22,20,15,0.06), 0 10px 24px -14px rgba(22,20,15,0.45)",
        "pop-lg": "0 2px 4px rgba(22,20,15,0.05), 0 24px 48px -24px rgba(22,20,15,0.45)",
        card: "0 1px 0 rgba(22,20,15,0.03), 0 18px 40px -28px rgba(22,20,15,0.35)",
        nav: "0 -12px 40px -20px rgba(22,20,15,0.3)",
        gold: "inset 0 0 0 1px rgba(198,164,108,0.55)",
      },
      spacing: {
        tap: "2.75rem",
        "safe-b": "env(safe-area-inset-bottom)",
      },
      keyframes: {
        "pop-in": { "0%": { transform: "scale(0.97)", opacity: "0" }, "100%": { transform: "scale(1)", opacity: "1" } },
        "slide-up": { "0%": { transform: "translateY(12px)", opacity: "0" }, "100%": { transform: "translateY(0)", opacity: "1" } },
        "sheet-up": { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
        wiggle: { "0%,100%": { transform: "rotate(0)" }, "25%": { transform: "rotate(-6deg)" }, "75%": { transform: "rotate(6deg)" } },
        "ring-alert": { "0%,100%": { boxShadow: "0 0 0 0 rgba(198,164,108,0.8)" }, "50%": { boxShadow: "0 0 0 14px rgba(198,164,108,0)" } },
        "check-pop": { "0%": { transform: "scale(0.7)" }, "60%": { transform: "scale(1.08)" }, "100%": { transform: "scale(1)" } },
      },
      animation: {
        "pop-in": "pop-in 240ms cubic-bezier(.2,.8,.2,1) both",
        "slide-up": "slide-up 420ms cubic-bezier(.2,.8,.2,1) both",
        "sheet-up": "sheet-up 300ms cubic-bezier(.2,.8,.2,1) both",
        wiggle: "wiggle 400ms ease-in-out 3",
        "ring-alert": "ring-alert 1.1s ease-out infinite",
        "check-pop": "check-pop 240ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
