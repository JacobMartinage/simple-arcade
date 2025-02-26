import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/simple-arcade/',
  plugins: [
    tailwindcss(),
    react(),
  ],
})