// eslint.config.mjs
import { defineConfig } from 'eslint/config';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';

export default defineConfig([
  // -----------------------------------------------------
  // 1) Global parser settings (must come first)
  // -----------------------------------------------------
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // -----------------------------------------------------
  // 2) JS recommended
  // -----------------------------------------------------
  js.configs.all,

  // -----------------------------------------------------
  // 3) TS recommended (type-checked)
  // -----------------------------------------------------
  ...tseslint.configs.recommendedTypeChecked,

  // -----------------------------------------------------
  // 4) Next.js + Prettier + your rules
  // -----------------------------------------------------
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],

    plugins: {
      import: importPlugin,
      '@next/next': nextPlugin,
    },

    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      // Missing imports / unresolved modules
      'import/no-unresolved': 'off',
      'import/named': 'error',
      'import/default': 'error',
      'import/namespace': 'error',

      // Next rules
      ...nextPlugin.configs.recommended.rules,

      // Your overrides
      complexity: 'off',
      'dot-notation': 'off',
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
      'no-void': 'off',
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
    ],
  },
]);
