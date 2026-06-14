/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Manrope'", "sans-serif"],
      },
      colors: {
        sky: {
          deep: "#1e3a5f",
          mid: "#6a8fb8",
          light: "#87ceeb",
        },
        sunset: {
          400: "#f4a261",
          500: "#e76f51",
        },
        mountain: {
          dark: "#2d4a3e",
          mid: "#3d5c4a",
          light: "#5a7d6b",
        },
        cloud: {
          DEFAULT: "#f0f8ff",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
