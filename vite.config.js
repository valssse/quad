import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' para que el build funcione en GitHub Pages (subcarpeta del repo)
export default defineConfig({
  plugins: [react()],
  base: './',
})
