/**
 * Accessibility testing utilities
 * These utilities use axe-core to run accessibility tests on the page
 */
import type { AxeResults as AxeCoreResults } from 'axe-core';
// Using require since the package uses CommonJS export
const axe = require('axe-core');

export interface AxeResults {
  violations: Array<{
    id: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    description: string;
    help: string;
    helpUrl: string;
    nodes: Array<{
      html: string;
      target: string[];
      failureSummary: string;
    }>;
  }>;
  passes: Array<any>;
  incomplete: Array<any>;
  inapplicable: Array<any>;
}

/**
 * Dynamically load axe-core and run the accessibility tests
 */
export const runAxe = async (): Promise<AxeResults> => {
  try {
    return new Promise((resolve) => {
      // Configure and run axe
      axe.run(
        document,
        {
          rules: {
            // Enable specific rules or configure rule options
            "color-contrast": { enabled: true },
            "aria-roles": { enabled: true },
            "aria-required-attr": { enabled: true },
            "aria-required-children": { enabled: true },
            "aria-required-parent": { enabled: true },
            "aria-valid-attr": { enabled: true },
            "aria-valid-attr-value": { enabled: true },
            "landmark-one-main": { enabled: true },
            region: { enabled: true },
            "landmark-banner-is-top-level": { enabled: true },
            "landmark-complementary-is-top-level": { enabled: true },
            "landmark-contentinfo-is-top-level": { enabled: true },
            "landmark-main-is-top-level": { enabled: true },
            "landmark-no-duplicate-banner": { enabled: true },
            "landmark-no-duplicate-contentinfo": { enabled: true },
            "landmark-no-duplicate-main": { enabled: true },
            "page-has-heading-one": { enabled: true },
          },
        },
        (error: Error, axeResults: AxeCoreResults) => {
          if (error) {
            console.error("Error running axe-core:", error);
            resolve({
              violations: [],
              passes: [],
              incomplete: [],
              inapplicable: [],
            });
          } else {
            // Transform the results to match our interface
            const transformedResults: AxeResults = {
              violations: axeResults.violations.map(violation => ({
                id: violation.id,
                impact: (violation.impact || 'minor') as "minor" | "moderate" | "serious" | "critical",
                description: violation.description,
                help: violation.help,
                helpUrl: violation.helpUrl,
                nodes: violation.nodes.map(node => ({
                  html: node.html,
                  target: node.target as string[],
                  // Access failure summary property through any to bypass type checking
                  failureSummary: (node as any).failureSummary || '',
                })),
              })),
              passes: axeResults.passes || [],
              incomplete: [],
              inapplicable: [],
            };
            resolve(transformedResults);
          }
        },
      );
    });
  } catch (error) {
    console.error("Error loading axe-core:", error);
    return {
      violations: [],
      passes: [],
      incomplete: [],
      inapplicable: [],
    };
  }
};

/**
 * Get a color compliant with WCAG 2.1 AA contrast ratio
 * @param backgroundColor The background color in hex format
 * @param minContrastRatio The minimum contrast ratio (4.5 for normal text, 3 for large text)
 * @returns A color that has sufficient contrast with the background
 */
export const getAccessibleColor = (
  backgroundColor: string,
  minContrastRatio = 4.5,
): string => {
  // Simple implementation - would need a more sophisticated algorithm for real use
  // In a real implementation, you'd use a library like color to calculate contrast ratios

  // For now, just return white for dark backgrounds and black for light backgrounds
  const backgroundIsLight = isLightColor(backgroundColor);
  return backgroundIsLight ? "#000000" : "#FFFFFF";
};

/**
 * Determine if a color is light or dark
 * @param color Hex color code
 * @returns true if the color is light
 */
const isLightColor = (color: string): boolean => {
  // Remove the # if it exists
  const hex = color.replace("#", "");

  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return true if the color is light
  return luminance > 0.5;
};

/**
 * Create an ARIA live region for important announcements
 * @param message The message to announce
 * @param priority The priority of the announcement (polite or assertive)
 */
export const announceToScreenReader = (
  message: string,
  priority: "polite" | "assertive" = "polite",
): void => {
  // Find or create the live region
  let liveRegion = document.getElementById("a11y-announcer");

  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "a11y-announcer";
    liveRegion.setAttribute("aria-live", priority);
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.setAttribute("role", "status");
    liveRegion.style.position = "absolute";
    liveRegion.style.width = "1px";
    liveRegion.style.height = "1px";
    liveRegion.style.overflow = "hidden";
    liveRegion.style.clip = "rect(0 0 0 0)";
    liveRegion.style.whiteSpace = "nowrap";
    document.body.appendChild(liveRegion);
  } else {
    // Update the priority
    liveRegion.setAttribute("aria-live", priority);
  }

  // Set the message
  // Using setTimeout to ensure the change is announced even if the element was just created
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, 100);
};

/**
 * Check if a keyboard user is navigating the page
 * This helps to only show focus styles when navigating with keyboard
 */
export const setupKeyboardNavigationDetection = (): void => {
  // Add class to body when user is navigating with keyboard
  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      document.body.classList.add("user-is-tabbing");
    }
  });

  // Remove class when user clicks with mouse
  document.addEventListener("mousedown", () => {
    document.body.classList.remove("user-is-tabbing");
  });
};

/**
 * Create focus trap for modal dialogs
 * @param containerElement The modal container element
 * @param initialFocusElement Optional element to focus when trap is activated
 * @returns Functions to activate and deactivate the focus trap
 */
export const createFocusTrap = (
  containerElement: HTMLElement,
  initialFocusElement?: HTMLElement,
) => {
  const focusableElements = containerElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement;

  let isActive = false;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive) return;

    // Handle Tab key presses to trap focus
    if (e.key === "Tab") {
      if (e.shiftKey) {
              // Shift + Tab
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            }
      else if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
    }

    // Handle Escape key to close modal
    if (e.key === "Escape") {
      deactivate();
    }
  };

  const activate = () => {
    if (isActive) return;

    isActive = true;

    // Store the element that had focus before showing the modal
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus the first focusable element or a specified element
    if (initialFocusElement) {
      initialFocusElement.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    // Add keyboard event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Return focus to the element that had focus before the modal was shown
      if (previouslyFocusedElement && previouslyFocusedElement.focus) {
        previouslyFocusedElement.focus();
      }
    };
  };

  const deactivate = () => {
    if (!isActive) return;

    // Remove keyboard event listener
    document.removeEventListener("keydown", handleKeyDown);

    isActive = false;
  };

  return { activate, deactivate };
};

export default {
  runAxe,
  getAccessibleColor,
  announceToScreenReader,
  setupKeyboardNavigationDetection,
  createFocusTrap,
};
