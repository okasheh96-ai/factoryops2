/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0F172A',
        glass: 'rgba(255,255,255,0.04)',
        electric: '#3B82F6',
      },
      animation: {
        flash: 'flash 1.2s ease-in-out',
      },
      keyframes: {
        flash: {
          '0%': { backgroundColor: 'rgba(59,130,246,0.3)' },
          '100%': { backgroundColor: 'transparent' },
        },
      },
    },
  },
  plugins: [],
};
