/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rotary: {
          blue: '#003DA5',
          gold: '#F7A81B',
          lightblue: '#0096D6',
        }
      }
    },
  },
  plugins: [],
}
