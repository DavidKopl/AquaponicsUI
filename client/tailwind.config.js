/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Cesty ke všem React komponentám
    
  ],

  important: true, // Přidá !important ke všem Tailwind třídám
  theme: {
    extend: {},
  },
  plugins: [],
}
