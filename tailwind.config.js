/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#F8FBFF",
                card: "#FFFFFF",
                primary: "#2D6CDF",  // Medical Blue
                "primary-light": "#EAF4FF",
                success: "#2E7D32",
                warning: "#F9A825",
                emergency: "#D32F2F",
                "text-primary": "#1E293B",
                "text-secondary": "#64748B",
                border: "#E2E8F0",
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'soft': '0 4px 12px rgba(0,0,0,0.04)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 4s ease-in-out infinite',
                'fade-in': 'fadeIn 0.8s ease-out forwards',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px #2D6CDF' },
                    '100%': { boxShadow: '0 0 20px #2D6CDF, 0 0 10px #ffffff' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-12px)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        },
    },
    plugins: [],
}
