import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        card: "hsl(var(--card))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))"
      },
      boxShadow: {
        soft: "0 24px 80px rgba(17, 24, 39, 0.12)",
        glow: "0 20px 70px rgba(79, 70, 229, 0.25)"
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(99,102,241,.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,.12) 1px, transparent 1px)",
        checker: "linear-gradient(45deg, rgba(148,163,184,.22) 25%, transparent 25%), linear-gradient(-45deg, rgba(148,163,184,.22) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(148,163,184,.22) 75%), linear-gradient(-45deg, transparent 75%, rgba(148,163,184,.22) 75%)"
      }
    }
  },
  plugins: []
};

export default config;
