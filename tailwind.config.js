/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'midnight': {
          50: '#f8f9ff',
          100: '#e0e7ff',
          200: '#c7d2ff',
          300: '#a5b4fd',
          400: '#8194fc',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#191970',
        },
        'story': {
          50: '#fdf7e2',
          100: '#faedc0',
          200: '#f7e49d',
          300: '#f5da7a',
          400: '#f2d057',
          500: '#ffc107',
          600: '#e6af06',
          700: '#b38705',
          800: '#805f03',
          900: '#4d3802',
        },
        'mystic': {
          50: '#f6f5fd',
          100: '#edebfb',
          200: '#d9d6f7',
          300: '#bdb7f0',
          400: '#9c91e7',
          500: '#7c6bde',
          600: '#6249d1',
          700: '#5238b4',
          800: '#432f91',
          900: '#362872',
          950: '#241748',
        },
      },
      fontFamily: {
        'serif': ['Merriweather', 'Garamond', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'paper': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'paper-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'paper-texture': "url('https://www.transparenttextures.com/patterns/paper.png')",
      },
    },
  },
  plugins: [],
};