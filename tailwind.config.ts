import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vintage: {
          paper: '#f4f1e8',
          sepia: '#d4c5a9',
          brown: '#8b6f47',
          dark: '#5c4a37',
          accent: '#c9a961',
          ink: '#3d3024',
          highlight: '#e8dcc4',
          success: '#5a7a4a',
          error: '#8b4545',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        typewriter: ['Courier New', 'monospace'],
        vintage: ['var(--font-vintage)', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.5rem', { lineHeight: '1.15' }],
        'display-sm': ['1.75rem', { lineHeight: '1.2' }],
      },
      boxShadow: {
        vintage: '4px 4px 0px 0px rgba(92, 74, 55, 1)',
        'vintage-sm': '2px 2px 0px 0px rgba(92, 74, 55, 1)',
        'vintage-lg': '6px 6px 0px 0px rgba(92, 74, 55, 1)',
        'vintage-soft': '0 12px 40px -8px rgba(61, 48, 36, 0.25)',
        polaroid: '0 4px 20px rgba(61, 48, 36, 0.15), 6px 6px 0 0 rgba(92, 74, 55, 1)',
      },
      borderRadius: {
        vintage: '2px',
        polaroid: '1px',
      },
      transitionTimingFunction: {
        vintage: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      animation: {
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'paper-texture': "url('/textures/paper-texture.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
