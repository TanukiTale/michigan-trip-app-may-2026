import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F4E9DC',
        shell: '#FCF8F2',
        driftwood: '#8E8377',
        dune: '#D9C6B1',
        lake: '#9BB6C9',
        deepLake: '#5E7F98',
        pine: '#6E8475',
        ink: '#3F413F',
        blush: '#E7C9C4',
      },
      boxShadow: {
        board: '0 22px 60px rgba(83, 77, 67, 0.12)',
        float: '0 18px 40px rgba(73, 86, 99, 0.14)',
        soft: '0 10px 24px rgba(103, 96, 86, 0.1)',
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Georgia', 'serif'],
        body: ['"Avenir Next"', '"Trebuchet MS"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
