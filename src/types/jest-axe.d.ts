// Type definitions for jest-axe 10.0.0
// Project: https://github.com/nickcolley/jest-axe
// Definitions by: Custom declarations for midaterminal

declare module "jest-axe" {
  import { RunOptions } from "axe-core";

  export interface AxeResults {
    violations: any[];
    passes: any[];
    incomplete: any[];
    inapplicable: any[];
  }

  /**
   * Runs axe on HTML
   */
  export function axe(
    html: string | Element | Document,
    options?: RunOptions,
  ): Promise<AxeResults>;

  /**
   * Configure global options for axe.run
   */
  export function configureAxe(
    options: RunOptions,
  ): (
    html: string | Element | Document,
    options?: RunOptions,
  ) => Promise<AxeResults>;

  /**
   * Results to a matcher that Jest can understand
   */
  export function toHaveNoViolations(results: AxeResults): {
    pass: boolean;
    message(): string;
  };
}

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}
