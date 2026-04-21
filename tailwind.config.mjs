/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#e6a510',
          hover: '#c98e0d',
        },
        navy: {
          DEFAULT: '#1A2B3C',
          light: '#243A4D',
        },
        light: '#F9F7F4',
        text: '#2C2C2C',
        border: '#E2DFD8',
      },
      fontFamily: {
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      maxWidth: {
        container: '1280px',
      },
      borderRadius: {
        DEFAULT: '10px',
        lg: '20px',
      },
      boxShadow: {
        gold: '0 4px 15px rgba(230, 165, 16, 0.35)',
        'gold-hover': '0 6px 25px rgba(230, 165, 16, 0.45)',
      },
    },
  },
  plugins: [],
};
