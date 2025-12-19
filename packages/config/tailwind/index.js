/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },
      spacing: {
        18: "4.5rem",
        88: "22rem",
        128: "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        "medium": "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        "strong": "0 10px 40px -10px rgba(0, 0, 0, 0.2)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            color: "#374151",
            a: {
              color: "#2563eb",
              "&:hover": {
                color: "#1d4ed8",
              },
            },
            strong: {
              color: "#111827",
              fontWeight: "600",
            },
            "h1, h2, h3, h4": {
              color: "#111827",
              fontWeight: "700",
            },
            code: {
              color: "#111827",
              backgroundColor: "#f3f4f6",
              padding: "0.25rem 0.5rem",
              borderRadius: "0.25rem",
              fontWeight: "500",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
    },
  },
};


