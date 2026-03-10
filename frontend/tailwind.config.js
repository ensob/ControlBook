/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        urban: {
          asfalto: "#121212",
          naranja: "#FF5F1F", // Naranja neón profesional
          naranjaHover: "#E64A19",
          grisCard: "#1E1E20",
        },
      },
    },
  },
  plugins: [],
};
