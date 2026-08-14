import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    include: ['tests/components/**/*.test.{ts,tsx}', 'tests/backend/**/*.test.{ts,tsx}', 'src/components/**/*.test.{ts,tsx}', 'src/app/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', 'tests/**/*.spec.ts']
  }
})
