/* eslint-disable prettier/prettier */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
    '@vue/eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['node_modules/**', '**/dist/**'],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'semi': ['error', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'quotes': [
      'warn',
      'single',
      {
        'avoidEscape': true,
      },
    ],
  },
};
