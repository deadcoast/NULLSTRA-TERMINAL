import localFont from "next/font/local";

// Load the terminal font with optimized settings
export const terminalFont = localFont({
  src: "./PPFraktionMono-Regular.woff2",
  display: "swap", // Use 'swap' to ensure text remains visible during font loading
  variable: "--font-terminal", // CSS variable for usage in styles
  preload: true,
  fallback: ["monospace"], // Fallback font
  adjustFontFallback: "Arial", // Font metrics adjustment
});

// Helper function to get font CSS variables for inline styles
export function getFontStyles() {
  return {
    fontFamily: `var(--font-terminal), monospace`,
  };
}

// Add a class name with the variable for styling in CSS
export const terminalFontClass = terminalFont.variable;
