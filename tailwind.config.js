/** @type {import('tailwindcss').Config} */
export default {
  // Short comment: Scans all TSX files in src to ensure Orchid colors generate
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}