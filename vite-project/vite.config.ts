/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/tests/**',          // Playwrightテストを除外
      '**/tests-examples/**', // Playwrightサンプルを除外
      '**/*.spec.ts',         // .specファイルを除外
    ],
  },
})
