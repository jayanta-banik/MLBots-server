import js from '@eslint/js';
import * as importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default [
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/coverage/**', '**/.nyc_output/**'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      import: importPlugin,
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
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
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-tag-spacing': 'warn',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/react-in-jsx-scope': 'off',
      semi: ['error', 'always'],
      'space-before-blocks': 'warn',
      'space-infix-ops': 'warn',
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
    },
  },
];
