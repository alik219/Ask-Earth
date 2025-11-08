/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          blue: '#1e3a8a',
          green: '#15803d',
          ocean: '#0369a1',
        }
      }
    },
  },
  plugins: [],
}
