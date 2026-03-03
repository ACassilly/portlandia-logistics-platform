import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "pl-green": "#00c950",
        "pl-dark": "#102b26",
        "pl-navy": "#142349",
        "pl-text": "#474747",
        "pl-border": "#d9d9d9",
        "pl-border-2": "#ebebeb",
        "pl-green-dark": "#33945c",
        "pl-green-dark-2": "#3bab6b",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

