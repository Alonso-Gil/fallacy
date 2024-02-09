import type { Config } from "tailwindcss";

const primary = "#7f55d9";
const backgroundPrimary = "#f3f4f7";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        palette: {
          DEFAULT: primary,
        },
        background: {
          DEFAULT: backgroundPrimary,
        },
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "fade-in-right-to-left": {
          "0%": { transform: "translateX(4rem)", opacity: "0" },
          "100%": { transform: "translateX(0rem)", opacity: "1" },
        },
        "scale-up": {
          "0%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
    animation: {
      "fade-in": "fade-in 0.5s ease-in-out",
      "fade-out": "fade-out 0.5s ease-in-out",
      "fade-in-right-to-left": "fade-in-right-to-left 0.5s ease-in-out",
      page: "fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1), slide-to-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      modal:
        "fade-in 0.2s cubic-bezier(0.4, 0, 0.2, 1), scale-up 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    },
  },
  plugins: [],
};
export default config;
