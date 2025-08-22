import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/livetape-ui/',
  assetsInclude: ['assets/2025-08-15-updates.csv'],
})
