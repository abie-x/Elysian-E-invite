/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        'brand-ivory': '#F8F5EF',
        'brand-blush': '#EED9D2',
        'brand-champagne': '#F3E9DD',
        'brand-gold': '#C4A962',
        'brand-ink': '#2C2622',
        'brand-rose': '#D8BFAF',
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      boxShadow: {
        luxe: '0 10px 25px -5px rgba(44,38,34,0.2), 0 8px 10px -6px rgba(44,38,34,0.12)'
      }
    },
  },
  plugins: [],
};



