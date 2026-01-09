/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
        colors: {
            primary: "#2E5C55", // Deep Teal/Green - more premium than the previous muted green
            secondary: "#C46D5E", // Terracotta - warm secondary
            background: "#F8F9FA", // Slate 50 - clean modern background
            card: "#FFFFFF",
            input: "#F1F5F9", // Slate 100
            teal: "#2CAEA6",
            "teal-light": "#E0F2F1",
            "green-light": "#E6F4EA",
            "text-primary": "#0F172A", // Slate 900 - sharp text
            "text-secondary": "#64748B", // Slate 500
        },
        fontFamily: {
            system: ['System', 'sans-serif'],
            modern: ['Avenir', 'Helvetica Neue', 'Roboto', 'sans-serif'],
        }
    },
  },
  plugins: [],
}
