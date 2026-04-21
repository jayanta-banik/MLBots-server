import pluginJs from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/.nyc_output/**'],
  },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        Intl: 'readonly',
      },
      sourceType: 'module',
      ecmaVersion: 'latest',
    },
    plugins: {
      jest,
      import: importPlugin,
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['#app', './app.js'],
            ['#constants', './utils/constants.js'],
            ['#sentry', './sentry.js'],

            ['#datasources', './datasources'],
            ['#lambdas', './lambdas'],
            ['#middleware', './middleware'],
            ['#mjml', './mjml'],
            ['#models', './models'],
            ['#prisma', './prisma'],
            ['#services', './services'],
            ['#utils', './utils'],
          ],
          extensions: ['.js', '.jsx'],
        },
        node: {
          extensions: ['.js', '.jsx'],
        },
      },
    },
    rules: {
      ...jest.configs.recommended.rules,
      'import/no-unresolved': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-console': ['error', { allow: ['debug', 'info', 'warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'jest/no-conditional-expect': 'off',
    },
  },
];
