# Code Quality Tools Implementation

## Overview

This document outlines the code quality tools and processes to be implemented to prevent code duplication, ensure consistent code style, and maintain a clean codebase.

## ESLint Configuration

### Core Rules

Add the following rules to `.eslintrc.js`:

```javascript
module.exports = {
  // ... existing config
  rules: {
    // Prevent unused imports and variables
    "no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "after-used",
        ignoreRestSiblings: true,
      },
    ],

    // Enforce import order
    "import/order": [
      "error",
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
        alphabetize: { order: "asc", caseInsensitive: true },
      },
    ],

    // Prevent duplicate imports
    "import/no-duplicates": "error",

    // Enforce naming conventions
    "react/jsx-pascal-case": "error",

    // ... other rules
  },
};
```

### Custom Rules

Create a custom ESLint plugin for project-specific rules:

```javascript
// eslint-plugin-midaterminal/rules/prefer-terminal-import.js
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce using terminal components from the barrel export",
      category: "Best Practices",
      recommended: true,
    },
    fixable: "code",
  },
  create(context) {
    return {
      ImportDeclaration(node) {
        // Check if importing directly from Terminal component files
        if (
          node.source.value.includes("/components/Terminal/") &&
          !node.source.value.endsWith("/index")
        ) {
          context.report({
            node,
            message: "Import Terminal components from the barrel export",
            fix(fixer) {
              return fixer.replaceText(
                node.source,
                "'../../components/Terminal'",
              );
            },
          });
        }
      },
    };
  },
};
```

## Bundle Size Monitoring

### Webpack Bundle Analyzer

Set up webpack-bundle-analyzer in the Next.js configuration:

```javascript
// next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer({
  // existing config
});
```

### Size Limits

Add size limit checks to the build process:

```javascript
// package.json
{
  "scripts": {
    "size": "size-limit",
    "analyze": "size-limit --why"
  },
  "size-limit": [
    {
      "path": ".next/static/chunks/*.js",
      "limit": "200 kB"
    }
  ],
  "devDependencies": {
    "@size-limit/preset-app": "^8.0.0",
    "size-limit": "^8.0.0"
  }
}
```

## Pre-commit Hooks

### Husky Setup

```bash
# Install husky
npm install --save-dev husky lint-staged

# Configure husky
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

### Lint-staged Configuration

```javascript
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Dependency Analysis

### Depcheck Integration

```bash
# Install depcheck
npm install --save-dev depcheck

# Add script
npm set-script depcheck "depcheck --ignores=\"@types/*,eslint*,*-loader\""
```

### Circular Dependency Detection

```bash
# Install madge
npm install --save-dev madge

# Add script
npm set-script circular "madge --circular src/"
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/code-quality.yml
name: Code Quality

on:
  push:
    branches: [main, development]
  pull_request:
    branches: [main, development]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: "npm"
      - run: npm ci
      - run: npm run lint

  circular:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: "npm"
      - run: npm ci
      - run: npm run circular

  bundle-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "16"
          cache: "npm"
      - run: npm ci
      - run: npm run size
```

## VSCode Integration

### Recommended Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "stylelint.vscode-stylelint",
    "wix.vscode-import-cost"
  ]
}
```

### Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Implementation Steps

1. **ESLint Configuration**
   - Update `.eslintrc.js` with new rules
   - Create custom plugin for project-specific rules
2. **Bundle Analysis**
   - Set up webpack-bundle-analyzer
   - Add size-limit checks
3. **Git Hooks**
   - Install and configure husky
   - Set up lint-staged
4. **CI/CD Integration**
   - Create GitHub Actions workflows
   - Add bundle size checks to CI pipeline
5. **Documentation**
   - Update README with code quality processes
   - Document ESLint rules
6. **Developer Tooling**
   - Configure VSCode settings
   - Add recommended extensions

## Benefits

1. **Early Detection**: Catch issues during development before they reach production
2. **Consistent Code Style**: Maintain consistent patterns across the codebase
3. **Prevent Regressions**: Avoid reintroducing previously fixed issues
4. **Bundle Size Management**: Keep application performance optimal by monitoring bundle size
5. **Automated Checks**: Reduce manual code reviews for style and quality issues
