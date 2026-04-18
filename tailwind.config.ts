import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#DDF3FB',
        shell: '#F4FBFF',
        driftwood: '#6B8EA6',
        dune: '#BFDFF0',
        lake: '#84CDEB',
        deepLake: '#2E8FBE',
        pine: '#68AFA8',
        ink: '#3F413F',
        blush: '#F6C8B7',
      },
      boxShadow: {
        board: '0 22px 60px rgba(74, 121, 154, 0.14)',
        float: '0 18px 40px rgba(72, 125, 158, 0.16)',
        soft: '0 10px 24px rgba(86, 131, 158, 0.12)',
      },
      fontFamily: {
        display: ['"Iowan Old Style"', '"Palatino Linotype"', 'Georgia', 'serif'],
        body: ['"Avenir Next"', '"Trebuchet MS"', '"Segoe UI"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
