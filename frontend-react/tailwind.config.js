/** @type {import('tailwindcss').Config} */
// Paleta clara del design system de PrácticaPE (Stitch "costeña luminosa").
// Fuente de los valores: frontend/static/js/tailwind-config.js.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#FAF9F4',
        surface: '#FFFFFF',
        'surface-elevated': '#F1EFE6',
        'surface-container': '#EBEFEB',
        'surface-container-low': '#F0F5F1',
        'surface-container-high': '#E5E9E6',
        ink: '#14201B',
        muted: '#5A6B63',
        cyan: '#0E7C66',          // acento principal (herencia de nombre)
        violet: '#0A5C4D',        // acento profundo (herencia de nombre)
        primary: '#0E7C66',
        'primary-container': '#D7F0E7',
        accent: '#E8A13A',
        border: '#E3E0D5',
        'outline-variant': '#BDC9C4',
        error: '#C0392B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        lg: '1rem',
        xl: '1.25rem',
        full: '9999px',
      },
    },
  },
  plugins: [],
}
