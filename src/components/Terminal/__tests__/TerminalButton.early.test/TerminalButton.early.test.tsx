import TerminalButton from "../../TerminalButton";

// src/components/Terminal/TerminalButton.test.tsx
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import React from "react";

// src/components/Terminal/TerminalButton.test.tsx
// Mock interface for TerminalButtonProps
interface MockTerminalButtonProps {
  children?: React.ReactNode;
  className?: string;
  icon: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  variant?: "primary" | "accent";
}

// Mock function for onClick
const mockOnClick = jest.fn();

// Test suite for TerminalButton
describe("TerminalButton() TerminalButton method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("should render with default props", () => {
      // Test to ensure the button renders with default props
      const props: MockTerminalButtonProps = {
        icon: "test-icon",
        onClick: jest.mocked(mockOnClick),
      } as any;

      const { getByRole } = render(<TerminalButton {...props} />);
      const button = getByRole("button", { name: "test-icon" });

      expect(button).toBeInTheDocument();
      expect(button).toHaveClass("terminal-button");
      expect(button).not.toHaveClass("terminal-button-active");
      expect(button).not.toHaveClass("terminal-button-disabled");
    });

    it("should call onClick when clicked", () => {
      // Test to ensure onClick is called when the button is clicked
      const props: MockTerminalButtonProps = {
        icon: "test-icon",
        onClick: jest.mocked(mockOnClick),
      } as any;

      const { getByRole } = render(<TerminalButton {...props} />);
      const button = getByRole("button", { name: "test-icon" });

      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalled();
    });

    it("should render with accent variant", () => {
      // Test to ensure the button renders with the accent variant
      const props: MockTerminalButtonProps = {
        icon: "test-icon",
        onClick: jest.mocked(mockOnClick),
        variant: "accent",
      } as any;

      const { getByRole } = render(<TerminalButton {...props} />);
      const button = getByRole("button", { name: "test-icon" });

      expect(button).toHaveClass("terminal-button-accent");
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("should not call onClick when disabled", () => {
      // Test to ensure onClick is not called when the button is disabled
      const props: MockTerminalButtonProps = {
        icon: "test-icon",
        onClick: jest.mocked(mockOnClick),
        disabled: true,
      } as any;

      const { getByRole } = render(<TerminalButton {...props} />);
      const button = getByRole("button", { name: "test-icon" });

      fireEvent.click(button);
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    it("should apply active class when active", () => {
      // Test to ensure the active class is applied when the button is active
      const props: MockTerminalButtonProps = {
        icon: "test-icon",
        onClick: jest.mocked(mockOnClick),
        active: true,
      } as any;

      const { getByRole } = render(<TerminalButton {...props} />);
      const button = getByRole("button", { name: "test-icon" });

      expect(button).toHaveClass("terminal-button-active");
    });

    it("should show tooltip on hover when not disabled", () => {
      // Test to ensure the tooltip is shown on hover when the button is not disabled
      const props: MockTerminalButtonProps = {
        icon: "test-icon",
        onClick: jest.mocked(mockOnClick),
      } as any;

      const { getByRole, getByText } = render(<TerminalButton {...props} />);
      const button = getByRole("button", { name: "test-icon" });

      fireEvent.mouseEnter(button);
      expect(getByText("test-icon")).toBeInTheDocument();

      fireEvent.mouseLeave(button);
      expect(getByText("test-icon")).not.toBeVisible();
    });
  });
});
