/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "background": "url('../public/images/protruding-squares.png')",
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}
