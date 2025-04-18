# Test File Standardization Plan

## Overview

This document outlines the plan to standardize test file structure across the project, addressing the issues identified in the Duplicate and Unused Code Audit.

## Current Test File Structure Issues

1. Inconsistent test file organization:

   - Some components use the `__tests__` directory structure
   - Others use co-located test files
   - Many components have `.early.test` files/directories alongside regular test files

2. Test file naming inconsistency:
   - `.early.test.tsx` vs `.test.tsx`
   - Duplicate test logic spread across multiple files

## Standardization Approach

### 1. Test Directory Structure

We will standardize on using the `__tests__` directory structure for all component tests:

- Place test files in a `__tests__` directory adjacent to the component being tested
- Group related test files together in the same directory
- Remove any test files directly co-located with components

### 2. Test File Naming Convention

All test files will follow these naming conventions:

- Use `.test.tsx` suffix for React component tests
- Use `.test.ts` suffix for utility and hook tests
- Remove all instances of `.early.test` naming

### 3. Test File Consolidation Process

For each component with both `.early.test` and regular test files:

1. Analyze both test files to identify unique and overlapping test cases
2. Create a new consolidated test file in the `__tests__` directory
3. Merge all test cases, removing duplications
4. Update imports to use consistent relative paths
5. Verify the consolidated tests pass
6. Remove the original separate test files

## Implementation Plan

### Phase 1: TerminalManager Tests (Completed)

- [x] Consolidated `TerminalManager.early.test` with `TerminalManager.test.tsx`
- [x] Verified all tests pass
- [x] Removed redundant test files

### Phase 2: Terminal UI Component Tests

- [ ] Consolidate the following test files:
  - [ ] `TerminalButton.early.test` → `TerminalButton.test.tsx`
  - [ ] `TerminalFileList.early.test` → `TerminalFileList.test.tsx`
  - [ ] `TerminalStatusLine.early.test` → `TerminalStatusLine.test.tsx`
  - [ ] `TerminalDialog.early.test` → `TerminalDialog.test.tsx`
  - [ ] `TerminalOutputLine.early.test` → `TerminalOutputLine.test.tsx`
  - [ ] `FileViewer/formatFileInfo.early.test` → `FileViewer.test.tsx`
  - [ ] `TerminalWindow.early.test` → `TerminalWindow.test.tsx`
  - [ ] `TerminalPrompt.early.test` → `TerminalPrompt.test.tsx`

### Phase 3: Utility and Hook Tests

- [ ] Standardize tests for utility functions
- [ ] Standardize tests for hooks
- [ ] Ensure consistent mocking patterns across all tests

### Phase 4: Test Utilities and Helpers

- [ ] Create shared test utilities for common testing patterns
- [ ] Standardize mock implementations (especially for socket.io)
- [ ] Create common theme context mocks

## Template for Test Consolidation

For each test file consolidation, follow this pattern:

```typescript
// src/components/SomeComponent/__tests__/SomeComponent.test.tsx

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SomeComponent from "../SomeComponent";

// Optional: Import shared test utilities
// import { renderWithTheme } from '../../../test-utils';

describe("SomeComponent", () => {
  // Tests from the original .test file
  describe("Core functionality", () => {
    test("renders correctly", () => {
      // Test implementation
    });

    // More tests...
  });

  // Tests migrated from .early.test file
  describe("Additional functionality", () => {
    test("handles special cases", () => {
      // Test implementation from early test
    });

    // More migrated tests...
  });
});
```

## Expected Outcome

After completing this standardization:

1. All tests will follow a consistent directory structure
2. Test file naming will be standardized
3. Duplicate test logic will be eliminated
4. Test coverage will be maintained or improved
5. Test maintenance will be simplified
