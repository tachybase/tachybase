import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import jestDom from 'eslint-plugin-jest-dom';
import prettier from 'eslint-plugin-prettier';
import promise from 'eslint-plugin-promise';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import globals from 'globals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules',
      '**/lib',
      '**/dist',
      '**/build',
      '**/coverage',
      '**/expected',
      '**/website',
      '**/gh-pages',
      '**/weex',
      '**/build.ts',
      'packages/vue',
      'packages/element',
      '**/esm',
      '**/doc-site',
      '**/public',
      'packages/*/*/client.d.ts',
      'packages/*/*/server.d.ts',
      'packages/*/*/client.js',
      'packages/*/*/server.js',
      'packages/core/build',
      'packages/core/devtools',
      'packages/core/database/src/sql-parser/index.js',
      '**/.dumi/tmp',
      '**/.dumi/tmp-test',
      '**/.dumi/tmp-production',
      'apps/cli/templates/plugin/src/client/*.tpl',
      'packages/app/client/src/.plugins',
      '**/docker',
      '**/storage',
      '**/benchmark',
      'packages/core/cli/src',
      'packages/core/cli/bin',
      // TODO
      'apps/app/client/.umirc.ts',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:promise/recommended',
      'plugin:prettier/recommended',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      prettier: fixupPluginRules(prettier),
      promise: fixupPluginRules(promise),
      'jest-dom': jestDom,
      'testing-library': testingLibrary,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2020,
        ...globals.browser,
        sleep: true,
        prettyFormat: true,
      },

      parser: tsParser,
      ecmaVersion: 11,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: './tsconfig.json',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/ban-types': 'off',
      'no-unused-vars': 'off',
      'no-useless-catch': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',
      'no-explicit-any': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'promise/always-return': 'off',
    },
  },
  {
    files: ['**/e2e/**/*.{ts,js,tsx,jsx}', '**/__e2e__/**/*.{ts,js,tsx,jsx}'],

    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
  {
    files: ['packages/plugins/@hera/**/*.{ts,js,tsx,jsx}', 'packages/plugins/@hera/**/*.{ts,js,tsx,jsx}'],

    rules: {
      eqeqeq: ['error', 'smart'],
    },
  },
];
