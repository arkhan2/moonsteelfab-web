import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        steel: {
          50: "#f3f6f9",
          100: "#e7edf4",
          200: "#cfdce9",
          300: "#a6c0d6",
          400: "#6f97bc",
          500: "#4d77a1",
          600: "#3a5e83",
          700: "#2f4c69",
          800: "#2a4057",
          900: "#253648"
        }
      }
    }
  },
  plugins: []
} satisfies Config;

