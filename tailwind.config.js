import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'sans-serif'],
        tech: ['Orbitron', 'Inter', 'sans-serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      colors: {
        tech: {
          bg: '#01060f',
          panel: 'rgba(7, 18, 36, 0.95)',
          primary: '#00f3ff',
          // border: 'rgba(0, 243, 255, 0.25)',
          border: 'rgba(0, 243, 255, 0.25)',
          alert: '#ff2a55',
          warning: '#ffb300',
          info: '#3b82f6',
          success: '#00e676',
          pinRed: '#ef4444',
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({});
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
