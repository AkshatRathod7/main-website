/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080808",
        foreground: "#F5F2EC",
        gold: {
          DEFAULT: "#C9A84C",
          dim: "#8A6E2F",
        },
        accent: "#C9A84C", // Map accent to gold for compatibility
        surface: "#141414",
        border: "#1e1e1e",
        muted: "#888880",
      },
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        heading: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Inter", "system-ui", "sans-serif"],
        logo: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-.02em",
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
        'marquee-slow': 'marquee 80s linear infinite',
        'marquee-slow-reverse': 'marquee-reverse 80s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
