import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.spec.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.vue', 'src/**/*.ts']
    }
  }
}) 