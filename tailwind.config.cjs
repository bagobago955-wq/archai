/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#165DFF',
        'primary-hover': '#0E4BD9',
        foreground: '#080C1A',
        secondary: '#6A7686',
        muted: '#EFF2F7',
        border: '#F3F4F3',
      },
      fontFamily: {
        sans: ['Lexend Deca', 'sans-serif'],
      }
    },
  },
  plugins: [],
}