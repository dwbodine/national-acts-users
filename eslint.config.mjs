import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

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
      "no-nested-ternary": "off",
      "no-ternary": "off",      
      "no-undef-init": "off",
      "no-undefined": "off",      
      "one-var": "off",
      "prefer-named-capture-group": "off",
      "radix": "off",
      "require-unicode-regexp": "off",
    }
  }
];

export default eslintConfig;