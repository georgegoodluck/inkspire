import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  "#f0f0ff",
          100: "#e4e3ff",
          200: "#cccbfe",
          300: "#aba8fc",
          400: "#867ef8",
          500: "#6457f2",
          600: "#5040e7",
          700: "#4232cc",
          800: "#3628a6",
          900: "#2f2484",
          950: "#1c154f",
        },
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
