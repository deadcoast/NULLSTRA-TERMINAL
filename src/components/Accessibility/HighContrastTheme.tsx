import * as React from "react";
const {   useEffect, useState   } = React;
import { createPortal } from "react-dom";

import useLocalStorage from "../../hooks/useLocalStorage";

export type ThemeMode =
  | "default"
  | "high-contrast"
  | "dark-high-contrast"
  | "protanopia"
  | "deuteranopia"
  | "tritanopia"
  | "reduced-motion";

export type FontSize = "default" | "large" | "x-large" | "xx-large";

export type FontFamily =
  | "default"
  | "sans-serif"
  | "serif"
  | "monospace"
  | "dyslexic";

export interface AccessibilityPreferences {
  themeMode: ThemeMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
  reducedMotion: boolean;
  enhancedContrast: boolean;
}

const defaultPreferences: AccessibilityPreferences = {
  themeMode: "default",
  fontSize: "default",
  fontFamily: "default",
  reducedMotion: false,
  enhancedContrast: false,
};

// Color definitions for different color vision deficiency modes
const colorMappings = {
  default: {
    "--color-background": "#0a0f1e", // Night blue
    "--color-foreground": "#e0f2e9", // Light mint
    "--color-primary": "#78FFB4", // Bright lime green
    "--color-secondary": "#FF4B9D", // Shocking pink
    "--color-accent": "#4DFFFF", // Cyan
    "--color-error": "#FF5252", // Red
    "--color-warning": "#FFD740", // Amber
    "--color-success": "#69F0AE", // Green
    "--color-info": "#64B5F6", // Blue
  },
  "high-contrast": {
    "--color-background": "#000000", // Pure black
    "--color-foreground": "#FFFFFF", // Pure white
    "--color-primary": "#00FF00", // Bright green
    "--color-secondary": "#FFFF00", // Yellow
    "--color-accent": "#00FFFF", // Cyan
    "--color-error": "#FF0000", // Red
    "--color-warning": "#FFAA00", // Orange
    "--color-success": "#00FF00", // Green
    "--color-info": "#00AAFF", // Blue
  },
  "dark-high-contrast": {
    "--color-background": "#000000", // Pure black
    "--color-foreground": "#FFFFFF", // Pure white
    "--color-primary": "#00FF00", // Bright green
    "--color-secondary": "#FFFF00", // Yellow
    "--color-accent": "#00FFFF", // Cyan
    "--color-error": "#FF6666", // Light red
    "--color-warning": "#FFCC66", // Light amber
    "--color-success": "#66FF99", // Light green
    "--color-info": "#66CCFF", // Light blue
  },
  protanopia: {
    // Colors for red-blind vision
    "--color-background": "#0a0f1e",
    "--color-foreground": "#e0f2e9",
    "--color-primary": "#FFFF00", // Yellow instead of green
    "--color-secondary": "#00AAFF", // Blue instead of pink
    "--color-accent": "#00FFFF",
    "--color-error": "#0066FF", // Blue instead of red
    "--color-warning": "#FFFFA0", // Light yellow
    "--color-success": "#FFFF00", // Yellow instead of green
    "--color-info": "#64B5F6",
  },
  deuteranopia: {
    // Colors for green-blind vision
    "--color-background": "#0a0f1e",
    "--color-foreground": "#e0f2e9",
    "--color-primary": "#FFFF00", // Yellow instead of green
    "--color-secondary": "#0044FF", // Blue instead of pink
    "--color-accent": "#00FFFF",
    "--color-error": "#FF5252",
    "--color-warning": "#FFFFA0", // Light yellow
    "--color-success": "#FFFF00", // Yellow instead of green
    "--color-info": "#64B5F6",
  },
  tritanopia: {
    // Colors for blue-blind vision
    "--color-background": "#0a0f1e",
    "--color-foreground": "#e0f2e9",
    "--color-primary": "#FF00FF", // Magenta instead of green
    "--color-secondary": "#FF4B9D",
    "--color-accent": "#FF00FF", // Magenta instead of cyan
    "--color-error": "#FF5252",
    "--color-warning": "#FFCC00",
    "--color-success": "#AAFF00", // Yellow-green
    "--color-info": "#FF00FF", // Magenta instead of blue
  },
};

// Font size mappings
const fontSizeMappings = {
  default: {
    "--font-size-base": "16px",
    "--font-size-sm": "14px",
    "--font-size-lg": "18px",
    "--font-size-xl": "20px",
    "--font-size-xxl": "24px",
  },
  large: {
    "--font-size-base": "18px",
    "--font-size-sm": "16px",
    "--font-size-lg": "20px",
    "--font-size-xl": "24px",
    "--font-size-xxl": "28px",
  },
  "x-large": {
    "--font-size-base": "20px",
    "--font-size-sm": "18px",
    "--font-size-lg": "24px",
    "--font-size-xl": "28px",
    "--font-size-xxl": "32px",
  },
  "xx-large": {
    "--font-size-base": "24px",
    "--font-size-sm": "20px",
    "--font-size-lg": "28px",
    "--font-size-xl": "32px",
    "--font-size-xxl": "36px",
  },
};

// Font family mappings
const fontFamilyMappings = {
  default: {
    "--font-family-primary":
      '"JetBrains Mono", Menlo, Monaco, Consolas, "Courier New", monospace',
    "--font-family-secondary":
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  "sans-serif": {
    "--font-family-primary": 'Arial, "Helvetica Neue", Helvetica, sans-serif',
    "--font-family-secondary": 'Arial, "Helvetica Neue", Helvetica, sans-serif',
  },
  serif: {
    "--font-family-primary": 'Georgia, Times, "Times New Roman", serif',
    "--font-family-secondary": 'Georgia, Times, "Times New Roman", serif',
  },
  monospace: {
    "--font-family-primary":
      'Menlo, Monaco, Consolas, "Courier New", monospace',
    "--font-family-secondary":
      'Menlo, Monaco, Consolas, "Courier New", monospace',
  },
  dyslexic: {
    "--font-family-primary": '"OpenDyslexic", Comic Sans MS, cursive',
    "--font-family-secondary": '"OpenDyslexic", Comic Sans MS, cursive',
  },
};

// Motion preference styles
const getMotionStyles = (reducedMotion: boolean) => {
  if (reducedMotion) {
    return `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    `;
  }
  return "";
};

// Additional high contrast styles
const getHighContrastStyles = (enhancedContrast: boolean) => {
  if (enhancedContrast) {
    return `
      a:focus, button:focus, input:focus, select:focus, textarea:focus, [tabindex]:focus {
        outline: 3px solid var(--color-primary) !important;
        outline-offset: 3px !important;
      }
      
      :focus {
        outline: 3px solid var(--color-primary) !important;
        outline-offset: 3px !important;
      }
      
      button, a, input, select, [role="button"] {
        text-decoration: underline !important;
      }
    `;
  }
  return "";
};

export interface HighContrastThemeProps {
  children?: React.ReactNode;
}

const HighContrastTheme: React.FC<HighContrastThemeProps> = ({ children }) => {
  const [preferences, setPreferences] =
    useLocalStorage<AccessibilityPreferences>(
      "accessibility-preferences",
      defaultPreferences,
    );

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Helper to generate the full CSS based on current preferences
  const generateCSS = () => {
    let css = "";
    const currentTheme =
      preferences.themeMode === "reduced-motion"
        ? "default" // Use default theme for reduced motion
        : preferences.themeMode;

    const colorVars = colorMappings[currentTheme] || colorMappings.default;
    const fontSizeVars =
      fontSizeMappings[preferences.fontSize] || fontSizeMappings.default;
    const fontFamilyVars =
      fontFamilyMappings[preferences.fontFamily] || fontFamilyMappings.default;

    css += `
      :root {
        /* Colors */
        ${Object.entries(colorVars)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n        ")}
        
        /* Font sizes */
        ${Object.entries(fontSizeVars)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n        ")}
        
        /* Font families */
        ${Object.entries(fontFamilyVars)
          .map(([key, value]) => `${key}: ${value};`)
          .join("\n        ")}
      }
      
      body {
        background-color: var(--color-background);
        color: var(--color-foreground);
        font-family: var(--font-family-primary);
        font-size: var(--font-size-base);
      }
      
      ${getMotionStyles(preferences.reducedMotion)}
      ${getHighContrastStyles(preferences.enhancedContrast)}
      
      /* High contrast focus styles for keyboard users */
      .user-is-tabbing :focus {
        outline: 3px solid var(--color-primary) !important;
        outline-offset: 3px !important;
      }
    `;

    return css;
  };

  // Update the document's CSS when preferences change
  useEffect(() => {
    // Create style element for dynamic CSS
    const styleElement = document.createElement("style");
    document.head.appendChild(styleElement);
    styleElement.textContent = generateCSS();

    // Define handleMediaChange function
    const handleMediaChange = (e: MediaQueryListEvent) => {
      if (e.media === "(prefers-reduced-motion: reduce)" && e.matches) {
        setPreferences((prev) => ({ ...prev, reducedMotion: true }));
      } else if (e.media === "(prefers-color-scheme: dark)" && e.matches) {
        setPreferences((prev) => ({
          ...prev,
          themeMode: "dark-high-contrast",
        }));
      } else if (e.media === "(prefers-contrast: more)" && e.matches) {
        setPreferences((prev) => ({ ...prev, enhancedContrast: true }));
      }
    };

    // Add event listener for system preference changes
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)");
    const prefersContrast = window.matchMedia("(prefers-contrast: more)");

    // Add event listeners with named handler functions
    prefersReducedMotion.addEventListener("change", handleMediaChange);
    prefersDarkMode.addEventListener("change", handleMediaChange);
    prefersContrast.addEventListener("change", handleMediaChange);

    // Check on initial load
    if (prefersReducedMotion.matches && !preferences.reducedMotion) {
      setPreferences((prev) => ({ ...prev, reducedMotion: true }));
    }

    // Return cleanup function
    return () => {
      document.head.removeChild(styleElement);
      prefersReducedMotion.removeEventListener("change", handleMediaChange);
      prefersDarkMode.removeEventListener("change", handleMediaChange);
      prefersContrast.removeEventListener("change", handleMediaChange);
    };
  }, [preferences, setPreferences]);

  // Handle preference changes
  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K],
  ) => {
    setPreferences((prev) => {
      const updatedPrefs = { ...prev, [key]: value };
      localStorage.setItem(
        "accessibility_preferences",
        JSON.stringify(updatedPrefs),
      );
      return updatedPrefs;
    });
  };

  // Accessibility menu UI
  const renderAccessibilityMenu = () => {
    if (!isMenuOpen) return null;

    return createPortal(
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-dialog-title"
      >
        <div className="bg-night border-2 border-lime p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-auto">
          <div className="flex justify-between items-center mb-4 border-b border-lime pb-3">
            <h2 id="a11y-dialog-title" className="text-xl font-bold text-lime">
              Accessibility Settings
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close accessibility menu"
              className="text-lime hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Theme Mode Selection */}
            <div>
              <label
                htmlFor="themeMode"
                className="block mb-2 text-lime font-medium"
              >
                Display Mode
              </label>
              <select
                id="themeMode"
                value={preferences.themeMode}
                onChange={(e) =>
                  updatePreference("themeMode", e.target.value as ThemeMode)
                }
                className="w-full bg-black text-lime border border-lime rounded py-2 px-3"
              >
                <option value="default">Default</option>
                <option value="high-contrast">High Contrast (Light)</option>
                <option value="dark-high-contrast">High Contrast (Dark)</option>
                <option value="protanopia">Protanopia (Red-Blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                <option value="tritanopia">Tritanopia (Blue-Blind)</option>
              </select>
            </div>

            {/* Font Size Selection */}
            <div>
              <label
                htmlFor="fontSize"
                className="block mb-2 text-lime font-medium"
              >
                Text Size
              </label>
              <select
                id="fontSize"
                value={preferences.fontSize}
                onChange={(e) =>
                  updatePreference("fontSize", e.target.value as FontSize)
                }
                className="w-full bg-black text-lime border border-lime rounded py-2 px-3"
              >
                <option value="default">Default</option>
                <option value="large">Large</option>
                <option value="x-large">Extra Large</option>
                <option value="xx-large">XX Large</option>
              </select>
            </div>

            {/* Font Family Selection */}
            <div>
              <label
                htmlFor="fontFamily"
                className="block mb-2 text-lime font-medium"
              >
                Font Type
              </label>
              <select
                id="fontFamily"
                value={preferences.fontFamily}
                onChange={(e) =>
                  updatePreference("fontFamily", e.target.value as FontFamily)
                }
                className="w-full bg-black text-lime border border-lime rounded py-2 px-3"
              >
                <option value="default">Default</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="dyslexic">Dyslexic-friendly</option>
              </select>
            </div>

            {/* Motion Preferences */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="reducedMotion"
                checked={preferences.reducedMotion}
                onChange={(e) =>
                  updatePreference("reducedMotion", e.target.checked)
                }
                className="h-5 w-5 text-lime border-lime rounded focus:ring-lime"
              />
              <label htmlFor="reducedMotion" className="ml-2 text-lime">
                Reduce motion (minimize animations)
              </label>
            </div>

            {/* Enhanced Contrast */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="enhancedContrast"
                checked={preferences.enhancedContrast}
                onChange={(e) =>
                  updatePreference("enhancedContrast", e.target.checked)
                }
                className="h-5 w-5 text-lime border-lime rounded focus:ring-lime"
              />
              <label htmlFor="enhancedContrast" className="ml-2 text-lime">
                Enhanced focus indicators
              </label>
            </div>
          </div>

          <div className="mt-6 border-t border-lime pt-4 flex justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="bg-lime text-night px-4 py-2 rounded font-medium hover:bg-white transition-colors"
            >
              Save and Close
            </button>
          </div>
        </div>
      </div>,
      document.body,
    );
  };

  return (
    <>
      {children}

      {/* Accessibility toggle button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-4 right-4 z-40 bg-night border-2 border-lime rounded-full p-3 shadow-lg hover:bg-lime hover:text-night transition-colors"
        aria-label="Open accessibility settings"
        title="Accessibility Settings"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M12 5L12 19" stroke="currentColor" strokeWidth="2" />
          <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {renderAccessibilityMenu()}
    </>
  );
};

export default HighContrastTheme;
