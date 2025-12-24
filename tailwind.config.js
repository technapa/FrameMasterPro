/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#f06f0a',
          50: '#fff8ed',
          100: '#ffefd6',
          200: '#fedaa9',
          300: '#fdbf76',
          400: '#fb9c42',
          500: '#f06f0a',
          600: '#d55a05',
          700: '#b14406',
          800: '#8e370d',
          900: '#722e0f',
          950: '#3e1606',
        }
      }
    }
  },
  plugins: [],
}