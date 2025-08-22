/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // Softer indigo for buttons/CTAs in dark mode
        secondary: '#f472b6', // Lighter pink for accents in dark mode
        background: '#1e293b', // Dark gray bg to match the grid pattern
        textPrimary: '#ffffff', // White text for contrast
        error: '#dc2626', // Darker red for errors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'doodle-pattern': "url('/src/assets/doodle-bg.png')",
      },
    },
  },
  plugins: [],
};