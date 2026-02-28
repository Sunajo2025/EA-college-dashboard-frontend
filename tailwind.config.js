/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
      },
      transitionProperty: {
        'theme': 'background-color, color, border-color',
      },
      keyframes: {
    shimmer: {
      "0%": { backgroundPosition: "-200% 0" },
      "100%": { backgroundPosition: "200% 0" },
    },
  },
  animation: {
    shimmer: "shimmer 1.5s infinite linear",
  },
    },
  },
  plugins: [],
};
