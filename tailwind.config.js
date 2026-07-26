/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#22c55e',
          hover:   '#16a34a',
          muted:   '#86efac',
        },
        loopback: {
          DEFAULT: '#f87171',
        },
        surface: {
          dark:  'rgba(15, 15, 15, 0.6)',
          light: 'rgba(255, 255, 255, 0.6)',
        },
        border: {
          dark:  'rgba(255, 255, 255, 0.08)',
          light: 'rgba(0, 0, 0, 0.08)',
        },
        canvasBg: {
          dark:  '#0a0a0a',
          light: '#f5f5f5',
        },
        dot: {
          dark:  'rgba(255, 255, 255, 0.06)',
          light: 'rgba(0, 0, 0, 0.06)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
