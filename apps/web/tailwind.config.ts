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
      },
    },
  },
  plugins: [],
};

export default config;
