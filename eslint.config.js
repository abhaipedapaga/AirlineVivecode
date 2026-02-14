import js from '@eslint/js';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import prettierConfig from 'eslint-config-prettier';
import cypress from 'eslint-plugin-cypress';


export default [
  js.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // ✅ THIS FIXES “Unexpected token <”
        },
      },
    },
    plugins: {
      react,
      'react-hooks': hooks,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...hooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'import/order': ['warn', { 'newlines-between': 'always' }],
    },
    files: ['cypress/**/*.{js,jsx,ts,tsx}', '**/*.cy.{js,jsx,ts,tsx}'],
  plugins: { cypress },
  languageOptions: {
    globals: {
      ...globals.browser,
      ...cypress.environments.globals.globals,
    },
  }
  
  },
];
