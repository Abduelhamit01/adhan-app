export default {
  theme: {
      extend: {
          animation: {
              'twinkle': 'twinkle 1.5s infinite ease-in-out',
          },
          keyframes: {
              twinkle: {
                  '0%, 100%': { opacity: 0 },
                  '50%': { opacity: 1 },
              }
          }
      }
  }
}