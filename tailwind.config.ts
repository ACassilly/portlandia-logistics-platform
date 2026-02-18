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
        primary: "#00c950",
        "primary-dark": "#33945c",
        "primary-darker": "#3bab6b",
        navy: "#102b26",
        "navy-dark": "#142349",
        muted: "#474747",
        border: "#d9d9d9",
        "border-light": "#ebebeb",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
