// eslint.config.mjs
import js from '@eslint/js';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import nextPlugin from '@next/eslint-plugin-next';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  ...tseslint.config(eslint.configs.recommended, tseslint.configs.strict),
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      'prettier/prettier': 'warn',

      // your overrides
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
  {
    ignores: [
      '.next/**',
      'public/**',
      'out/**',
      'node_modules/**',
      'next.config.js',
      'next-env.d.ts',
    ],
  },
];
