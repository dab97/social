import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Дисплейный шрифт для крупных заголовков (кириллический Bebas Neue Pro)
        display: ['"Bebas Neue Pro"', '"Bebas Neue"', 'Oswald', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Верхняя ступень шкалы: герой h1 на десктопе (text-display)
        display: ['4.5rem', { lineHeight: '1.05' }],
      },
      backgroundImage: {
        // Единственный фирменный градиент из брендбука: navy Pantone 2758 C -> royal Pantone 286 C
        'rgsu-brand': 'linear-gradient(90deg, #082567 0%, #102FA1 100%)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        rgsu: {
          navy: '#082567',      // Тёмно-синий логотипа (Pantone 2758 C)
          royal: '#102FA1',     // Основной синий / Royal Blue (Pantone 286 C)
          ice: '#D5E4F4',       // Ледяной пастельный (Pantone 656 U)
          ruby: '#A91917',      // Фирменный рубин (Pantone 7627 C)
        },
      },
      borderRadius: {
        '3xl': '1.5rem', // 24px
        '2xl': '1rem',   // 16px
        'xl': '0.75rem', // 12px
        'lg': '0.5rem',  // 8px
        'md': 'calc(var(--radius) - 2px)',
        'sm': 'calc(var(--radius) - 4px)'
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'apple-hover': '0 2px 4px 0 rgba(15, 23, 42, 0.02), 0 8px 16px -2px rgba(15, 23, 42, 0.06), 0 16px 32px -4px rgba(15, 23, 42, 0.04)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
