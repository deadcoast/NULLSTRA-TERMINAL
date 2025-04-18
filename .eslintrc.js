// .eslintrc.js
module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser for TypeScript
  parserOptions: {
    ecmaVersion: 2021, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
    project: "./tsconfig.json", // Important: Point ESLint to your tsconfig.json
    // This allows rules that require type information
  },
  settings: {
    react: {
      version: "detect", // Tells eslint-plugin-react to automatically detect the React version
    },
    // Add resolver for import plugin
    "import/resolver": {
      typescript: {}, // This allows import plugin to resolve TypeScript imports
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
  env: {
    browser: true, // Enable browser global variables
    es2021: true, // Add ECMAScript 2021 globals and set ecmaVersion to 12
    node: true, // Enable Node.js global variables and Node.js scoping
    es6: true,
  },
  plugins: [
    "@typescript-eslint", // Plugin for TypeScript rules
    "react", // Plugin for React rules
    "react-hooks", // Plugin for React Hooks rules
    "jsx-a11y", // Plugin for JSX accessibility rules
    "prettier", // Runs Prettier as an ESLint rule
    "midaterminal", // Custom plugin for project-specific rules
    "import",
    // Must be the last plugin
  ],
  extends: [
    "eslint:recommended", // Base recommended ESLint rules
    "plugin:@typescript-eslint/recommended", // Recommended TypeScript rules
    // 'plugin:@typescript-eslint/recommended-requiring-type-checking', // Optional: More rules requiring type info (can be slower)
    "plugin:react/recommended", // Recommended React rules
    "plugin:react/jsx-runtime", // Adds support for the new JSX transform (React 17+)
    "plugin:react-hooks/recommended", // Recommended React Hooks rules
    "plugin:jsx-a11y/recommended", // Recommended accessibility rules
    "plugin:prettier/recommended", // **Crucial**: Enables eslint-plugin-prettier, integrates prettier checks as ESLint rules,
    // and extends eslint-config-prettier to disable conflicting ESLint formatting rules.
    // **Must be the last extension.**
  ],
  overrides: [
    {
      // JavaScript configuration files
      files: ["*.js", "*.cjs", "*.mjs"],
      excludedFiles: ["**/*.jsx", "**/*.tsx", "**/*.ts"],
      parser: "espree", // Use the default JavaScript parser
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: null, // Disable TypeScript for these files
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
  rules: {
    // --- Base ESLint Overrides ---
    "no-console": "off",
    "no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-prototype-builtins": "warn",
    "prefer-const": "warn",

    // --- TypeScript Overrides ---
    "@typescript-eslint/no-unused-vars": [
      // Prevent unused variables
      "warn",
      { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
    ],
    "@typescript-eslint/explicit-function-return-type": "off", // Allow functions without explicit return types (often inferred)
    "@typescript-eslint/explicit-module-boundary-types": "off", // Allow exported functions without explicit return/arg types
    "@typescript-eslint/no-explicit-any": "warn", // Warn on usage of 'any' type
    "@typescript-eslint/no-non-null-assertion": "warn", // Warn on non-null assertions (!)

    // --- React Overrides ---
    "react/prop-types": "off", // Disable prop-types rule, as TypeScript handles types
    "react/react-in-jsx-scope": "off", // Not needed with React 17+ new JSX transform
    "react/jsx-props-no-spreading": "off", // Allow prop spreading (e.g., {...props}) - adjust if needed
    "react/display-name": "warn", // Warn if components don't have a display name
    "react/jsx-pascal-case": "error", // Enforce PascalCase for component names

    // --- Newly Added Rules from CODE-QUALITY-TOOLS.md ---
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
        ],
        "newlines-between": "always",
      },
    ],
    "import/no-duplicates": "warn",

    // --- Custom midaterminal rules ---
    "midaterminal/prefer-terminal-import": "error",

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
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    ".eslintrc.js",
    "prettier.config.js",
    "postcss.config.js",
    "jest.config.js",
    "jest.setup.js",
    "vite.config.ts", // Example: ignore config files if needed
    // Add other generated files or folders
  ],
};
