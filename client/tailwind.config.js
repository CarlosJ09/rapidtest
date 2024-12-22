/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d5c63",
        secondary: "#374151",
        acent: "#78CDD7",
        darkAcent: "#44A1A0",
        surface: "#fffffa",
        success: "#5cb85c",
        danger: "#DC3545",
        warning: "#f0ad4e",
        info: "#5bc0de",
      },
    },
  },
  plugins: [],
};
