import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        primary: {
          50: '#FDF6F2',
          100: '#FAE8E0',
          200: '#F2CCC0',
          300: '#E8B09F',
          400: '#DE937E',
          500: '#D4765D',
          600: '#C85A3A',
          700: '#A84A2E',
          800: '#883A22',
          900: '#682A16',
        },
        secondary: {
          50: '#F7FAFB',
          100: '#EBF0F0',
          200: '#D9DDD8',
          300: '#C7CBC0',
          400: '#B5B9A8',
          500: '#A3A791',
          600: '#9DB4A6',
          700: '#7D9489',
          800: '#5D746C',
          900: '#3D544F',
        },
        accent: {
          50: '#FCF8F6',
          100: '#F3E2D5',
          200: '#E8CCB6',
          300: '#DDB697',
          400: '#D2A078',
          500: '#C78A59',
          600: '#BC743A',
          700: '#9E5F31',
          800: '#804A28',
          900: '#62351F',
        },
        neutral: {
          50: '#F5F1E8',
          100: '#EBE5D9',
          200: '#D9CCAF',
          300: '#C7B385',
          400: '#B5995B',
          500: '#A38031',
          600: '#8B6F2A',
          700: '#735D23',
          800: '#5B4B1C',
          900: '#433915',
        },
        dark: {
          50: '#3E2723',
          100: '#5D4037',
          200: '#795548',
          300: '#A1887F',
          400: '#C0A080',
          500: '#D7CCC8',
          600: '#EFEBE9',
          700: '#FAFAFA',
          800: '#FFFFFF',
          900: '#F5F1E8',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
        sans: ['Source Sans Pro', ...defaultTheme.fontFamily.sans],
        grotesque: ['Hanken Grotesque', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-in': {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        'slide-out': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-in',
        'slide-in': 'slide-in 0.3s ease-out',
        'slide-out': 'slide-out 0.3s ease-in',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
