/** @type {import('tailwindcss').Config} */
const daisyui = require("daisyui");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Ensure JSX and TSX are included
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui], // ✅ Correct syntax for DaisyUI
  daisyui: {
    themes: [
      "valentine",
      "dark",
      "light",
      "cupcake",
      "synthwave",
      "corporate",
      "retro",
      "cyberpunk",
    ],
  },
};
