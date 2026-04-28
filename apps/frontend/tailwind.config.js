/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: '#1a1a2e',
        'sidebar-hover': '#16213e',
        surface: '#0f3460',
        accent: '#533483',
        'accent-light': '#7b52ab',
      }
    }
  },
  plugins: []
};
