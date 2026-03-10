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
          500: '#d9742b',
          600: '#ea580c',
        },
        'accent-orange': '#fb923c',
      },
    },
  },
  plugins: [],
}