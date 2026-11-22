/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:      '#0B0B0F',
        surface: '#121218',
        ink:     '#FFFFFF',
        muted:   '#A0A4B0',
        cyan:    '#0CE0E5',
        violet:  '#5B2EFF',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: { DEFAULT: '0px', none: '0px' },
    },
  },
  plugins: [],
}
