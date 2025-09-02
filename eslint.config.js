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
      // TypeScript kuralları (sadece mevcut olanlar)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-var-requires': 'error',

      // Genel JavaScript kuralları
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'prefer-const': 'error',
      'no-var': 'error',

      // Prettier entegrasyonu
      'prettier/prettier': 'error',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // TypeScript dosyaları için özel kurallar
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // TypeScript dosyalarında no-undef kapalı
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
      // Test dosyalarında jest global'leri için no-undef kapalı
      'no-undef': 'off',
    },
  },
  // Docusaurus özel konfigürasyonu (sadece docs app için)
  {
    files: ['apps/docs/**/*.{js,jsx,ts,tsx,md,mdx}'],
    plugins: {
      '@docusaurus': docusaurusPlugin,
    },
    languageOptions: {
      globals: {
        // Docusaurus için browser global'leri
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
      // Docusaurus önerilen kuralları
      '@docusaurus/string-literal-i18n-messages': 'error',
      '@docusaurus/no-untranslated-text': [
        'warn',
        {
          ignoredStrings: ['·', '—', '×', '→', '←', '↑', '↓'],
        },
      ],
      '@docusaurus/no-html-links': 'error',
      '@docusaurus/prefer-docusaurus-heading': 'warn',

      // Docs'ta console izinli
      'no-console': 'off',
      // Config dosyaları için daha esnek
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
      // Docusaurus generate edilmiş dosyalar
      'apps/docs/.docusaurus/**',
      'apps/docs/build/**',
    ],
  },
];
