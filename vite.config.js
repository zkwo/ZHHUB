import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Pastikan menggunakan export default langsung tanpa variabel tambahan
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  }
})
