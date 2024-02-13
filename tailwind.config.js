const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {

      extend: {
        sky: colors.orange,
        teal: colors.teal,
        cyan: colors.cyan,
        rose: colors.rose,
      },
      // ... other color settings ...
      fontFamily: {
        heading: ['Segoe UI', 'sans-serif'],
        body: ['Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('tw-elements/dist/plugin'),
    require('@tailwindcss/line-clamp'),
  ],
};
