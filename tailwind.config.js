const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      // ... other color settings ...
      fontFamily: {
        heading: ['Segoe UI', 'sans-serif'],
        body: ['Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [
    // ... your plugins ...
  ],
};
