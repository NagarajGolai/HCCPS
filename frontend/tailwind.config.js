/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        'pro-bg': {
          50: '#f8fafc',
          900: '#0f172a',
        },
        'pro-blue': {
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
        },
        'pro-green': {
          400: '#4ade80',
          500: '#22c55e',
        },
        'pro-gold': {
          400: '#facc15',
        },
        'pro-text': {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
        },
      },
      boxShadow: {
        'pro-soft': '0 4px 20px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
        'pro-lift': '0 10px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(59,130,246,0.1)',
        'pro-glow': '0 0 25px rgba(59,130,246,0.5)',
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'lift': 'lift 0.3s ease-out',
        'glow': 'glow 0.5s ease-in-out infinite alternate',
      },
      keyframes: {
        lift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-2px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(59,130,246,0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(59,130,246,0.6)' },
        },
      },
    },
  },
  plugins: [],
}

