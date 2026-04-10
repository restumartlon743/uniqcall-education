/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A0E27",
          light: "#151B3B",
          medium: "#1E2548",
        },
        electric: {
          purple: "#8B5CF6",
          "purple-light": "#A855F7",
          cyan: "#06B6D4",
          "cyan-light": "#22D3EE",
        },
        accent: {
          gold: "#F59E0B",
          red: "#EF4444",
          magenta: "#EC4899",
        },
      },
    },
  },
  plugins: [],
};
