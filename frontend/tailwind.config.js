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
        transparent: '#a9d6e5',
        exlight: '#e2eafc',
      },
      green: {
        DEFAULT: '#06bcc1',
        transparent: '#d0efb1',
        bright: '#4bf330',
        dark: 'rgb(14,131,80)',
        black: '#283618',
      },
      yellow: {
        DEFAULT: '#ffbe0b',
        transparent: '#f4de90',
        dark: '#f6b500',
      },
      red: {
        DEFAULT: '#e5446d',
        bright: '#f33030',
        dark: '#a71e34',
        transparent: 'rgba(217,107,135,0.6)',
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
      zi: { raw: '(max-height: 800px) and (min-width:1024px)' },
      gi: { raw: '(min-height:800px) and (max-height: 2000px) and (min-width:1024px)' },
      ei: '800px',
      th: '1000px',
      status: '1200px',
      ...defaultTheme.screens,
    },
    extend: {
      fill: (theme) => theme('colors'),
      gridTemplateRows: {
        10: 'repeat(10, minmax(0, 1fr))',
        layout: '200px minmax(900px, 1fr) 100px',
      },
      gridRow: {
        'span-8': 'span 8 / span 8',
      },
      matrix3d: {
        1: { transform: 'matrix3d(1, 0, 0, 0, 0, .6, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)' },
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
        bounceY: {
          '0%': {
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            transform: 'translate(22%, -10%)',
          },
          '50%': {
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            transform: 'translate(0)',
          },
          '100%': {
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            transform: 'translate(22%, -10%)',
          },
        },
        bounceZ: {
          '0%': {
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            transform: 'translate(26%, 17%)',
          },
          '50%': {
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
            transform: 'translate(0)',
          },
          '100%': {
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
            transform: 'translate(26%, 17%)',
          },
        },
        shake: {
          '0%': {
            transform: 'translate(3px, 0)',
          },
          '50%': {
            transform: 'translate(-3px, 0)',
          },
          '100%': {
            transform: 'translate(0, 0)',
          },
        },
        spinLeft: {
          from: {
            transform: 'rotate(0deg)',
          },
          to: {
            transform: 'rotate(-360deg)',
          },
        },
      },
      animation: {
        moveInBottom: 'moveInBottom 0.5s ease-out;',
        moveOutBottom: 'moveOutBottom 0.5s ease-out backwards;',
        bounceY: 'bounceY 1s infinite;',
        bounceZ: 'bounceZ 1s infinite;',
        shake: 'shake 150ms 2 linear',
        spinLeft: 'spinLeft 1s linear infinite;',
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
