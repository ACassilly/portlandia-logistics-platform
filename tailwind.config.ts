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
        "primary-dark": "#00a843",
        "dark-green": "#33945c",
        "dark-navy": "#102b26",
        "dark-navy-alt": "#142349",
        "text-body": "#474747",
        "border-light": "#d9d9d9",
        "border-lighter": "#ebebeb",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
