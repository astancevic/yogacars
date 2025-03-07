// const defaultTheme = require('tailwindcss/defaultTheme');
//
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: ['class'],
//     content: [
//         './src/pages/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
//         './src/components/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
//         './src/templates/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'
//     ],
//     prefix: '',
//     theme: {
//         // container: {
//         //   center: true,
//         //   padding: "2rem",
//         //   screens: {
//         //     "2xl": "1400px",
//         //   },
//         // },
//         extend: {
//             fontFamily: {
//                 sans: ['Inter', ...defaultTheme.fontFamily.sans]
//             },
//             containers: {
//                 '8xl': '88rem',
//                 '9xl': '96rem',
//                 '10xl': '104rem'
//             },
//             screens: {
//                 '1xl': '1440px',
//                 '3xl': '1880px',
//                 '4xl': '2560px',
//                 '5xl': '3200px'
//             },
//             colors: {
//                 primary: {
//                     DEFAULT: '#00B543',
//                     50: '#e0ffec',
//                     100: '#b9f6cf',
//                     150: '#93edb3',
//                     200: '#72e49c',
//                     300: '#52db84',
//                     400: '#1cc85d',
//                     500: '#009f3b',
//                     600: '#008a33',
//                     700: '#00742b',
//                     800: '#025e23',
//                     900: '#00491a'
//                 },
//                 'pure-gray': {
//                     DEFAULT: '#1E1E1E',
//                     400: '#F2F5FB'
//                 },
//                 'teal-green': {
//                     DEFAULT: '#226b4a'
//                 },
//                 'action-text': '#000000a6'
//             },
//
//             fontSize: {
//                 '2xs': '10px',
//                 '3xs': '8px'
//             },
//
//             keyframes: {
//                 'accordion-down': {
//                     from: { height: '0' },
//                     to: { height: 'var(--radix-accordion-content-height)' }
//                 },
//                 'accordion-up': {
//                     from: { height: 'var(--radix-accordion-content-height)' },
//                     to: { height: '0' }
//                 },
//
//                 dropDownAnimation: {
//                     '0%': {
//                         transform: 'scaleY(0)'
//                     },
//                     '80%': {
//                         transform: 'scaleY(1.1)'
//                     },
//                     '100%': {
//                         transform: 'scaleY(1)'
//                     }
//                 },
//                 glimmer: {
//                     '0%': {
//                         left: '-100%'
//                     },
//                     '100%': {
//                         left: '150%'
//                     }
//                 }
//             },
//             animation: {
//                 'accordion-down': 'accordion-down 0.2s ease-out',
//                 'accordion-up': 'accordion-up 0.2s ease-out',
//                 spin2: 'spin 5s linear infinite',
//                 dropDownAnimation: 'dropDownAnimation .4s ease-in-out',
//                 glimmer: 'glimmer 2s infinite 1s'
//             },
//             cursor: {
//                 '360-view': 'url(/cursors/handCursor.png) 16 16, auto' // Adjust the path and hotspot as needed
//             }
//         }
//     },
//     corePlugins: {
//         aspectRatio: false
//     },
//     plugins: [
//         require('tailwindcss-animate'),
//         require('@tailwindcss/container-queries'),
//         require('@tailwindcss/forms'),
//         require('@tailwindcss/aspect-ratio')
//     ]
// };
// const defaultTheme = require('tailwindcss/defaultTheme');
//
// /** @type {import('tailwindcss').Config} */
// module.exports = {
//     darkMode: ['class'],
//     content: [
//         './src/pages/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
//         './src/components/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
//         './src/templates/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}'
//     ],
//     prefix: '',
//     theme: {
//         // container: {
//         //   center: true,
//         //   padding: "2rem",
//         //   screens: {
//         //     "2xl": "1400px",
//         //   },
//         // },
//         extend: {
//             fontFamily: {
//                 sans: ['Inter', ...defaultTheme.fontFamily.sans]
//             },
//             containers: {
//                 '8xl': '88rem',
//                 '9xl': '96rem',
//                 '10xl': '104rem'
//             },
//             screens: {
//                 '1xl': '1440px',
//                 '3xl': '1880px',
//                 '4xl': '2560px',
//                 '5xl': '3200px'
//             },
//             colors: {
//                 primary: {
//                     DEFAULT: '#00B543',
//                     50: '#e0ffec',
//                     100: '#b9f6cf',
//                     150: '#93edb3',
//                     200: '#72e49c',
//                     300: '#52db84',
//                     400: '#1cc85d',
//                     500: '#009f3b',
//                     600: '#008a33',
//                     700: '#00742b',
//                     800: '#025e23',
//                     900: '#00491a'
//                 },
//                 'pure-gray': {
//                     DEFAULT: '#1E1E1E',
//                     400: '#F2F5FB'
//                 },
//                 'teal-green': {
//                     DEFAULT: '#226b4a'
//                 },
//                 'action-text': '#000000a6'
//             },
//
//             fontSize: {
//                 '2xs': '10px',
//                 '3xs': '8px'
//             },
//
//             keyframes: {
//                 'accordion-down': {
//                     from: { height: '0' },
//                     to: { height: 'var(--radix-accordion-content-height)' }
//                 },
//                 'accordion-up': {
//                     from: { height: 'var(--radix-accordion-content-height)' },
//                     to: { height: '0' }
//                 },
//
//                 dropDownAnimation: {
//                     '0%': {
//                         transform: 'scaleY(0)'
//                     },
//                     '80%': {
//                         transform: 'scaleY(1.1)'
//                     },
//                     '100%': {
//                         transform: 'scaleY(1)'
//                     }
//                 },
//                 glimmer: {
//                     '0%': {
//                         left: '-100%'
//                     },
//                     '100%': {
//                         left: '150%'
//                     }
//                 }
//             },
//             animation: {
//                 'accordion-down': 'accordion-down 0.2s ease-out',
//                 'accordion-up': 'accordion-up 0.2s ease-out',
//                 spin2: 'spin 5s linear infinite',
//                 dropDownAnimation: 'dropDownAnimation .4s ease-in-out',
//                 glimmer: 'glimmer 2s infinite 1s'
//             },
//             cursor: {
//                 '360-view': 'url(/cursors/handCursor.png) 16 16, auto' // Adjust the path and hotspot as needed
//             }
//         }
//     },
//     corePlugins: {
//         aspectRatio: false
//     },
//     plugins: [
//         require('tailwindcss-animate'),
//         require('@tailwindcss/container-queries'),
//         require('@tailwindcss/forms'),
//         require('@tailwindcss/aspect-ratio')
//     ]
// };
