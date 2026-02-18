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
        "pl-green": "#00c950",
        "pl-dark-green": "#33945c",
        "pl-mid-green": "#3bab6b",
        "pl-navy": "#102b26",
        "pl-dark-blue": "#142349",
        "pl-text": "#474747",
        "pl-border": "#d9d9d9",
        "pl-border-light": "#ebebeb",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
