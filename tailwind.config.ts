import type { Config } from 'tailwindcss';
const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: 'var(--color-cream)',
        peach: 'var(--color-peach)',
        sand: 'var(--color-sand)',
        terracotta: {
          DEFAULT: 'var(--color-terracotta)',
          deep: 'var(--color-terracotta-deep)',
          hover: 'var(--color-terracotta-hover)',
        },
        ink: 'var(--color-ink)',
        olive: 'var(--color-olive)',
        error: 'var(--color-error)',
      },
      borderRadius: {
        img: 'var(--radius-img)', // 18px para fotos de productos
        card: 'var(--radius-card)', // 28px para tarjetas de producto
        pill: 'var(--radius-pill)', // 9999px para botones y pastillas
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
