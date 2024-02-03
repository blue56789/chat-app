/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                nunito: ['Nunito', ...defaultTheme.fontFamily.sans]
            },
            colors: {
                'txt-primary': 'white',
                'txt-secondary': colors.neutral[300],
                'txt-tertiary': colors.neutral[500],
                'border-primary': colors.neutral[700],
                'bg-primary': 'black',
                'bg-secondary': colors.neutral[900],
                'bg-tertiary': colors.neutral[700],
            }
        },
    },
    plugins: [],
}