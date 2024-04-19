/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';
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
                'txt-primary': colors.neutral[50],
                'txt-secondary': colors.neutral[200],
                'txt-tertiary': colors.neutral[300],
                'border-primary': colors.neutral[600],
                'bg-primary': colors.neutral[800],
                'bg-secondary': colors.neutral[950],
                'bg-tertiary': colors.neutral[700],
                'btn-bg': 'black',
                'btn-bg-hover': 'white',
                'btn-txt-hover': colors.neutral[900]
            },
            backgroundImage: {
                'main-bg-image': "url('/res/chat_bubble_pattern.png')"
            }
        },
    },
    plugins: [],
}