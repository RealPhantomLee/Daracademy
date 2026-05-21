import type { Config } from "tailwindcss";

export const daracademyPreset = {
  theme: {
    extend: {
      colors: {
        navy: "#0f172a",
        ivory: "#fefbf3",
        "slate-blue": "#1e293b",
        gold: "#d4a574",
        sage: "#6b7280",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
      borderRadius: {
        "3xl": "1.5rem",
      },
      opacity: {
        "15": "0.15",
        "35": "0.35",
      },
    },
  },
  plugins: [],
} as const satisfies Config;

export default daracademyPreset;
