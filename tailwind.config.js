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
        canvas: 'var(--bg-canvas)',
        grid: 'var(--bg-dot-grid)',
        // Group A: diagram nodes
        node: 'var(--node-bg)',
        // Group B: UI chrome (sidebar, controls, minimap)
        chrome: 'var(--chrome-bg)',
        text: {
          primary: 'var(--text-primary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          DEFAULT: 'var(--accent-primary)',
          success: 'var(--accent-success)',
          error: 'var(--accent-error)',
          info: 'var(--accent-info)',
        },
        connector: {
          line: 'var(--connector-line)',
          active: 'var(--connector-active)',
        },
      },
      borderColor: {
        // Group A: diagram node borders
        node: 'var(--node-border)',
        // Group B: chrome borders
        chrome: 'var(--chrome-border)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'],
        serif: ['var(--font-serif)', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
