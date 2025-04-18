"use client";

import StatusPanel from "./StatusPanel";
import StatusTag from "./StatusTag";
import Terminal from "./Terminal";
import TerminalButton from "./TerminalButton";
import TerminalDialog from "./TerminalDialog";
import TerminalFileList from "./TerminalFileList";
import TerminalHeader from "./TerminalHeader";
import TerminalOutput from "./TerminalOutput";
import TerminalOutputLine from "./TerminalOutputLine";
import TerminalPrompt from "./TerminalPrompt";
import TerminalStatusLine from "./TerminalStatusLine";
import TerminalWindow from "./TerminalWindow";

// Export the main Terminal component as default
export default Terminal;

// Export all the smaller components for use elsewhere
export {
  StatusPanel,
  StatusTag,
  TerminalButton,
  TerminalDialog,
  TerminalFileList,
  TerminalHeader,
  TerminalOutput,
  TerminalOutputLine,
  TerminalPrompt,
  TerminalStatusLine,
  TerminalWindow,
};

export * from "./StatusPanel";
export * from "./StatusTag";
