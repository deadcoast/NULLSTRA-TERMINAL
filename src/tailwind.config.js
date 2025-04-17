/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: '#000000',
          darkBg: '#0A0A0A',
          green: '#00FF00',
          brightGreen: '#90EE90',
          magenta: '#FF00FF',
          cyan: '#00FFFF',
          yellow: '#FFBF00',
          red: '#FF0000',
          white: '#FFFFFF',
        },
      },
      fontFamily: {
        'fraktion-mono': ['var(--font-fraktion-mono)', 'monospace'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'terminal-green': '0 0 5px rgba(0, 255, 0, 0.7)',
        'terminal-magenta': '0 0 5px rgba(255, 0, 255, 0.7)',
        'terminal-red': '0 0 5px rgba(255, 0, 0, 0.7)',
        'terminal-cyan': '0 0 5px rgba(0, 255, 255, 0.7)',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-5px, 2px)' },
          '66%': { transform: 'translate(5px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '33%': { opacity: 0.95 },
          '66%': { opacity: 0.98 },
        },
        typing: {
          from: { width: '0' },
          to: { width: '100%' },
        }
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        scanline: 'scanline 8s linear infinite',
        glitch: 'glitch 0.3s ease-in-out infinite',
        flicker: 'flicker 5s linear infinite',
        typing: 'typing 3.5s steps(40, end)',
      },
    },
  },
  plugins: [],
}