/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Only extend utilities that Material doesn't provide
      backdropBlur: {
        xs: '2px',
      },
      aspectRatio: {
        'video': '16 / 9',
        'square': '1 / 1',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
  plugins: [],
  // Disable core plugins that conflict with Material-UI
  corePlugins: {
    // Keep these utilities that Material doesn't provide
    aspectRatio: true,
    backdropBlur: true,
    animation: true,
    // Disable spacing/colors - use Material theme instead
    padding: false,
    margin: false,
    backgroundColor: false,
    textColor: false,
    fontSize: false,
    fontFamily: false,
  },
}