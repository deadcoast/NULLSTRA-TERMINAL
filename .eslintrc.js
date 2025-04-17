// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: './tsconfig.json', // Important: Point ESLint to your tsconfig.json
    // This allows rules that require type information
  },
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the React version
    },
  },
  env: {
    browser: true, // Enable browser global variables
    es2021: true, // Add ECMAScript 2021 globals and set ecmaVersion to 12
    node: true, // Enable Node.js global variables and Node.js scoping
  },
  plugins: [
    '@typescript-eslint', // Plugin for TypeScript rules
    'react', // Plugin for React rules
    'react-hooks', // Plugin for React Hooks rules
    'jsx-a11y', // Plugin for JSX accessibility rules
    'prettier', // Runs Prettier as an ESLint rule
    // Must be the last plugin
  ],
  extends: [
    'eslint:recommended', // Base recommended ESLint rules
    'plugin:@typescript-eslint/recommended', // Recommended TypeScript rules
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // Optional: More rules requiring type info (can be slower)
    'plugin:react/recommended', // Recommended React rules
    'plugin:react/jsx-runtime', // Adds support for the new JSX transform (React 17+)
    'plugin:react-hooks/recommended', // Recommended React Hooks rules
    'plugin:jsx-a11y/recommended', // Recommended accessibility rules
    'plugin:prettier/recommended', // **Crucial**: Enables eslint-plugin-prettier, integrates prettier checks as ESLint rules,
    // and extends eslint-config-prettier to disable conflicting ESLint formatting rules.
    // **Must be the last extension.**
  ],
  rules: {
    // --- Base ESLint Overrides ---
    'no-console': ['warn', { allow: ['warn', 'error'] }], // Warn about console.log, but allow warn/error
    'no-unused-vars': 'off', // Disable base rule, use TypeScript version below

    // --- TypeScript Overrides ---
    '@typescript-eslint/no-unused-vars': [
      // Prevent unused variables
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off', // Allow functions without explicit return types (often inferred)
    '@typescript-eslint/explicit-module-boundary-types': 'off', // Allow exported functions without explicit return/arg types
    '@typescript-eslint/no-explicit-any': 'warn', // Warn on usage of 'any' type
    '@typescript-eslint/no-non-null-assertion': 'warn', // Warn on non-null assertions (!)

    // --- React Overrides ---
    'react/prop-types': 'off', // Disable prop-types rule, as TypeScript handles types
    'react/react-in-jsx-scope': 'off', // Not needed with React 17+ new JSX transform
    'react/jsx-props-no-spreading': 'off', // Allow prop spreading (e.g., {...props}) - adjust if needed
    'react/display-name': 'warn', // Warn if components don't have a display name

    // --- React Hooks Overrides ---
    // (Defaults from recommended are usually good)

    // --- JSX A11y Overrides ---
    // (Defaults from recommended are usually good, customize as needed)
    // Example: 'jsx-a11y/anchor-is-valid': 'off', // If using a router link component

    // --- Prettier Overrides ---
    // This rule is handled by `plugin:prettier/recommended`
    // 'prettier/prettier': ['error', {}, { usePrettierrc: true }],

    // --- Add your own custom rules here ---
  },
  ignorePatterns: [
    // Files/folders to ignore
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    '.eslintrc.js',
    'prettier.config.js',
    'vite.config.ts', // Example: ignore config files if needed
    // Add other generated files or folders
  ],
};
