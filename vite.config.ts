import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  assetsInclude: [
    'assets/NVDA.bars.2025-08-15.csv',
    'assets/NVDA.bars.2025-08-22.csv',

  ],
})
