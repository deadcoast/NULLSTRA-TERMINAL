import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import TerminalHeader from "../../TerminalHeader";

describe("TerminalHeader() TerminalHeader method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the title correctly", () => {
      // Test to ensure the title is rendered correctly
      render(<TerminalHeader title="Test Title" />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });

    it("should render the IP address when provided", () => {
      // Test to ensure the IP address is rendered when provided
      render(<TerminalHeader title="Test Title" ipAddress="192.168.1.1" />);
      expect(screen.getByText("(192.168.1.1)")).toBeInTheDocument();
    });

    it("should render control buttons when showControls is true", () => {
      // Test to ensure control buttons are rendered when showControls is true
      render(<TerminalHeader title="Test Title" showControls />);
      expect(screen.getByLabelText("Minimize")).toBeInTheDocument();
      expect(screen.getByLabelText("Maximize")).toBeInTheDocument();
      expect(screen.getByLabelText("Close")).toBeInTheDocument();
    });

    it("should apply gradient styles when useGradient is true", () => {
      // Test to ensure gradient styles are applied when useGradient is true
      render(<TerminalHeader title="Test Title" useGradient />);
      const header = screen.getByText("Test Title").closest("div");
      expect(header).toHaveClass("terminal-header-gradient");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle onMinimize callback when minimize button is clicked", () => {
      // Test to ensure onMinimize callback is called when minimize button is clicked
      const onMinimizeMock = jest.fn();
      render(
        <TerminalHeader
          title="Test Title"
          showControls
          onMinimize={onMinimizeMock}
        />,
      );
      fireEvent.click(screen.getByLabelText("Minimize"));
      expect(onMinimizeMock).toHaveBeenCalled();
    });

    it("should handle onMaximize callback when maximize button is clicked", () => {
      // Test to ensure onMaximize callback is called when maximize button is clicked
      const onMaximizeMock = jest.fn();
      render(
        <TerminalHeader
          title="Test Title"
          showControls
          onMaximize={onMaximizeMock}
        />,
      );
      fireEvent.click(screen.getByLabelText("Maximize"));
      expect(onMaximizeMock).toHaveBeenCalled();
    });

    it("should handle onClose callback when close button is clicked", () => {
      // Test to ensure onClose callback is called when close button is clicked
      const onCloseMock = jest.fn();
      render(
        <TerminalHeader
          title="Test Title"
          showControls
          onClose={onCloseMock}
        />,
      );
      fireEvent.click(screen.getByLabelText("Close"));
      expect(onCloseMock).toHaveBeenCalled();
    });

    it("should not render control buttons when showControls is false", () => {
      // Test to ensure control buttons are not rendered when showControls is false
      render(<TerminalHeader title="Test Title" />);
      expect(screen.queryByLabelText("Minimize")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Maximize")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
    });

    it("should render without crashing when no optional props are provided", () => {
      // Test to ensure the component renders without crashing when no optional props are provided
      render(<TerminalHeader title="Test Title" />);
      expect(screen.getByText("Test Title")).toBeInTheDocument();
    });
  });
});
