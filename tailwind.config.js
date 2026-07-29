/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', '"Courier New"', "monospace"],
      },
      colors: {
        cyber: {
          bg: "#0b0f19",
          card: "rgba(15, 23, 42, 0.6)",
          border: "rgba(6, 182, 212, 0.4)",
          glow: "#22d3ee",
        },
      },
      boxShadow: {
        neon: "0 0 15px rgba(6, 182, 212, 0.4)",
        "neon-lg": "0 0 30px rgba(6, 182, 212, 0.6)",
      },
    },
  },
  plugins: [],
};
