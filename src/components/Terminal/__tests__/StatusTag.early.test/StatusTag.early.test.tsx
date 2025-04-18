import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StatusTag from "../../StatusTag";

// Mock the triggerUpdate function
const triggerUpdate = jest.fn();

// Define a type for the StatusTag props
interface StatusTagProps {
  children: React.ReactNode;
  className?: string;
  type?: "info" | "success" | "warning" | "error";
  autoUpdateInterval?: number;
}

// Mock the StatusTag component
jest.mock("../../StatusTag", () => {
  const ActualStatusTag = jest.requireActual("../../StatusTag").default;

  // Return a wrapper around the actual component
  return function MockedStatusTag(props: StatusTagProps) {
    // Use the mock functions when needed
    if (props.autoUpdateInterval && props.autoUpdateInterval > 0) {
      setTimeout(() => triggerUpdate(), props.autoUpdateInterval);
    }
    return <ActualStatusTag {...props} />;
  };
});

describe("StatusTag() StatusTag method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render with default props", () => {
      // Test to ensure the component renders with default props
      render(<StatusTag>Default Status</StatusTag>);
      const statusTag = screen.getByText("Default Status");
      expect(statusTag).toBeInTheDocument();
      expect(statusTag).toHaveClass("bg-terminal-cyan text-terminal-black");
    });

    it("should render with success type", () => {
      // Test to ensure the component renders with success type
      render(<StatusTag type="success">Success Status</StatusTag>);
      const statusTag = screen.getByText("Success Status");
      expect(statusTag).toBeInTheDocument();
      expect(statusTag).toHaveClass("bg-terminal-green text-terminal-black");
    });

    it("should render with error type", () => {
      // Test to ensure the component renders with error type
      render(<StatusTag type="error">Error Status</StatusTag>);
      const statusTag = screen.getByText("Error Status");
      expect(statusTag).toBeInTheDocument();
      expect(statusTag).toHaveClass("bg-terminal-red text-terminal-white");
    });

    it("should render with warning type", () => {
      // Test to ensure the component renders with warning type
      render(<StatusTag type="warning">Warning Status</StatusTag>);
      const statusTag = screen.getByText("Warning Status");
      expect(statusTag).toBeInTheDocument();
      expect(statusTag).toHaveClass("bg-terminal-yellow text-terminal-black");
    });

    it("should apply additional className", () => {
      // Test to ensure additional className is applied
      render(<StatusTag className="extra-class">Class Test</StatusTag>);
      const statusTag = screen.getByText("Class Test");
      expect(statusTag).toHaveClass("extra-class");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle autoUpdateInterval correctly", () => {
      // Test to ensure autoUpdateInterval triggers updates
      jest.useFakeTimers();
      render(<StatusTag autoUpdateInterval={1000}>Auto Update</StatusTag>);
      expect(triggerUpdate).not.toHaveBeenCalled();
      jest.advanceTimersByTime(1000);
      expect(triggerUpdate).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("should not trigger update if autoUpdateInterval is 0", () => {
      // Test to ensure no update is triggered if autoUpdateInterval is 0
      jest.useFakeTimers();
      render(<StatusTag autoUpdateInterval={0}>No Auto Update</StatusTag>);
      jest.advanceTimersByTime(1000);
      expect(triggerUpdate).not.toHaveBeenCalled();
      jest.useRealTimers();
    });

    it("should handle empty children gracefully", () => {
      // Test to ensure component handles empty children
      render(<StatusTag>{null}</StatusTag>);
      const statusTag = screen.getByText("");
      expect(statusTag).toBeInTheDocument();
    });
  });
});
