/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      gray_border: "#DFDFDF",
      color_accent: "#A1DDEB",
      color_text_gray: "#BDBDBD",
      color_text_ocean: "#1086A6",
      ocean_border: "#1283A8",
    },
    textColor: {
      ocean: "#1086A6",
    },
  },
  plugins: [],
};
