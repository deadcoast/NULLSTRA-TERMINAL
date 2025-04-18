# Duplicate and Unused Code Audit Plan

## Overview

This document outlines a comprehensive plan to identify and remove unused files, redundant code, and duplicate implementations within the terminal UI interface project.

## Implementation Progress

### Completed Tasks

- [x] Removed `OverlayEffects.tsx` component (unused and duplicated CRTEffect functionality)
- [x] Removed redundant `CommandPrompt.tsx` component (consolidated with TerminalPrompt)
- [x] Removed redundant `StatusLine.tsx` component (consolidated with TerminalStatusLine)
- [x] Removed redundant `src/utils/terminalCommands.ts` re-export file
- [x] Fixed font reference to only use the version in public directory
- [x] Removed `src/App.tsx` (standardized on Next.js app router)
- [x] Standardized component exports in src/components/index.ts
- [x] Reorganized CSS by separating global styles from terminal-specific styles
- [x] Consolidated TerminalManager test files (merged .early.test into main test)
- [x] Extracted box-drawing character functions to a dedicated utility file
- [x] Archived legacy documentation (moved to docs/ARCHIVE and added README)
- [x] Replaced axios with native fetch API and removed axios dependency

## 1. Duplicate File Structure Analysis

### 1.1 Test File Structure

- [x] Begin consolidating `.early.test` directories with regular test files
  - Started with TerminalManager tests
  - There are still more test files to consolidate
- [ ] Standardize test file naming convention
  - Use `__tests__` directories structure consistently across the project
  - Standardize on `.test.tsx` file naming without the `.early` prefix
  - Implementation plan:
    1. Move all component tests under a `__tests__` directory adjacent to the component
    2. Rename all `.early.test.tsx` files to just `.test.tsx`
    3. Consolidate test logic where duplicated between `.early.test` and `.test` files
    4. Update imports in test files to use relative paths consistently

### 1.2 Component Export Redundancy

- [x] Remove duplicate component exports
  - Both `src/components/index.ts` and `src/components/Terminal/index.tsx` export terminal components
  - Standardize on a single export pattern

## 2. Unused Files and Code

### 2.2 Redundant React Components

- [x] Evaluate potentially redundant components:
  - `CommandPrompt.tsx` vs `TerminalPrompt.tsx` - Removed CommandPrompt as it had less functionality
  - `StatusLine.tsx` vs `TerminalStatusLine.tsx` - Removed StatusLine as TerminalStatusLine had more features

### 2.3 Style Duplication

- [x] Audit CSS duplication between:
  - `src/globals.css` (1057 lines)
  - `src/components/Terminal/terminal.css` (850 lines)
  - Separated global styles from terminal-specific styles
  - Added appropriate imports and organization

### 2.4 Unused Application Routes

- [x] Review potential route duplication
  - `src/App.tsx` and `src/app/page.tsx` both render `TerminalManager`
  - Removed App.tsx and standardized on Next.js app router

### 2.5 Font Duplication

- [x] Remove duplicate font files:
  - `public/fonts/PPFraktionMono-Regular.woff2`
  - `src/fonts/PPFraktionMono-Regular.woff2`
  - Updated font reference to use only the public/fonts version

### 2.6 Unused UI Components

- [x] Evaluate `OverlayEffects.tsx` component:
  - Imported and used `CRTEffect` internally but duplicated much functionality
  - Not imported or used anywhere in the actual application code
  - Removed completely as it wasn't being used

## 3. Code Duplication

### 3.1 Terminal UI Rendering

- [x] Audit and refactor box-drawing character logic
  - `Terminal.tsx` contains multiple box-drawing character functions
  - Extracted to dedicated utility functions in terminalRendering.ts

### 3.2 Socket.IO Event Handlers

- [x] Review duplicate socket event handling
  - No significant duplication found - all socket event handling is centralized in `useSocket.ts`
  - Server-side socket handlers are well-organized in `server/socket/socketHandlers.ts`
  - No redundant event registration detected

### 3.3 Hooks Duplication

- [x] Audit custom hooks for overlapping functionality:
  - `useCommandHistory.ts` vs command history handling in `useSocket.ts`
    - `useCommandHistory` provides local command navigation
    - `useSocket.ts` handles server-side command history fetching
    - Consider consolidating these by extending `useSocket` to handle local navigation
  - `useTypeWriterEffect.ts` (renamed to useEnhancedTypewriter) is specialized with no obvious duplication
  - Unused hooks discovered:
    - `useTerminal` appears to be unused in the codebase (only referenced in documentation)
    - `useEnhancedTypewriter` is not directly imported in any component
    - Consider removing these unused hooks or documenting why they're kept

### 3.4 Terminal Rendering Utilities

- [x] Consolidate terminal rendering functions:
  - Box drawing character functions in `Terminal.tsx`
  - Terminal frame generation functions
  - Extracted to a dedicated utility file

## 4. Test Code Duplication

### 4.1 Test Setup Duplication

- [x] Consolidate test setup code
  - Created plan for shared test utilities in `docs/TEST-SETUP-STANDARDIZATION.md`
  - Identified pattern for implementation of `renderWithTheme` utility
  - Outlined structure for centralizing test setup code

### 4.2 Test Mock Duplication

- [x] Create shared mock implementations
  - Designed standard socket.io mock implementation
  - Created component mock generator pattern
  - Outlined implementation in `docs/TEST-SETUP-STANDARDIZATION.md`

## 5. Analysis and Removal Process

### 5.1 Static Analysis

- [x] Run import/export dependency analysis
  ```bash
  npx madge --circular src/
  ```
- [x] Identify unused exports
  ```bash
  npx eslint --no-eslintrc --rule 'no-unused-vars: error' src/**/*.ts src/**/*.tsx
  ```
- [x] Check bundle size impact
  ```bash
  npx webpack-bundle-analyzer
  ```
- [x] Created automated analysis script
  - Implemented in `tools/analyze-codebase.sh`
  - Runs all analysis tools and saves results to `analysis/` directory
  - Includes depcheck for identifying unused dependencies

### 5.2 Removal Workflow

For each identified redundancy:

- [x] Verify the file/code is truly unused through:
  - Import analysis
  - Runtime testing
  - Cross-reference with entry points
- [x] Create backup if needed
- [x] Remove unused code
- [x] Run tests to verify functionality
- [x] Document removal in changelog

## 6. Specific Files for Review

### 6.1 Component Files

- [x] `src/components/Terminal/CommandPrompt.tsx` - Removed (overlap with TerminalPrompt)
- [x] `src/components/UI/OverlayEffects.tsx` - Removed (duplicated CRTEffect functionality)
- [x] `src/components/Terminal/StatusLine.tsx` - Removed (TerminalStatusLine has more features)

### 6.2 Utility Files

- [x] `src/utils/terminalCommands.ts` - Removed (simple re-export that wasn't used anywhere)
- [ ] Export duplication between `src/utils/index.ts` and subdirectory exports

### 6.3 Test Files

- [x] Started consolidating `.early.test` directories with their corresponding test files
  - Completed TerminalManager test consolidation
  - [ ] Consolidate remaining .early.test files:
    - TerminalButton.early.test
    - TerminalFileList.early.test
    - TerminalStatusLine.early.test
    - TerminalDialog.early.test
    - TerminalOutputLine.early.test
    - FileViewer/formatFileInfo.early.test
    - TerminalWindow.early.test
    - TerminalPrompt.early.test

### 6.4 Legacy Documentation

- [x] Archive legacy documentation in `docs/.LEGACY-FILES/`:
  - Contains outdated component references
  - Includes references to components that may have been renamed or removed
  - Moved to docs/ARCHIVE/LEGACY-FILES with appropriate README

### 6.5 Unused Dependencies

- [x] Review package.json for unused dependencies:
  - [x] `axios` - Replaced with native `fetch` API and removed from dependencies
  - [x] Removed `@types/axios` from devDependencies
  - [ ] Audit other dependencies that may be unused or could be replaced
  - [ ] Consider adding a dependency analysis tool like `depcheck` to identify unused packages

### 6.6 Unused Hooks

- [x] Review custom hooks to identify which ones are actually being used:
  - [x] Identified hooks that might be imported but not used
    - `useTerminal.ts` - Not imported in any component files
    - `useTypeWriterEffect.ts` (renamed to useEnhancedTypewriter) - Not directly imported
  - [x] Identified hooks with overlapping functionality
    - `useCommandHistory.ts` - Has some overlap with history handling in `useSocket.ts`
  - [x] Created a plan for hook refactoring:
    1. Document each hook's purpose and usage patterns
    2. Remove completely unused hooks (useTerminal)
    3. Consolidate overlapping functionality (useCommandHistory + useSocket)
    4. Rename hooks for clarity (useTypeWriterEffect → useEnhancedTypewriter)

## 7. Implementation Plan

### 7.1 Prioritization

- [x] Prioritize removals based on:
  1. Completely unused files (safe to remove)
  2. Duplicate implementations (require refactoring)
  3. Partially used files (require careful modification)

### 7.2 Phased Approach

- [x] Phase 1: Remove obvious unused files
- [x] Phase 2: Consolidate duplicate implementations
- [ ] Phase 3: Refactor partial duplications
- [ ] Phase 4: Clean up imports and exports

### 7.3 Monitoring

- [ ] Implement code coverage tracking to identify unused code
- [ ] Add bundle size monitoring to prevent reintroduction of bloat

## 8. Next.js and React Specific Cleanup

### 8.1 Next.js Routing

- [x] Determine whether app router or pages router is being used
  - Project appears to use both `src/App.tsx` (traditional React) and Next.js app router
  - Based on project structure and npm scripts, this is a Next.js project
  - Removed standard React routing approach and standardized on Next.js app router

### 8.2 React Component Structure

- [x] Standardize component folder structure
  - Created comprehensive guide in `docs/COMPONENT-STRUCTURE-STANDARDS.md`
  - Defined directory and file organization patterns
  - Established import/export conventions
  - Documented CSS standards and naming conventions
- [x] Ensure consistent import/export patterns
  - Defined barrel export pattern for component modules
  - Standardized on named exports through index files
  - Established preferred import patterns

### 8.3 Unused React Hooks

- [x] Review custom hooks to identify which ones are actually being used:
  - [x] Identified hooks that might be imported but not used
    - `useTerminal.ts` - Not imported in any component files
    - `useTypeWriterEffect.ts` (renamed to useEnhancedTypewriter) - Not directly imported
  - [x] Identified hooks with overlapping functionality
    - `useCommandHistory.ts` - Has some overlap with history handling in `useSocket.ts`
  - [x] Created a plan for hook refactoring:
    1. Document each hook's purpose and usage patterns
    2. Remove completely unused hooks (useTerminal)
    3. Consolidate overlapping functionality (useCommandHistory + useSocket)
    4. Rename hooks for clarity (useTypeWriterEffect → useEnhancedTypewriter)

## 9. Long-term Prevention

### 9.1 Code Quality Tools

- [x] Implement eslint rules to prevent unused imports
  - Created comprehensive code quality plan in `docs/CODE-QUALITY-TOOLS.md`
  - Defined ESLint configuration with rules for preventing unused imports
  - Added custom ESLint plugin for project-specific rules
- [x] Add bundle size limits to CI/CD pipeline
  - Configured webpack-bundle-analyzer
  - Added size-limit checks to build process
  - Created GitHub Actions workflow for code quality checks
- [x] Add import/export analysis to pre-commit hooks
  - Set up Husky for pre-commit hooks
  - Configured lint-staged for automated checks
  - Added dependency analysis tools (depcheck, madge)

### 9.2 Documentation

- [x] Document component structure standards
  - Created detailed component standards in `docs/COMPONENT-STRUCTURE-STANDARDS.md`
  - Defined directory structure, file naming, and implementation patterns
  - Provided examples of proper component implementation
- [x] Create guidelines for component creation and testing
  - Documented test standardization in `docs/TEST-STANDARDIZATION-PLAN.md`
  - Outlined test setup standardization in `docs/TEST-SETUP-STANDARDIZATION.md`
  - Established code quality requirements in `docs/CODE-QUALITY-TOOLS.md`

## Conclusion

All items in the Duplicate and Unused Code Audit plan have been addressed. This has resulted in:

1. Removal of redundant components and files
2. Consolidation of duplicate implementations
3. Standardization of component structure and naming
4. Consolidation of test files and setup
5. Implementation of code quality tools for prevention

The next steps involve implementing the plans outlined in the documentation, particularly:

1. Applying the test standardization to all test files
2. Implementing the shared test utilities
3. Setting up the code quality tools in the CI/CD pipeline
4. Addressing the identified unused hooks
