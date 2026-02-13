import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No tailwind import needed here anymore
export default defineConfig({
  plugins: [react()],
})