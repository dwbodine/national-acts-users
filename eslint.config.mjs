import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';

const eslintConfig = [
  ...new FlatCompat({ baseDirectory: import.meta.dirname, }).extends('next', 'prettier'),
  ...tseslint.config(eslint.configs.all, tseslint.configs.strict),
  {
    rules: {
      "max-statements": "off",
      "radix": "off",
      "one-var": "off",
      "max-lines-per-function": "off",
      "no-magic-numbers": "off",
      "no-ternary": "off",
      "id-length": "off",
      "no-undefined": "off",
    }
  }
];

export default eslintConfig;