/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        handle: {
          green: '#16a34a',
          dark: '#0a0a0a',
          gray: '#171717',
          border: '#262626',
        }
      }
    },
  },
  plugins: [],
}
