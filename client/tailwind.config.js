/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "black-p": "#000000",
        black: "#010019",
        orange: "#FF4D0C",
      },
    },
  },
  plugins: [],
};
