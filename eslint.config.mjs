import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      // MongoDB shell playground script, not React — react-hooks rules
      // false-positive on its top-level `use('db')` call.
      'playground-1.mongodb.js',
    ],
  },
  ...coreWebVitals,
  ...nextTypescript,
  {
    // Legacy-code tolerance. The TypeScript sources were never linted before
    // the ESLint 9 flat-config migration (ESLint 8 `eslint .` only enumerated
    // .js files), and the react-hooks v7 React-Compiler rules are new. Keep
    // these visible as warnings without failing CI's zero-errors gate;
    // correctness rules (rules-of-hooks, prefer-const) stay errors.
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/refs': 'warn',
    },
  },
];

export default eslintConfig;
