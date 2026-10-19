import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

// Colors are CSS-variable backed. Two themes swap the variables (see
// globals.css); the `light:` variant exists only for artwork that ships as
// separate cuts per theme.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "rgb(var(--bg) / <alpha-value>)",
          800: "rgb(var(--bg2) / <alpha-value>)",
          700: "rgb(var(--bg3) / <alpha-value>)",
          600: "rgb(var(--bg4) / <alpha-value>)",
          500: "rgb(var(--bg5) / <alpha-value>)",
        },
        bone: {
          50: "rgb(var(--fg) / <alpha-value>)",
          // 100 and 300 were used across the site but never defined, so those
          // elements silently inherited their parent's colour
          100: "rgb(var(--fg1) / <alpha-value>)",
          200: "rgb(var(--fg2) / <alpha-value>)",
          300: "rgb(var(--fg25) / <alpha-value>)",
          400: "rgb(var(--fg3) / <alpha-value>)",
          500: "rgb(var(--fg4) / <alpha-value>)",
        },
        line: "rgb(var(--line) / <alpha-value>)",
        electric: "rgb(var(--electric) / <alpha-value>)",
        mint: "rgb(var(--mint) / <alpha-value>)",
        "mint-lift": "rgb(var(--mint-lift) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
        ultra: "0.32em",
      },
      maxWidth: {
        edge: "1680px",
      },
      transitionTimingFunction: {
        cinema: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        marqueeReverse: {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
        "marquee-rev": "marqueeReverse 50s linear infinite",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", 'html[data-theme="light"] &');
    }),
  ],
};

export default config;
