// src/utils/index.ts
import {
  formatIpAddress,
  formatTimestamp,
  generateNoise,
  generateRandomError,
  glitchText,
  simulateConnectionIssue,
  typeText,
} from "./effectsHelper";
import {
  // executeCommand, // Removed as it's not exported from terminalCommands/index
  type TerminalMessage,
} from "./terminalCommands/index"; // Corrected path

export {
  formatIpAddress,
  formatTimestamp,
  // executeCommand, // Removed export
  generateNoise,
  generateRandomError,
  glitchText,
  simulateConnectionIssue,
  typeText,
};

export type { TerminalMessage };
