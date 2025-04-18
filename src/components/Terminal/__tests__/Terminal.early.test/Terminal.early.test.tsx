import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import Terminal from "../../Terminal";

// Mocking nested components
jest.mock("../../FileViewer", () => jest.fn(() => <div>FileViewer</div>));
jest.mock("../../TerminalHeader", () =>
  jest.fn(() => <div>TerminalHeader</div>),
);
jest.mock("../../TerminalOutput", () =>
  jest.fn(() => <div>TerminalOutput</div>),
);
jest.mock("../../TerminalPrompt", () =>
  jest.fn(() => <div>TerminalPrompt</div>),
);
jest.mock("../../TerminalStatusLine", () =>
  jest.fn(() => <div>TerminalStatusLine</div>),
);

// Mocking hooks
jest.mock("../../../context/ThemeContext", () => ({
  useTheme: () => ({ theme: { cursorStyle: "block" } }),
}));

// Mock useSocket hook
const mockExecuteCommand = jest.fn();
jest.mock("../../../../hooks/useSocket", () => ({
  useSocket: jest.fn(() => ({
    isConnected: true,
    isExecuting: false,
    executeCommand: mockExecuteCommand,
    commandResults: [],
    error: null,
    lastUpdate: new Date().toISOString(),
  })),
}));

// Import the mocked useSocket function
import { useSocket } from "../../../../hooks/useSocket";

describe("Terminal() Terminal method", () => {
  beforeEach(() => {
    // Reset the mock before each test
    mockExecuteCommand.mockClear();
  });

  describe("Happy Paths", () => {
    test("renders Terminal with default props", () => {
      // Render the Terminal component
      render(<Terminal />);

      // Check if the TerminalHeader is rendered
      expect(screen.getByText("TerminalHeader")).toBeInTheDocument();

      // Check if the TerminalOutput is rendered
      expect(screen.getByText("TerminalOutput")).toBeInTheDocument();

      // Check if the TerminalPrompt is rendered
      expect(screen.getByText("TerminalPrompt")).toBeInTheDocument();

      // Check if the TerminalStatusLine is rendered
      expect(screen.getByText("TerminalStatusLine")).toBeInTheDocument();
    });

    test("handles command submission", () => {
      render(<Terminal />);

      // Simulate command submission
      fireEvent.change(screen.getByText("TerminalPrompt"), {
        target: { value: "test command" },
      });
      fireEvent.keyDown(screen.getByText("TerminalPrompt"), {
        key: "Enter",
        code: "Enter",
      });

      // Check if executeCommand was called
      expect(mockExecuteCommand).toHaveBeenCalledWith("test command");
    });
  });

  describe("Edge Cases", () => {
    test("handles empty command submission", () => {
      render(<Terminal />);

      // Simulate empty command submission
      fireEvent.change(screen.getByText("TerminalPrompt"), {
        target: { value: "" },
      });
      fireEvent.keyDown(screen.getByText("TerminalPrompt"), {
        key: "Enter",
        code: "Enter",
      });

      // Check if executeCommand was not called
      expect(mockExecuteCommand).not.toHaveBeenCalled();
    });

    test("navigates command history", () => {
      render(<Terminal />);

      // Simulate command history navigation
      fireEvent.keyDown(screen.getByText("TerminalPrompt"), {
        key: "ArrowUp",
        code: "ArrowUp",
      });

      // Check if the input value changes according to history
      expect(screen.getByText("TerminalPrompt")).toHaveValue("");
    });

    test("displays error message when error occurs", () => {
      // Override the mock to include an error
      (useSocket as jest.Mock).mockReturnValueOnce({
        isConnected: true,
        isExecuting: false,
        executeCommand: mockExecuteCommand,
        commandResults: [],
        error: "Test error",
        lastUpdate: new Date().toISOString(),
      });

      render(<Terminal />);

      // Check if error message is displayed
      expect(screen.getByText("Error: Test error")).toBeInTheDocument();
    });
  });
});
