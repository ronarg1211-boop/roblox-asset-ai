/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          950: '#0B0D11',
          900: '#11141A',
          850: '#171B24',
          800: '#1E232E',
          750: '#272E3C',
          700: '#323B4C',
          600: '#46536A',
          400: '#8A99B5',
          200: '#D1D9E6',
          100: '#EEF2F8',
        },
        roblox: {
          red: '#E2231A',
          blue: '#00A2FF',
          green: '#00B06F',
          yellow: '#FFAA00',
          dark: '#191919',
        }
      },
    },
  },
  plugins: [],
};
