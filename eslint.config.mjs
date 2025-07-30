import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import nextPlugin from '@next/eslint-plugin-next';
import react19UpgradePlugin from 'eslint-plugin-react-19-upgrade';
import globals from 'globals';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const eslintConfig = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    plugins: {
      react: reactPlugin,
      'react-hooks': hooksPlugin,
      '@next/next': nextPlugin,
      'react-19-upgrade': react19UpgradePlugin,
    },
    rules: {
      // General React rules
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off', // Turn off if using TypeScript or not using propTypes

      // React Hooks rules
      ...hooksPlugin.configs.recommended.rules,

      // Next.js specific rules
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React 19 upgrade specific rules
      'react-19-upgrade/no-default-props': 'error',
      'react-19-upgrade/no-prop-types': 'warn',
      'react-19-upgrade/no-legacy-context': 'error',
      'react-19-upgrade/no-string-refs': 'error',
      'react-19-upgrade/no-factories': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: ['.next/*', 'node_modules/'],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript')
];

export default eslintConfig;
