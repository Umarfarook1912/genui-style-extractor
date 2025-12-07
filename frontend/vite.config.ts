import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  base: './',  // Use relative paths for assets in build output
  build: {
    outDir: '../sigma-package/app',   // ⬅ important for Sigma
    emptyOutDir: true
  }
})
