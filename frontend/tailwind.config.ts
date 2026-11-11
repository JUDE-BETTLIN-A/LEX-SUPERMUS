import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#14243a',
          dark: '#0b192c',
        },
        gold: {
          DEFAULT: '#c2a66b',
        },
        ivory: {
          DEFAULT: '#f5f3ee',
        },
        ink: {
          DEFAULT: '#18263a',
        },
        muted: {
          DEFAULT: '#647084',
        },
        line: {
          DEFAULT: '#e6e0d5',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
