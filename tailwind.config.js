module.exports = {
  mode: 'jit',
  purge: [
    './views/**/*.ejs',
    './frondend-js/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
