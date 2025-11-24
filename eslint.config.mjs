// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default defineConfig([
  // -----------------------------------------------------
  // 1) Global parser + language settings
  // -----------------------------------------------------
  {
    files: ['**/*.{js,cjs,mjs,ts,tsx,jsx}'],
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'out/**', 'public/**'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        projectService: true, // modern TS-aware mode
        project: undefined, // prevents ESLint conflict
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // -----------------------------------------------------
  // 2) JavaScript recommended
  // -----------------------------------------------------
  js.configs.recommended,

  // -----------------------------------------------------
  // 3) TypeScript recommended (type-aware)
  // -----------------------------------------------------
  ...tseslint.configs.recommendedTypeChecked,

  // -----------------------------------------------------
  // 4) Next.js + Import plugin + Prettier
  // -----------------------------------------------------
  {
    files: ['**/*.{js,cjs,mjs,ts,tsx,jsx}'],

    plugins: {
      import: importPlugin,
      '@next/next': nextPlugin,
    },

    settings: {
      // absolute import support (Next.js + TS)
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
        node: {
          extensions: ['.js', '.ts', '.tsx'],
        },
      },
    },

    rules: {
      // ---------------------------------------------------
      // Imports
      // ---------------------------------------------------
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',

      // ---------------------------------------------------
      // Next.js rules (includes images, links, fonts, etc.)
      // ---------------------------------------------------
      ...nextPlugin.configs.recommended.rules,

      // ---------------------------------------------------
      // Your chosen rule overrides
      // ---------------------------------------------------
      complexity: 'off',
      'id-length': 'off',
      'max-depth': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-params': 'off',
      'max-statements': 'off',
      'no-continue': 'off',
      'no-magic-numbers': 'off',
      'no-nested-ternary': 'off',
      'no-ternary': 'off',
      'no-undef-init': 'off',
      'no-undefined': 'off',
      'one-var': 'off',
      'prefer-named-capture-group': 'off',
      radix: 'off',
      'require-unicode-regexp': 'off',
    },
  },

  // -----------------------------------------------------
  // 5) Ignore patterns
  // -----------------------------------------------------
  {
    ignores: [
      '.next/**',
      'public/**',
      'out/**',
      'node_modules/**',
      'next.config.js',
      'next-env.d.ts',
      'eslint.config.mjs',
      'tsconfig.json',
    ],
  },
]);
