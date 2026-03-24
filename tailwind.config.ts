import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#14532D',
        'brand-light': '#DCFCE7',
        'brand-muted': '#22C55E',
        surface: '#FFFFFF',
        'surface-subtle': '#F8FAFC',
        'surface-muted': '#F1F5F9',
        'surface-strong': '#E2E8F0',
        border: '#E2E8F0',
        'text-base': '#0F172A',
        'text-muted': '#64748B',
        'text-secondary': '#334155',
        danger: '#B91C1C',
        'danger-light': '#FEE2E2',
        info: '#0369A1',
        'score-positive-bg': '#F0FDF4',
        'score-positive-text': '#166534',
        'score-positive-border': '#BBF7D0',
        'score-neutral-bg': '#F1F5F9',
        'score-neutral-text': '#475569',
        'score-neutral-border': '#CBD5E1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['"Instrument Sans"', 'sans-serif'],
        body: ['Geist', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0',
        DEFAULT: '2px',
        sm: '2px',
        md: '4px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
    },
  },
  plugins: [forms],
} satisfies Config
