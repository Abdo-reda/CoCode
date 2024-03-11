/* eslint-disable prettier/prettier */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'eslint:essential',
    'plugin:vue/vue3-essential',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-essential',
    '@vue/eslint-config-typescript/essential',
    '@vue/eslint-config-prettier'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
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
