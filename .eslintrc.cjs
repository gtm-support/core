// @ts-check
const { defineConfig } = require('eslint-define-config');
const { readGitignoreFiles } = require('eslint-gitignore');

/// <reference types="@eslint-types/jsdoc" />
/// <reference types="@eslint-types/prettier" />
/// <reference types="@eslint-types/typescript-eslint" />

module.exports = defineConfig({
  ignorePatterns: [
    ...readGitignoreFiles(),
    '.eslintrc.cjs', // Skip self linting
  ],
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:jsdoc/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    warnOnUnsupportedTypeScriptVersion: false,
  },
  plugins: ['@typescript-eslint', 'prettier', 'jsdoc', 'spellcheck'],
  rules: {
    curly: ['error'],
    'linebreak-style': ['error', 'unix'],
    'no-case-declarations': 'warn',
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],

    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true },
    ],
    '@typescript-eslint/indent': [
      'error',
      2,
      { SwitchCase: 1, ignoredNodes: ['MemberExpression'] },
    ],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/member-ordering': 'warn',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      { prefer: 'type-imports' },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-parameter-properties': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'warn',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    '@typescript-eslint/prefer-readonly': ['warn'],
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/typedef': [
      'warn',
      { memberVariableDeclaration: true, variableDeclaration: true },
    ],

    'jsdoc/no-types': 'error',
    'jsdoc/require-param-type': 'off',
    'jsdoc/require-returns-type': 'off',
    'jsdoc/require-returns': 'off',
    'jsdoc/sort-tags': [
      'error',
      {
        tagSequence: [
          { tags: ['template'] },
          { tags: ['internal'] },
          { tags: ['param'] },
          { tags: ['returns'] },
          { tags: ['throws'] },
          { tags: ['see'] },
          { tags: ['example'] },
          { tags: ['since'] },
          { tags: ['default'] },
          { tags: ['deprecated'] },
        ],
      },
    ],
    'jsdoc/tag-lines': 'off',

    'spellcheck/spell-checker': [
      'warn',
      {
        minLength: 4,
        skipWords: [
          'googletagmanager',
          'jsdoc',
          'jsdom',
          'minify',
          'noninteraction',
          'nullish',
          'overridable',
          'vite',
          'vitest',
        ],
      },
    ],
  },
  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
  overrides: [
    {
      files: ['tests/**/*.ts'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        'jsdoc/require-jsdoc': 'off',
      },
    },
  ],
});
