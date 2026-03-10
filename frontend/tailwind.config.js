/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // AQUÍ ESTÁ EL TRUCO: Define tus colores personalizados
        primary: {
          500: '#f97316', // Pon aquí el color naranja que prefieras
          600: '#ea580c',
        },
        'accent-orange': '#fb923c',
      },
    },
  },
  plugins: [],
}