import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/.nyc_output/**'],
  },
  pluginJs.configs.recommended,
  prettierConfig,
  {
    files: ['app.js', 'eslint.config.js', 'node_backend/**/*.js', 'frontend/**/*.js', 'frontend/**/*.jsx'],
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
      jest: {
        version: 29,
      },
      'import/resolver': {
        alias: {
          map: [
            ['#app', './app.js'],
            ['#constants', './node_backend/constants'],
            ['#middleware', './node_backend/middleware'],
            ['#models', './node_backend/models'],
            ['#service', './node_backend/services'],
            ['#utils', './node_backend/utils'],
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
      'no-console': ['error', { allow: ['debug', 'info', 'warn', 'error'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'jest/no-conditional-expect': 'off',
    },
  },
];
