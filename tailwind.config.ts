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
          50: "#fdf2f0",
          100: "#fce4df",
          200: "#f9c5bb",
          300: "#f4a08e",
          400: "#ec7053",
          500: "#d94f30",
          600: "#b83a20",
          700: "#8b0000",
          800: "#6e1a0e",
          900: "#5a1710",
        },
      },
    },
  },
  plugins: [],
};

export default config;
