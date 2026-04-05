/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0E17',
        card: '#111827',
        'card-hover': '#1a2235',
        border: '#1f2d45',
        accent: '#F59E0B',
        success: '#10B981',
        danger: '#EF4444',
        info: '#3B82F6',
        text: '#F1F5F9',
        'text-muted': '#64748B',
      }
    },
  },
  plugins: [],
}
