/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sunflower: "#FFC72C",
        plant: {
          light: "#4CAF50",
          DEFAULT: "#2E7D32",
          dark: "#1B5E20",
        },
        beige: "#F5F5DC",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
