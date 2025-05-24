/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,js,jsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { prata: ["Prata", "serif"], inter: ["Inter", "sans-serif"] },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
