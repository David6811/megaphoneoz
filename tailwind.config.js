/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#c60800',
        'brand-red-dark': '#a00600',
        'brand-gray': '#333333',
        'brand-gray-light': '#666666',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      height: {
        '15': '60px',
      },
    },
  },
  plugins: [],
}