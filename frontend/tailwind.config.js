/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  jit: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      white: { DEFAULT: '#fff', transparent: 'rgba(255, 255, 255, 0.5)' },
      black: {
        DEFAULT: '#000',
        transparent: 'rgba(0,0,0,0.2)',
        20: '#0d0d0d',
        40: '#101110',
        60: '#121212',
        70: '#1b1b1b',
        80: '#19191B',
        100: '#1d1d1d',
      },
      current: 'currentColor',
      wiwynn: {
        blue: 'rgb(0,108,146)',
        green: 'rgb(142,211,0)',
      },
      table: {
        font: '#484a50',
        bg: '#f2f4f8',
        border: '#ebeff6',
        hover: '#f6f7facc',
      },
      blue: {
        DEFAULT: '#4171ff',
        dark: '#162848',
        gray: '#83879b',
        black: '#00090B',
      },
      green: {
        DEFAULT: '#06bcc1',
        bright: '#4bf330',
        dark: 'rgb(14,131,80)',
      },
      yellow: {
        DEFAULT: '#ffbe0b',
        dark: '#f6b500',
      },
      red: {
        DEFAULT: '#e5446d',
        bright: '#f33030',
        dark: '#a71e34',
      },
      light: {
        60: '#fdfdfd',
        80: '#ededed',
        100: '#ebebeb',
        120: '#eaeaea',
      },

      gray: {
        60: { DEFAULT: '#d8d8d8', transparent: 'rgba(216, 216, 216, 0.2)' },
        80: '#bbbbbb',
        100: '#a8aaae',
        120: '#999999',
        140: '#979797',
        160: '#808080',
        180: '#6f6f6f',
        200: '#666666',
        220: '#333333',
      },
    },
    screens: {
      ei: '800px',
      th: '1000px',
      ...defaultTheme.screens,
    },
    extend: {
      gridTemplateRows: {
        10: 'repeat(10, minmax(0, 1fr))',
        layout: '200px minmax(900px, 1fr) 100px',
      },
      gridRow: {
        'span-8': 'span 8 / span 8',
      },
      boxShadow: {
        'inner-2': 'inset 0px 0px 50px 0px #f0f0f0',
      },
      keyframes: {
        moveInBottom: {
          '0%': { opacity: 0, transform: 'translateY(100vh)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        moveOutBottom: {
          '0%': { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(100vh)' },
        },
      },
      animation: {
        moveInBottom: 'moveInBottom 0.5s ease-out;',
        moveOutBottom: 'moveOutBottom 0.5s ease-out backwards;',
      },
      backgroundImage: {
        dot: 'radial-gradient(#a8c3f1 8% transparent 0)',
      },
      backgroundSize: {
        dot: 'background-size: 1.5% 3%',
      },
    },
  },
  plugins: [],
};
