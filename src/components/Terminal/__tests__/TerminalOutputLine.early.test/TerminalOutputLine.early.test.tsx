import * as React from "react";
import TerminalOutputLine from "../../TerminalOutputLine";

// src/components/Terminal/__tests__/TerminalOutputLine.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// src/components/Terminal/__tests__/TerminalOutputLine.test.tsx
// Mock interface for TerminalOutputLineProps
interface MockTerminalOutputLineProps {
  type?: "command" | "error" | "warning" | "success" | "info" | "system";
  prefix?: string;
  timestamp?: string;
  children: React.ReactNode;
  className?: string;
}

describe("TerminalOutputLine() TerminalOutputLine method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("renders with all props provided", () => {
      // Test to ensure the component renders correctly with all props
      const props: MockTerminalOutputLineProps = {
        type: "success",
        prefix: ">",
        timestamp: "12:00",
        children: "Operation completed successfully",
        className: "custom-class",
      };

      render(<TerminalOutputLine {...props} />);

      expect(screen.getByText(">")).toBeInTheDocument();
      expect(screen.getByText("12:00")).toBeInTheDocument();
      expect(
        screen.getByText("Operation completed successfully"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Operation completed successfully").parentElement,
      ).toHaveClass("terminal-line-success custom-class");
    });

    it("renders without optional props", () => {
      // Test to ensure the component renders correctly without optional props
      const props: MockTerminalOutputLineProps = {
        children: "Default message",
      };

      render(<TerminalOutputLine {...props} />);

      expect(screen.getByText("Default message")).toBeInTheDocument();
      expect(screen.getByText("Default message").parentElement).toHaveClass(
        "terminal-line",
      );
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("renders with an unknown type", () => {
      // Test to ensure the component handles an unknown type gracefully
      const props: MockTerminalOutputLineProps = {
        type: "unknown" as "success", // Type assertion to a valid type for testing
        children: "Unknown type message",
      };

      render(<TerminalOutputLine {...props} />);

      expect(screen.getByText("Unknown type message")).toBeInTheDocument();
      expect(
        screen.getByText("Unknown type message").parentElement,
      ).toHaveClass("terminal-line");
    });

    it("renders with empty children", () => {
      // Test to ensure the component handles empty children gracefully
      const props: MockTerminalOutputLineProps = {
        children: "",
      };

      render(<TerminalOutputLine {...props} />);

      expect(screen.getByText("")).toBeInTheDocument();
      expect(screen.getByText("").parentElement).toHaveClass("terminal-line");
    });

    it("renders with null children", () => {
      // Test to ensure the component handles null children gracefully
      const props: MockTerminalOutputLineProps = {
        children: null as unknown as React.ReactNode,
      };

      render(<TerminalOutputLine {...props} />);

      expect(screen.queryByText("")).not.toBeInTheDocument();
    });
  });
});
