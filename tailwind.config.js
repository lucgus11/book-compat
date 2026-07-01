/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF7F0',
        paper: '#F3ECE1',
        ink: '#241F1A',
        clay: {
          50: '#FBF1EC',
          100: '#F5DDD2',
          300: '#E1A78F',
          500: '#C1694F',
          600: '#A8543C',
          700: '#8A4230',
        },
        sage: {
          400: '#93A385',
          500: '#7C8B6F',
          600: '#63715A',
        },
        gold: '#D4A657',
      },
      fontFamily: {
        serif: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(36, 31, 26, 0.12)',
        card: '0 1px 3px rgba(36,31,26,0.06), 0 8px 24px -8px rgba(36,31,26,0.10)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
