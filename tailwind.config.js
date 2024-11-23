/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'signup-bg': "url('./src/assets/background.jpg')",
      },
    },
  },
  plugins: [],
}
