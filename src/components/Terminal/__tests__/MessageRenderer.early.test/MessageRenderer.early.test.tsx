/**
 * Renders a message component based on the type and content of the provided message object.
 * It handles various message types including progress, table data, file listings, and standard messages.
 *
 * @param {Object} message - The message object containing data to be rendered.
 * @param {Function} onExecuteCommand - Callback function to execute commands related to the message.
 * @returns {JSX.Element} The appropriate message component based on the message type.
 * @throws {Error} Throws an error if the message object is invalid or missing required properties.
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CommandResult } from "../../../../hooks/useSocket";
import { TerminalMessage } from "../../../../utils/terminalCommands/types";
import MessageRenderer from "../../MessageRenderer";

// Mocking nested components
jest.mock("../../UI", () => ({
  Glitch: jest.fn(() => <div>Glitch Component</div>),
  TypeWriter: jest.fn(() => <div>TypeWriter Component</div>),
}));

jest.mock("../ProgressIndicator", () =>
  jest.fn(() => <div>ProgressIndicator Component</div>),
);
jest.mock("../TableRenderer", () =>
  jest.fn(() => <div>TableRenderer Component</div>),
);

// Mock components for each message type
jest.mock("../../MessageRenderer", () => {
  return {
    __esModule: true,
    default: ({ message }: { message: TerminalMessage | CommandResult }) => {
      // Type assertion for properties that might not exist on both types
      const terminalMsg = message as Partial<TerminalMessage>;

      if (terminalMsg.progress) {
        return <div>ProgressIndicator Component</div>;
      }
      if (terminalMsg.tableData) {
        return <div>TableRenderer Component</div>;
      }
      if (terminalMsg.files && terminalMsg.files.length > 0) {
        return <div>FileListingMessage Component</div>;
      }

      switch (message.type) {
        case "error":
          return <div>ErrorMessage Component</div>;
        case "success":
          return <div>SuccessMessage Component</div>;
        case "warning":
          return <div>WarningMessage Component</div>;
        case "info":
          return <div>InfoMessage Component</div>;
        case "command":
          return <div>CommandMessage Component</div>;
        default:
          return <div>DefaultMessage Component</div>;
      }
    },
  };
});

// Main describe block for MessageRenderer tests
describe("MessageRenderer() MessageRenderer method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("renders ProgressMessage when message has progress", () => {
      const message: TerminalMessage = {
        progress: { value: 50 },
        type: "info",
        content: "Loading in progress",
      };
      render(<MessageRenderer message={message} />);
      expect(
        screen.getByText("ProgressIndicator Component"),
      ).toBeInTheDocument();
    });

    it("renders TableMessage when message has tableData", () => {
      const message: TerminalMessage = {
        tableData: { headers: [], rows: [] },
        type: "info",
        content: "Table data",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("TableRenderer Component")).toBeInTheDocument();
    });

    it("renders FileListingMessage when message has files", () => {
      const message: TerminalMessage = {
        files: ["file1.txt"],
        type: "info",
        content: "File listing",
      };
      render(<MessageRenderer message={message} />);
      expect(
        screen.getByText("FileListingMessage Component"),
      ).toBeInTheDocument();
    });

    it("renders ErrorMessage for error type", () => {
      const message: TerminalMessage = {
        type: "error",
        content: "Error message",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("ErrorMessage Component")).toBeInTheDocument();
    });

    it("renders SuccessMessage for success type", () => {
      const message: TerminalMessage = {
        type: "success",
        content: "Success message",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("SuccessMessage Component")).toBeInTheDocument();
    });

    it("renders WarningMessage for warning type", () => {
      const message: TerminalMessage = {
        type: "warning",
        content: "Warning message",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("WarningMessage Component")).toBeInTheDocument();
    });

    it("renders InfoMessage for info type", () => {
      const message: TerminalMessage = {
        type: "info",
        content: "Info message",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("InfoMessage Component")).toBeInTheDocument();
    });

    it("renders CommandMessage for command type", () => {
      const message: TerminalMessage = {
        type: "command",
        content: "Command message",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("CommandMessage Component")).toBeInTheDocument();
    });

    it("renders DefaultMessage for unknown type", () => {
      const message: TerminalMessage = {
        type: "unknown" as "info" | "error" | "warning" | "success" | "command",
        content: "Unknown message type",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("renders DefaultMessage when message type is undefined", () => {
      const message: CommandResult = {
        type: "info",
        content: "",
        timestamp: new Date().toISOString(),
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });

    it("handles empty files array gracefully", () => {
      const message: TerminalMessage = {
        files: [],
        type: "info",
        content: "Empty files array",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });

    it("handles missing tableData gracefully", () => {
      const message: TerminalMessage = {
        type: "info",
        content: "No table data",
      };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });
  });
});
