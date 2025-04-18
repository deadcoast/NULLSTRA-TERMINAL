import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import * as React from "react";
import StatusPanel from "../../StatusPanel";

// Mock the StatusTag component
jest.mock("../StatusTag", () => {
  const StatusTag = ({
    type,
    children,
  }: {
    type: string;
    children: React.ReactNode;
  }) => <div data-testid={`status-tag-${type}`}>{children}</div>;
  StatusTag.displayName = "StatusTag";
  return StatusTag;
});

// Mock the useEffect and useState hooks
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useState: originalReact.useState,
    useEffect: originalReact.useEffect,
  };
});

describe("StatusPanel() StatusPanel method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the StatusPanel with default values", () => {
      // Render the component
      render(<StatusPanel />);

      // Check if the component renders with default values
      expect(screen.getByText(/System Status:/)).toBeInTheDocument();
      expect(screen.getByTestId("status-tag-info")).toHaveTextContent(
        /MEM: \d+%/,
      );
      expect(screen.getByTestId("status-tag-success")).toHaveTextContent(
        /CPU: \d+%/,
      );
      expect(screen.getByTestId("status-tag-warning")).toHaveTextContent(
        /DISK: \d+%/,
      );
      expect(screen.getByTestId("status-tag-success")).toHaveTextContent(
        /NET: ONLINE/,
      );
    });

    it("should apply the provided className", () => {
      // Render the component with a custom className
      const customClassName = "custom-class";
      render(<StatusPanel className={customClassName} />);

      // Check if the custom className is applied
      const panelElement = screen.getByText(/System Status:/).closest("div");
      expect(panelElement).toHaveClass(customClassName);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle high CPU usage correctly", () => {
      // Mock useState to simulate high CPU usage
      jest
        .spyOn(React, "useState")
        .mockImplementationOnce(() => [32, jest.fn()]) // memoryUsage
        .mockImplementationOnce(() => [30, jest.fn()]) // cpuUsage
        .mockImplementationOnce(() => [65, jest.fn()]) // diskUsage
        .mockImplementationOnce(() => ["online", jest.fn()]); // networkStatus

      // Render the component
      render(<StatusPanel />);

      // Check if the CPU status is warning
      expect(screen.getByTestId("status-tag-warning")).toHaveTextContent(
        /CPU: 30%/,
      );
    });

    it("should handle degraded network status correctly", () => {
      // Mock useState to simulate degraded network status
      jest
        .spyOn(React, "useState")
        .mockImplementationOnce(() => [32, jest.fn()]) // memoryUsage
        .mockImplementationOnce(() => [15, jest.fn()]) // cpuUsage
        .mockImplementationOnce(() => [65, jest.fn()]) // diskUsage
        .mockImplementationOnce(() => ["degraded", jest.fn()]); // networkStatus

      // Render the component
      render(<StatusPanel />);

      // Check if the network status is warning
      expect(screen.getByTestId("status-tag-warning")).toHaveTextContent(
        /NET: DEGRADED/,
      );
    });

    it("should handle offline network status correctly", () => {
      // Mock useState to simulate offline network status
      jest
        .spyOn(React, "useState")
        .mockImplementationOnce(() => [32, jest.fn()]) // memoryUsage
        .mockImplementationOnce(() => [15, jest.fn()]) // cpuUsage
        .mockImplementationOnce(() => [65, jest.fn()]) // diskUsage
        .mockImplementationOnce(() => ["offline", jest.fn()]); // networkStatus

      // Render the component
      render(<StatusPanel />);

      // Check if the network status is error
      expect(screen.getByTestId("status-tag-error")).toHaveTextContent(
        /NET: OFFLINE/,
      );
    });
  });
});
