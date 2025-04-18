// src/utils/terminalCommands/index.ts
// Main export file for the terminal commands system
import initialFileSystemData from "./fileSystemData";
import { registerFileSystemCommands } from "./fileSystems";
import { registerNetworkCommands } from "./networkCommands";
import { registerSecurityCommands } from "./security";
import { registerSystemCommands } from "./system";
import { CommandRegistry } from "./types";
import { registerUICommands } from "./uiCommands";
import { registerUtilityCommands } from "./utilityCommands";

// Initialize the command registry
const commandRegistry: CommandRegistry = {};

// Register all command groups
export const initializeCommands = () => {
  registerFileSystemCommands(commandRegistry, initialFileSystemData);
  registerSystemCommands(commandRegistry);
  registerSecurityCommands(commandRegistry);
  registerNetworkCommands(commandRegistry);
  registerUtilityCommands(commandRegistry);
  registerUICommands(commandRegistry); // Register UI-specific commands
  // Add additional command groups here as needed

  return commandRegistry;
};

// Export types and utilities
export * from "./helpers";
export * from "./types";

// Export the default registry
export default initializeCommands();
