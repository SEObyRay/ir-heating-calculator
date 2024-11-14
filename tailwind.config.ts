import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#E55C03',
        'primary-dark': '#d45503',
        'secondary': '#4a4a4a',
        'light-gray': '#F0F0F0',
        'border-gray': '#e2e2e2',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-primary',
    'bg-primary-dark',
    'text-primary',
    'text-secondary',
    'bg-light-gray',
    'border-border-gray',
    'hover:bg-primary-dark',
    'hover:bg-primary',
    'focus:ring-primary',
  ]
}

export default config
