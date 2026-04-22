/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#f0f9f4",
          100: "#d9f0e3",
          200: "#b3e0c9",
          300: "#7dc9a8",
          400: "#48ad84",
          500: "#2a9169",
          600: "#1e7554",
          700: "#195e43",
          800: "#164b37",
          900: "#123d2d",
        },
        saffron: {
          400: "#f5a623",
          500: "#e8940d",
          600: "#c97d08",
        },
      },
      boxShadow: {
        card: "0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
        modal: "0 24px 80px rgba(0,0,0,0.18)",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
        "fade-in": "fadeIn 0.3s ease forwards",
        shimmer: "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(16px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
