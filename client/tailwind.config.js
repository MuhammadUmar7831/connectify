/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "black-p": "#000000",
        black: "#010019",
        orange: "#FF4D0C",
        "orange-100": "#ff6b36",
        gray: "#EEEEEE",
        "gray-100": "#F6F6F6", // backgorund for the app
        "gray-200": "#BABABA", // gray color for text and borders
        "gray-300": "#8696A0", // gray color for prominent text
      },
    },
  },
  plugins: [],
};
