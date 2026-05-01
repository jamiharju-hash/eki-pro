import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        eki: {
          background: '#2B2B2B',
          card: '#343434',
          border: '#444444',
          copper: '#B66E3F',
        },
      },
    },
  },
  plugins: [],
};

export default config;
