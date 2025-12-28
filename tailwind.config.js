/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#544F7D",
                secondary: "#FFCB50",
            },
            backgroundImage: {
                'premium-gradient': 'linear-gradient(95deg, #544F7D, #FFCB50)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
