module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      margin: {
        floatingr: '0 0 0 calc(50% - 1px)',
      },
      minHeight: {
        520: '520px',
      },
      maxHeight: {
        640: '640px',
      },
      colors: {
        primary: {
          light: '#ffebee',
          DEFAULT: '#ffcdd2',
          dark: '#ef9a9a',
        },
        secondary: {
          light: '#e0f2f1',
          DEFAULT: '#b2dfdb',
          dark: '#80cbc4',
        },
        black: {
          'op-3': 'rgba(0,0,0,0.3)',
          'op-5': 'rgba(0,0,0,0.5)',
          'op-7': 'rgba(0,0,0,0.7)',
        },
      },
      borderRadius: {
        50: '50%',
      },
      keyframes: {
        run: {
          '0%': {
            right: '-20px',
            bottom: '-7px',
          },
          '100%': {
            right: '100%',
            bottom: '-7px',
          },
        },
      },
      animation: {
        running: 'run 30s ease-in-out infinite, bounce 1s ease-in-out infinite',
      },
      backgroundImage: theme => ({
        'rabbit-turtle': "url('/images/background.png')",
      }),
      maxWidth: {
        '2/3': '66%',
      },
    },
  },
  variants: {
    extend: {
      animation: ['hover', 'focus'],
    },
  },
  plugins: [],
};
