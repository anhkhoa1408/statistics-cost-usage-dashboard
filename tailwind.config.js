/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdfce9",
          100: "#fbfac6",
          200: "#f9f38f",
          300: "#f5e54f",
          DEFAULT: "#f0d528",
          500: "#e0bc12",
          600: "#c1930d",
          700: "#9a6a0e",
          800: "#7f5414",
          900: "#6d4516",
          950: "#3f2409",
        },
      },
    },
  },
  plugins: [],
};
