import TerminalStatusLine from "../../TerminalStatusLine";

// src/components/Terminal/__tests__/TerminalStatusLine.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// src/components/Terminal/__tests__/TerminalStatusLine.test.tsx
describe("TerminalStatusLine() TerminalStatusLine method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render with default props", () => {
      // Test to ensure the component renders with default props
      render(<TerminalStatusLine ipAddress="192.168.1.1" />);
      expect(screen.getByText("<192.168.1.1>")).toBeInTheDocument();
      expect(screen.getByText("[CONNECTED]")).toBeInTheDocument();
      expect(screen.queryByText("[PROCESSING]")).not.toBeInTheDocument();
      expect(
        screen.getByText(new RegExp("\\d{1,2}:\\d{2}:\\d{2}")),
      ).toBeInTheDocument();
    });

    it("should render with custom className", () => {
      // Test to ensure the component applies custom className
      render(
        <TerminalStatusLine ipAddress="192.168.1.1" className="custom-class" />,
      );
      expect(screen.getByText("<192.168.1.1>").closest("div")).toHaveClass(
        "custom-class",
      );
    });

    it("should display children when provided", () => {
      // Test to ensure children are rendered when provided
      render(
        <TerminalStatusLine ipAddress="192.168.1.1">
          Custom Child
        </TerminalStatusLine>,
      );
      expect(screen.getByText("Custom Child")).toBeInTheDocument();
    });

    it("should display timestamp when provided", () => {
      // Test to ensure the component displays the provided timestamp
      render(
        <TerminalStatusLine ipAddress="192.168.1.1" timestamp="12:34:56" />,
      );
      expect(screen.getByText("12:34:56")).toBeInTheDocument();
    });

    it("should display [PROCESSING] when isExecuting is true", () => {
      // Test to ensure the component displays [PROCESSING] when isExecuting is true
      render(<TerminalStatusLine ipAddress="192.168.1.1" isExecuting />);
      expect(screen.getByText("[PROCESSING]")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should display [DISCONNECTED] when isConnected is false", () => {
      // Test to ensure the component displays [DISCONNECTED] when isConnected is false
      render(
        <TerminalStatusLine ipAddress="192.168.1.1" isConnected={false} />,
      );
      expect(screen.getByText("[DISCONNECTED]")).toBeInTheDocument();
    });

    it("should handle empty ipAddress gracefully", () => {
      // Test to ensure the component handles an empty ipAddress gracefully
      render(<TerminalStatusLine ipAddress="" />);
      expect(screen.getByText("<>")).toBeInTheDocument();
    });

    it("should handle undefined timestamp gracefully", () => {
      // Test to ensure the component handles an undefined timestamp gracefully
      render(<TerminalStatusLine ipAddress="192.168.1.1" />);
      expect(
        screen.getByText(new RegExp("\\d{1,2}:\\d{2}:\\d{2}")),
      ).toBeInTheDocument();
    });

    it("should not render children when they are null", () => {
      // Test to ensure the component does not render children when they are null
      render(<TerminalStatusLine ipAddress="192.168.1.1" children={null} />);
      expect(screen.queryByText("Custom Child")).not.toBeInTheDocument();
    });
  });
});
