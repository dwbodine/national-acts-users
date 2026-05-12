import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    clearMocks: true,
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    mockReset: true,
    restoreMocks: true,
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reportsDirectory: './coverage',
      reporter: ['text', 'text-summary', 'json-summary', 'html', 'lcov'],
      skipFull: true,
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/.next/**',
        '**/coverage/**',
        'src/Css/**',
        'src/Sass/**',
        'src/**/*.stories.{ts,tsx}',
      ],
    },
  },
});
