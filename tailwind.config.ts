import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /**
       * Design token -> Tailwind mapping
       * Keep token names in sync with app/globals.css to preserve design-to-dev parity.
       */
      colors: {
        eki: {
          background: 'var(--color-primary-dark)',
          card: 'var(--color-primary-surface)',
          border: 'var(--color-primary-border)',
          copper: 'var(--color-accent-copper)',
          muted: 'var(--color-neutral-400)',
          text: 'var(--color-neutral-100)',
          'surface-alt': 'var(--color-neutral-900)',
        },
        status: {
          positive: 'var(--color-status-positive)',
          negative: 'var(--color-status-negative)',
          warning: 'var(--color-status-warning)',
          'warning-soft': 'var(--color-status-warning-soft)',
          'warning-border': 'var(--color-status-warning-border)',
        },
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        8: 'var(--space-8)',
        10: 'var(--space-10)',
      },
      fontSize: {
        sm: 'var(--font-size-sm)',
        base: 'var(--font-size-md)',
        xl: 'var(--font-size-lg)',
        '3xl': 'var(--font-size-xl)',
        '5xl': 'var(--font-size-2xl)',
      },
    },
  },
  plugins: [],
};

export default config;
