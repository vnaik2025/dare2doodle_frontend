/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',      // Softer indigo for buttons/CTAs in dark mode
        secondary: '#f472b6',    // Lighter pink for accents in dark mode
        background: '#1e293b',   // Dark gray bg to match the grid pattern
        textPrimary: '#ffffff',  // White text for contrast
        error: '#dc2626',        // Darker red for errors
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        "slide-up": "slideUp 0.3s ease-out forwards",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
plugins: [require('tailwind-scrollbar-hide')],
};
