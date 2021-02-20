module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      margin: {
        floatingr: "0 0 0 calc(50% - 1px)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
