import React from "react";
import TerminalWindow from "../../TerminalWindow";

// src/components/Terminal/TerminalWindow.test.tsx
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

// src/components/Terminal/TerminalWindow.test.tsx
// Mock interface for TerminalWindowProps
interface MockTerminalWindowProps {
  children: React.ReactNode;
  className?: string;
  isProcessing?: boolean;
}

// Mocking ReactNode
const MockReactNode: React.FC = () => <div>Mock Child</div>;

describe("TerminalWindow() TerminalWindow method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("should render the TerminalWindow with default props", () => {
      // Arrange
      const mockProps: MockTerminalWindowProps = {
        children: <MockReactNode />,
      } as any;

      // Act
      const { container } = render(<TerminalWindow {...mockProps} />);

      // Assert
      expect(container.firstChild).toHaveClass("terminal-window");
      expect(container.querySelector(".terminal-background")).not.toHaveClass(
        "processing",
      );
      expect(container.querySelector(".terminal-content")).toContainHTML(
        "<div>Mock Child</div>",
      );
    });

    it("should apply custom className", () => {
      // Arrange
      const mockProps: MockTerminalWindowProps = {
        children: <MockReactNode />,
        className: "custom-class",
      } as any;

      // Act
      const { container } = render(<TerminalWindow {...mockProps} />);

      // Assert
      expect(container.firstChild).toHaveClass("terminal-window custom-class");
    });

    it("should render with processing class when isProcessing is true", () => {
      // Arrange
      const mockProps: MockTerminalWindowProps = {
        children: <MockReactNode />,
        isProcessing: true,
      } as any;

      // Act
      const { container } = render(<TerminalWindow {...mockProps} />);

      // Assert
      expect(container.querySelector(".terminal-background")).toHaveClass(
        "processing",
      );
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should handle empty children gracefully", () => {
      // Arrange
      const mockProps: MockTerminalWindowProps = {
        children: null,
      } as any;

      // Act
      const { container } = render(<TerminalWindow {...mockProps} />);

      // Assert
      expect(
        container.querySelector(".terminal-content"),
      ).toBeEmptyDOMElement();
    });

    it("should handle undefined className gracefully", () => {
      // Arrange
      const mockProps: MockTerminalWindowProps = {
        children: <MockReactNode />,
        className: undefined,
      } as any;

      // Act
      const { container } = render(<TerminalWindow {...mockProps} />);

      // Assert
      expect(container.firstChild).toHaveClass("terminal-window");
    });

    it("should handle undefined isProcessing gracefully", () => {
      // Arrange
      const mockProps: MockTerminalWindowProps = {
        children: <MockReactNode />,
        isProcessing: undefined,
      } as any;

      // Act
      const { container } = render(<TerminalWindow {...mockProps} />);

      // Assert
      expect(container.querySelector(".terminal-background")).not.toHaveClass(
        "processing",
      );
    });
  });
});
