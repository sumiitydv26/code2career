import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          dark: "#0b0f19",
          card: "#121826",
          cardHover: "#1b2337",
          border: "#1f293d",
          accent: "#38bdf8",
          neonGreen: "#10b981",
          gold: "#f59e0b",
          purple: "#a855f7",
          boss: "#ec4899",
        },
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 15px rgba(56, 189, 248, 0.4)" },
          "50%": { boxShadow: "0 0 25px rgba(56, 189, 248, 0.8)" },
        },
        bossGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(236, 72, 153, 0.5)" },
          "50%": { boxShadow: "0 0 35px rgba(236, 72, 153, 0.9)" },
        },
      },
      animation: {
        "pulse-glow": "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "boss-glow": "bossGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
