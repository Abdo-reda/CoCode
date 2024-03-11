/* eslint-disable prettier/prettier */
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    '@electron-toolkit',
    '@electron-toolkit/eslint-config-ts/eslint-recommended',
    '@vue/eslint-config-typescript/recommended',
  ],
  ignorePatterns: ['node_modules/**', '**/dist/**'],
  rules: {
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
