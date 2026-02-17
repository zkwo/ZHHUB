/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: "#0a0a0a",
        glass: "rgba(255, 255, 255, 0.03)",
      },
    },
  },
  plugins: [],
};
