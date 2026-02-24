import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canyon: {
          50: "#fdf6f3",
          100: "#fbe9e1",
          200: "#f7d0c0",
          300: "#f0b09a",
          400: "#e68a6e",
          500: "#d97050",
          600: "#c45a3a",
          700: "#a34830",
          800: "#853b28",
          900: "#6e3224",
        },
        taupe: {
          50: "#f7f5f2",
          100: "#ede9e3",
          200: "#dbd4ca",
          300: "#c4baac",
          400: "#a89a8a",
          500: "#8f7f6e",
          600: "#776959",
          700: "#615649",
          800: "#524940",
          900: "#3d3731",
          950: "#1a1714",
        },
      },
    },
  },
  plugins: [],
};

export default config;
