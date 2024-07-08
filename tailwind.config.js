import flowbite from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
  ],

  darkMode: 'media',

  safelist: [
    'w-64',
    'w-1/2',
    'rounded-l-lg',
    'rounded-r-lg',
    'bg-gray-200',
    'grid-cols-4',
    'grid-cols-7',
    'h-6',
    'leading-6',
    'h-9',
    'leading-9',
    'shadow-lg'
  ],


  theme: {
    extend: {},
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    colors: {
      'navy': '#070F2B',
      'light-navy': '#1B1A55',
    },
  },
  plugins: [flowbite],
}
