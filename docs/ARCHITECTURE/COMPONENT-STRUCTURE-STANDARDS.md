# React Component Structure Standards

## Overview

This document defines the standard structure and organization patterns for React components in the Terminal UI project. Adhering to these standards will ensure consistent code organization, improve maintainability, and reduce duplication.

## Directory Structure

### Component Organization

Components should be organized following this structure:

```
src/components/
├── ComponentName/              # Component directory
│   ├── ComponentName.tsx       # Main component implementation
│   ├── ComponentName.css       # Component-specific styles (if needed)
│   ├── index.ts                # Re-exports component
│   ├── SubComponent.tsx        # Child components used only by this component
│   ├── types.ts                # Component-specific type definitions
│   ├── utils.ts                # Component-specific utility functions
│   └── __tests__/              # Component tests
│       └── ComponentName.test.tsx
└── index.ts                    # Re-exports all components
```

### Component Categories

Components should be organized into logical categories:

```
src/components/
├── Terminal/          # Terminal-specific components
├── UI/                # General UI components (buttons, dialogs, etc.)
├── Layout/            # Page layout components
└── index.ts           # Re-exports all components
```

## Component File Structure

### Component Implementation

```tsx
// src/components/ComponentName/ComponentName.tsx

// 1. Imports - Organized by category
import React, { useState, useEffect } from "react";
import { useTheme } from "../../context";
import { SomeUtility } from "../../utils";
import { SubComponent } from "./SubComponent";
import { ComponentProps } from "./types";
import "./ComponentName.css";

// 2. Component definition
export const ComponentName: React.FC<ComponentProps> = ({
  prop1,
  prop2,
  children,
}) => {
  // 3. Hooks
  const { theme } = useTheme();
  const [state, setState] = useState(initialState);

  // 4. Effects
  useEffect(() => {
    // Effect implementation
  }, [dependencies]);

  // 5. Event handlers
  const handleEvent = () => {
    // Event handler implementation
  };

  // 6. Render helpers (optional)
  const renderSomething = () => {
    return <div>Rendered content</div>;
  };

  // 7. Return JSX
  return (
    <div className="component-name">
      {/* Component JSX structure */}
      {children}
    </div>
  );
};

// Default export (optional if using index.ts)
export default ComponentName;
```

### Index File

```tsx
// src/components/ComponentName/index.ts
export { default } from "./ComponentName";
export * from "./types";
```

### Types File

```tsx
// src/components/ComponentName/types.ts
export interface ComponentProps {
  prop1: string;
  prop2?: number;
  onEvent?: (value: string) => void;
}
```

## Import/Export Patterns

### Recommended Import Pattern

```tsx
// Preferred - Named imports
import { ComponentName } from "../components";

// Alternative - Direct import if needed for code splitting
import ComponentName from "../components/ComponentName";
```

### Barrel Export Pattern

Use a single barrel export file at the component category level:

```tsx
// src/components/Terminal/index.ts
export { default as Terminal } from "./Terminal";
export { default as TerminalPrompt } from "./TerminalPrompt";
export { default as TerminalOutput } from "./TerminalOutput";

// Also export types
export * from "./Terminal/types";
export * from "./TerminalPrompt/types";
export * from "./TerminalOutput/types";
```

And a top-level barrel file:

```tsx
// src/components/index.ts
export * from "./Terminal";
export * from "./UI";
export * from "./Layout";
```

## Component Naming Conventions

- Use PascalCase for component names: `TerminalPrompt`, not `terminalPrompt`
- Use descriptive, explicit names: `TerminalPrompt` instead of `Prompt`
- Prefix related components with a common term: `Terminal*` for terminal components
- Suffix by function when applicable: `*Provider`, `*Context`, `*Button`

## CSS Conventions

### Component-specific CSS

- Use component-specific CSS files for styles used only by that component
- Name CSS files to match component: `ComponentName.css`
- Use kebab-case for CSS class names: `.terminal-prompt-input`
- Prefix classes with component name to avoid collisions: `.terminal-prompt-input`

### Global CSS

- Use `globals.css` only for truly global styles
- Extract common styles into theme variables
- Organize global CSS into logical sections with comments

## Props and State Management

- Use TypeScript interfaces to define props
- Destructure props in component parameters
- Set default values using default parameters
- Use custom hooks for complex state management
- Extract reusable logic into shared hooks

## Component Documentation

Each component should include:

- Brief description of purpose and usage
- Props documentation (leveraging TypeScript)
- Usage examples for complex components
- Notes on any important implementation details

## Implementing These Standards

### For New Components

All new components should follow these standards from the start.

### For Existing Components

When refactoring existing components:

1. Move the component to the correct directory structure
2. Update the file structure to match the standards
3. Update imports and exports
4. Add proper typing
5. Refactor CSS to follow the naming conventions

## Examples

See the following components for reference implementations:

- `src/components/Terminal/Terminal.tsx`
- `src/components/UI/Button/Button.tsx`
