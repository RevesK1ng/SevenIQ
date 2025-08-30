import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/*.setup.*',
        '**/coverage/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/public/**',
        '**/scripts/**',
        '**/start-*.bat',
        '**/start-*.ps1',
        '**/setup.bat',
        '**/*.md',
        '**/env.example',
        '**/database-schema.sql'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000,
    teardownTimeout: 10000,
    maxConcurrency: 5,
    minThreads: 1,
    maxThreads: 4,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true
      }
    },
    reporters: ['verbose', 'html'],
    outputFile: {
      html: './tests/coverage/index.html'
    },
    include: [
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],
    exclude: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      'coverage/**',
      '**/*.config.*',
      '**/*.setup.*'
    ]
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
      '@/types': path.resolve(__dirname, './types'),
      '@/tests': path.resolve(__dirname, './tests')
    }
  },
  define: {
    'process.env.NODE_ENV': '"test"',
    'process.env.NEXT_PUBLIC_SITE_URL': '"http://localhost:3000"',
    'process.env.NEXT_PUBLIC_SUPABASE_URL': '"http://localhost:54321"',
    'process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': '"test-key"',
    'process.env.STRIPE_SECRET_KEY': '"sk_test_test"',
    'process.env.STRIPE_WEBHOOK_SECRET': '"whsec_test"',
    'process.env.OPENAI_API_KEY': '"sk-test"'
  }
})
