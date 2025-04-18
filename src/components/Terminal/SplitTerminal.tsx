import * as React from "react";
const {   useCallback, useState   } = React;

import SplitPane, { SplitDirection } from "./SplitPane";
import Terminal, { TerminalProps } from "./Terminal";

export interface SplitTerminalProps {
  direction?: SplitDirection;
  terminals?: [TerminalProps, TerminalProps];
  defaultSizes?: [number, number];
  syncScroll?: boolean;
  className?: string;
}

const SplitTerminal: React.FC<SplitTerminalProps> = ({
  direction = "horizontal",
  terminals = [{}, {}],
  defaultSizes = [50, 50],
  syncScroll = false,
  className = "",
}) => {
  const [splitDirection, setSplitDirection] =
    useState<SplitDirection>(direction);
  const [terminalProps, setTerminalProps] =
    useState<[TerminalProps, TerminalProps]>(terminals);

  // Toggle split direction between horizontal and vertical
  const toggleDirection = useCallback(() => {
    setSplitDirection((prev) =>
      prev === "horizontal" ? "vertical" : "horizontal",
    );
  }, []);

  // Generate unique IPs for terminals if not provided
  React.useEffect(() => {
    setTerminalProps((prev) => {
      return [
        {
          ...prev[0],
          ipAddress:
            prev[0].ipAddress ||
            `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          title: prev[0].title || "Terminal 1",
        },
        {
          ...prev[1],
          ipAddress:
            prev[1].ipAddress ||
            `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          title: prev[1].title || "Terminal 2",
        },
      ];
    });
  }, []);

  // Keyboard shortcuts for split operations
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Alt+Shift+H for horizontal split
    if (e.altKey && e.shiftKey && e.key === "H") {
      setSplitDirection("horizontal");
    }
    // Alt+Shift+V for vertical split
    else if (e.altKey && e.shiftKey && e.key === "V") {
      setSplitDirection("vertical");
    }
  }, []);

  // Add keyboard shortcut listeners
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className={`split-terminal-container relative ${className}`}>
      <div className="split-terminal-controls absolute top-0 right-0 z-30 flex space-x-1 p-1">
        <button
          className="bg-night text-lime border border-lime px-2 py-1 text-xs rounded hover:bg-lime hover:text-night transition-colors"
          onClick={toggleDirection}
          title={`Switch to ${splitDirection === "horizontal" ? "vertical" : "horizontal"} split`}
        >
          {splitDirection === "horizontal" ? "↕" : "↔"}
        </button>
      </div>

      <SplitPane
        direction={splitDirection}
        defaultSizes={defaultSizes}
        syncScroll={syncScroll}
        className="h-full"
      >
        <Terminal {...terminalProps[0]} />
        <Terminal {...terminalProps[1]} />
      </SplitPane>
    </div>
  );
};

export default SplitTerminal;
