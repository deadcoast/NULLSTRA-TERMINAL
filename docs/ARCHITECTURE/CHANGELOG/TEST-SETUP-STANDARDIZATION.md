# Test Setup and Mock Standardization

## Overview

This document outlines the plan to standardize test setup and mock implementations across the project, addressing the issues identified in the Duplicate and Unused Code Audit.

## Current Issues with Test Setup

1. **Duplicate mock implementations**:

   - Each test file reimplements similar mocks
   - No shared patterns for common mocks like `ThemeContext`, `Socket`, and UI components

2. **Inconsistent setup patterns**:

   - Some tests use direct component mocking
   - Others use more complex mock implementations
   - No standard approach for common testing scenarios

3. **Setup fragmentation**:
   - Setup code is spread across `jest.setup.js` and `src/setupTests.ts`
   - No clear separation of concerns between these files

## Standardization Approach

### 1. Create Shared Test Utilities

Create a dedicated `src/test-utils` directory containing:

```
src/test-utils/
├── index.ts             # Exports all utilities
├── renderWithTheme.tsx  # Render components with ThemeContext
├── mockSocket.ts        # Socket.io mock implementation
├── mockComponents.tsx   # Common component mocks
└── testHelpers.ts       # Other common test utilities
```

### 2. Implement Standard Rendering Helper

```typescript
// src/test-utils/renderWithTheme.tsx
import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from '../context/ThemeContext';

// Custom render that includes ThemeProvider
const renderWithTheme = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { themeProps?: any }
) => {
  const { themeProps = { theme: 'dark', setTheme: jest.fn() }, ...renderOptions } = options || {};

  return render(
    <ThemeProvider {...themeProps}>
      {ui}
    </ThemeProvider>,
    renderOptions
  );
};

export default renderWithTheme;
```

### 3. Create Socket.io Mock Implementation

```typescript
// src/test-utils/mockSocket.ts
export const createMockSocket = (customHandlers = {}) => {
  return {
    isConnected: true,
    isExecuting: false,
    commandResults: [],
    commandHistory: ["ls", "cd /home", 'echo "test"'],
    error: null,
    executeCommand: jest.fn(),
    getCommandHistory: jest.fn(),
    getAvailableCommands: jest.fn().mockResolvedValue(["ls", "cd", "echo"]),
    clearResults: jest.fn(),
    ...customHandlers,
  };
};

export const mockUseSocket = () => {
  jest.mock("../../hooks/useSocket", () => ({
    useSocket: jest.fn(() => createMockSocket()),
  }));
};
```

### 4. Common Component Mocks

```typescript
// src/test-utils/mockComponents.tsx
import React from 'react';

export const createMockComponent = (name: string) => {
  const Component = ({ children, ...props }: any) => (
    <div data-testid={`mock-${name}`} {...props}>
      {children}
    </div>
  );
  return Component;
};

// Common component mocks
export const mockTerminalComponents = () => {
  jest.mock('../components/Terminal/TerminalHeader', () =>
    createMockComponent('terminal-header'));

  jest.mock('../components/Terminal/TerminalOutput', () =>
    createMockComponent('terminal-output'));

  jest.mock('../components/Terminal/TerminalPrompt', () =>
    createMockComponent('terminal-prompt'));

  jest.mock('../components/Terminal/TerminalStatusLine', () =>
    createMockComponent('terminal-status-line'));
};
```

### 5. Setup Files Reorganization

Consolidate and reorganize setup files:

**jest.setup.js**:

- Keep global mocks (IntersectionObserver, matchMedia)
- Import testing-library extensions
- Set up global Jest configuration

**src/setupTests.ts**:

- TypeScript type definitions
- Testing-library type extensions
- Import shared test utilities

## Implementation Plan

### Phase 1: Create Test Utilities

1. Create the `src/test-utils` directory structure
2. Implement the core utilities:
   - `renderWithTheme.tsx`
   - `mockSocket.ts`
   - `mockComponents.tsx`
   - `testHelpers.ts`
   - `index.ts`

### Phase 2: Refactor Existing Tests

For each test file:

1. Replace direct mocks with shared utilities
2. Use `renderWithTheme` instead of direct ThemeContext mocking
3. Use shared socket mocks instead of custom implementations
4. Use shared component mocks instead of local mocks

### Phase 3: Update Setup Files

1. Review and reorganize `jest.setup.js`
2. Update `src/setupTests.ts` to import shared utilities
3. Update Jest configuration if needed

### Phase 4: Documentation

1. Add comments to test utility files
2. Create usage examples
3. Update test standardization documentation

## Benefits of Standardization

1. **Reduced code duplication**:

   - No more copy-pasted mock implementations
   - Centralized logic for common testing patterns

2. **Improved maintainability**:

   - Changes to components require updates in one place
   - Consistent patterns make tests easier to understand and modify

3. **Increased test reliability**:

   - Standard mocks ensure consistent behavior across tests
   - Reduced chance of test-specific bugs

4. **Better developer experience**:
   - Less boilerplate code in tests
   - Clear patterns for testing new components

## Example: Refactored Test

Before:

```tsx
// Before refactoring
import { render } from "@testing-library/react";
import Terminal from "../Terminal";

jest.mock("../../TerminalHeader", () => () => (
  <div data-testid="mock-header">Header</div>
));
jest.mock("../../TerminalOutput", () => () => (
  <div data-testid="mock-output">Output</div>
));
jest.mock("../../../hooks/useSocket", () => ({
  useSocket: () => ({
    isConnected: true,
    executeCommand: jest.fn(),
    // ...other properties
  }),
}));

describe("Terminal", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<Terminal />);
    expect(getByTestId("terminal")).toBeInTheDocument();
  });
});
```

After:

```tsx
// After refactoring
import { screen } from "@testing-library/react";
import { renderWithTheme } from "../../../test-utils";
import { mockTerminalComponents } from "../../../test-utils/mockComponents";
import { mockUseSocket } from "../../../test-utils/mockSocket";
import Terminal from "../Terminal";

// Set up mocks
mockTerminalComponents();
mockUseSocket();

describe("Terminal", () => {
  it("renders correctly", () => {
    renderWithTheme(<Terminal />);
    expect(screen.getByTestId("terminal")).toBeInTheDocument();
  });
});
```
