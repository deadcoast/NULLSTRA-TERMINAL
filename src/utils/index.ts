// src/utils/index.ts

// Terminal effects utilities
export {
  formatIpAddress,
  formatTimestamp,
  generateNoise,
  generateRandomError,
  glitchText,
  simulateConnectionIssue,
  typeText,
} from "./effectsHelper";

// Terminal rendering utilities
export {
  generateBottomBorder,
  generateButtonSection,
  generateContentLine,
  generateLineNumberEnd,
  generateTerminalFrame,
  generateTopBar,
} from "./terminalRendering";

// Box drawing utilities
export {
  BOX_CHARS,
  padLine as renderBox,
  createContentLine as renderBoxedContent,
  createHorizontalLine as renderHorizontalLine,
  prefixLine as renderVerticalLine,
} from "./boxDrawing";

// Terminal command utilities
export * from "./terminalCommands";

// Terminal message type
export type { TerminalMessage } from "./terminalCommands/types";

// Text formatting utilities
export * from "./textFormatters";
