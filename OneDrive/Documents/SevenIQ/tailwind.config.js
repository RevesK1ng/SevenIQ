/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0077FF', // Base primary color
          25: '#f0f7ff',
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0077FF', // Electric blue
          600: '#005fcc',
          700: '#004799',
          800: '#002f66',
          900: '#001733',
        },
        secondary: {
          DEFAULT: '#64748b', // Base secondary color
          50: '#F7F9FC', // Light mode background
          100: '#eef1f5',
          200: '#dde3ea',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#1F2937', // Light mode text
        },
        dark: {
          DEFAULT: '#0B0E14', // Base dark color
          50: '#1a1d26',
          100: '#121723', // Surface cards
          200: '#0f141f',
          300: '#0d111a',
          400: '#0a0e16',
          500: '#0B0E14', // True dark background
          600: '#080a0f',
          700: '#050709',
          800: '#030405',
          900: '#010203',
        },
        surface: {
          DEFAULT: '#ffffff', // Base surface color
          50: '#ffffff', // Light mode surface
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#334155',
          900: '#121723', // Dark mode surface
        },
        text: {
          DEFAULT: '#1F2937', // Base text color
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#E6EAF2', // Dark mode text (high contrast)
        },
        accent: {
          DEFAULT: '#FF6B6B', // Base accent color
          50: '#fff5f5',
          100: '#ffe3e3',
          200: '#ffc9c9',
          300: '#ffa8a8',
          400: '#ff8787',
          500: '#FF6B6B', // Coral
          600: '#fa5252',
          700: '#e03131',
          800: '#c92a2a',
          900: '#862e2e',
        },
        success: {
          DEFAULT: '#22C55E', // Base success color
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22C55E', // Success green
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          DEFAULT: '#F59E0B', // Base warning color
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#F59E0B', // Warning amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          DEFAULT: '#EF4444', // Base error color
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#EF4444', // Error red
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        border: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          DEFAULT: '#e2e8f0', // Default border color
        },
        background: {
          DEFAULT: '#ffffff', // Default background color
          50: '#ffffff',
          100: '#f8fafc',
          200: '#f1f5f9',
          300: '#e2e8f0',
          400: '#cbd5e1',
          500: '#94a3b8',
          600: '#64748b',
          700: '#475569',
          800: '#334155',
          900: '#0f172a',
        },
        card: {
          DEFAULT: '#ffffff', // Card background
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        },
        placeholder: {
          DEFAULT: '#94a3b8',
          muted: '#94a3b8',
          primary: '#64748b',
          secondary: '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Source Sans Pro', 'Roboto', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'system-ui', 'sans-serif'],
        body: ['Source Sans Pro', 'Roboto', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }], // 1.5 line-height
        'lg': ['18px', { lineHeight: '28px' }],
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }], // Mobile heading
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['40px', { lineHeight: '48px' }], // Desktop heading
        '5xl': ['48px', { lineHeight: '56px' }],
        '6xl': ['60px', { lineHeight: '64px' }],
      },
      fontWeight: {
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      spacing: {
        '18': '4.5rem', // 72px
        '88': '22rem', // 352px
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '10px', // Updated to match design system
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'elevation-2': '0 1px 4px rgba(0, 0, 0, 0.1)', // Cards
        'elevation-3': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'elevation-4': '0 10px 15px rgba(0, 0, 0, 0.1)',
        'elevation-5': '0 20px 25px rgba(0, 0, 0, 0.1)',
        'glassy': '0 10px 30px rgba(0,0,0,.25)', // Glassy elevation
        'hairline': '0 0 0 1px rgba(255,255,255,.08)', // Hairline borders
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out', // Updated to match design system
        'slide-in': 'slideIn 300ms ease-out', // Updated to match design system
        'scale-up': 'scaleUp 110ms ease', // Button hover
        'scale-down': 'scaleDown 95ms ease', // Button press
        'lift': 'lift 200ms ease', // Card hover
        'pulse-color': 'pulseColor 300ms ease', // Mode switch animation
        'shimmer': 'shimmer 1.5s linear infinite', // Skeleton loader
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        scaleDown: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.95)' },
        },
        lift: {
          '0%': { transform: 'translateY(0)', boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)' },
          '100%': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' },
        },
        pulseColor: {
          '0%': { backgroundColor: 'currentColor' },
          '50%': { backgroundColor: 'rgba(255, 107, 107, 0.8)' },
          '100%': { backgroundColor: 'currentColor' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      transitionProperty: {
        'all': 'all',
        'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
        'transform': 'transform',
        'shadow': 'box-shadow',
      },
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '110': '110ms', // Button hover
        '200': '200ms',
        '300': '300ms',
      },
              transitionTimingFunction: {
          'ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
          'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
          'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
        },
        scale: {
          '80': '0.8',
          '90': '0.9',
          '95': '0.95',
          '98': '0.98',
          '102': '1.02',
          '105': '1.05',
        },
        ringOpacity: {
          '20': '0.2',
        },
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px', // Sticky nav blur
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}
