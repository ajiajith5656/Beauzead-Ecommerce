/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000',
          dark: '#0a0a0a',
        },
        gold: {
          DEFAULT: '#eab308',
          light: '#fbbf24',
          dark: '#ca8a04',
        },
      },
    },
  },
  plugins: [],
}
