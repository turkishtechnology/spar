import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import docusaurusPlugin from '@docusaurus/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      'no-unused-vars': 'off', // Disabled to avoid conflicting with TypeScript
      // TypeScript rules (only the ones currently available)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      // General JavaScript rules
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // Rules specific to TypeScript files
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // Disable no-undef in TypeScript files
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
      },
    },
    rules: {
      // Disable no-undef for Jest globals in test files
      'no-undef': 'off',
    },
  },
  // Docusaurus-specific configuration (docs app only)
  {
    files: ['apps/docs/**/*.{js,jsx,ts,tsx,md,mdx}'],
    plugins: {
      '@docusaurus': docusaurusPlugin,
    },
    languageOptions: {
      globals: {
        // Browser globals used by Docusaurus
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
      },
    },
    rules: {
      // Recommended Docusaurus rules
      '@docusaurus/string-literal-i18n-messages': 'error',
      '@docusaurus/no-untranslated-text': [
        'warn',
        {
          ignoredStrings: ['·', '—', '×', '→', '←', '↑', '↓', ', ', ',', ', and '],
        },
      ],
      '@docusaurus/no-html-links': 'error',
      '@docusaurus/prefer-docusaurus-heading': 'warn',

      // Allow console in docs
      'no-console': 'off',
      // Be more flexible in config files
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  prettierConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      '.next/**',
      '.turbo/**',
      'coverage/**',
      '*.config.js',
      '*.config.ts',
      // Generated Docusaurus files
      'apps/docs/.docusaurus/**',
      'apps/docs/build/**',
    ],
  },
];
