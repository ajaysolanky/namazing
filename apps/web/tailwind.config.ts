import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["DM Serif Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        "studio-sand": "#f5efe6",
        "studio-ink": "#1f2933",
        "studio-rose": "#f8d4d8",
        "studio-sage": "#d7e3d4",
        "studio-cream": "#faf8f5",
        "studio-blush": "#fceef0",
        "studio-mint": "#eef5ed",
        "studio-warm": "#fcf9f5",
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(31,41,51,0.08)",
        card: "0 4px 16px -4px rgba(31,41,51,0.12)",
        elevated: "0 8px 24px -8px rgba(31,41,51,0.16)",
        glow: "0 0 40px -10px rgba(248,212,216,0.5)",
        "glow-sage": "0 0 40px -10px rgba(215,227,212,0.5)",
        inner: "inset 0 2px 4px 0 rgba(31,41,51,0.04)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-premium": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "shimmer": "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite",
        "float": "float 6s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "gradient-shift": "gradient-shift 8s ease infinite",
      },
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
