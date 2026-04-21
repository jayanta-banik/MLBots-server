import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import jest from 'eslint-plugin-jest';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/.nyc_output/**'],
  },
  prettierConfig,
  {
    files: ['app.js', 'app_http.js', 'eslint.config.js', 'node_backend/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        Intl: 'readonly',
      },
      sourceType: 'module',
      ecmaVersion: 2020,
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
      ...js.configs.recommended.rules,
      ...jest.configs.recommended.rules,
      'arrow-body-style': ['error', 'as-needed'],
      'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      complexity: ['warn', 20],
      'eol-last': ['warn', 'always'],
      eqeqeq: 'error',
      indent: ['warn', 2, { SwitchCase: 1 }],
      'keyword-spacing': 'warn',
      'import/no-unresolved': ['error', { ignore: ['^#'] }],
      'import/no-named-as-default': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent']],
          pathGroups: [{ pattern: '@mui/**', group: 'internal', position: 'after' }],
          pathGroupsExcludedImportTypes: ['@mui/**'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'jest/no-conditional-expect': 'off',
      'no-console': ['error', { allow: ['debug', 'info', 'warn', 'error'] }],
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
      'no-prototype-builtins': 'off',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unsafe-optional-chaining': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true, varsIgnorePattern: '^_' }],
      'object-curly-spacing': ['warn', 'always'],
      'object-shorthand': ['warn', 'properties'],
      quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'space-before-blocks': 'warn',
      'space-infix-ops': 'warn',
    },
  },
  {
    files: ['frontend/**/*.js', 'frontend/**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'arrow-body-style': ['error', 'as-needed'],
      'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
      complexity: ['warn', 20],
      'eol-last': ['warn', 'always'],
      eqeqeq: 'error',
      indent: ['warn', 2, { SwitchCase: 1 }],
      'jsx-quotes': ['warn', 'prefer-double'],
      'keyword-spacing': 'warn',
      'import/no-named-as-default': 'off',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent']],
          pathGroups: [{ pattern: '@mui/**', group: 'internal', position: 'after' }],
          pathGroupsExcludedImportTypes: ['@mui/**'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'no-console': ['error', { allow: ['debug', 'info', 'warn', 'error'] }],
      'no-multi-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 0 }],
      'no-prototype-builtins': 'off',
      'no-unneeded-ternary': ['error', { defaultAssignment: false }],
      'no-unsafe-optional-chaining': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true, varsIgnorePattern: '^_' }],
      'object-curly-spacing': ['warn', 'always'],
      'object-shorthand': ['warn', 'properties'],
      quotes: ['warn', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      'react-hooks/exhaustive-deps': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-tag-spacing': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      semi: ['error', 'always'],
      'space-before-blocks': 'warn',
      'space-infix-ops': 'warn',
    },
  },
];
