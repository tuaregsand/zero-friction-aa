import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  {
    languageOptions: { parserOptions: { ecmaVersion: 2022, sourceType: 'module' } },
    ignores: ['dist/**', 'out/**', '*.config.*', '.next/**', 'vendor-chunks/**'],
  },
  prettier,
];
