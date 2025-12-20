import type { Config } from "tailwindcss";
import nukleoConfig from "@nukleo/tailwind-config";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ...(nukleoConfig.theme?.extend || {}),
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
          light: "var(--primary-light)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        // Nukleo Brand Colors (direct access)
        nukleo: {
          purple: "#523DC9",
          violet: "#5F2B75",
          dark: "#291919",
          crimson: "#6B1817",
          lavender: "#A7A2CF",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Space Grotesk', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        'aurora': 'linear-gradient(135deg, #523DC9 0%, #5F2B75 100%)',
        'aurora-full': 'linear-gradient(135deg, #523DC9 0%, #5F2B75 50%, #6B1817 100%)',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(82, 61, 201, 0.3)',
        'glow-primary-dark': '0 0 30px rgba(107, 93, 211, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
