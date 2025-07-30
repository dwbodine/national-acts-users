import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const eslintConfig = [
  ...new FlatCompat({ baseDirectory: import.meta.dirname, }).extends('next', 'prettier'),
  ...tseslint.config(eslint.configs.all, tseslint.configs.strict),
  {
    rules: {
      "complexity": "off",
      "id-length": "off",
      "max-lines": "off",
      "max-lines-per-function": "off",
      "max-params": "off",
      "max-statements": "off",
      "no-magic-numbers": "off",
      "no-ternary": "off",
      "no-undefined": "off",
      "one-var": "off",
      "radix": "off",
    }
  }
];

export default eslintConfig;