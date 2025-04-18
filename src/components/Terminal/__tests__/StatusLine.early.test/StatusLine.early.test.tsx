import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import StatusLine from "../../StatusLine";

// Mocking the updateTime function
// jest.mock("../StatusLine", () => {
//   const actual = jest.requireActual("../StatusLine");
//   return {
//     ...actual,
//     updateTime: jest.fn(),
//   };
// });

// Mocking React hooks
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useEffect: actual.useEffect,
    useState: actual.useState,
  };
});

describe("StatusLine() StatusLine method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the component with the given status", () => {
      // Arrange
      const status = "192.168.1.1";

      // Act
      render(<StatusLine status={status} />);

      // Assert
      expect(screen.getByText(status)).toBeInTheDocument();
    });

    it("should render the component with connected connection status", () => {
      // Arrange
      const status = "192.168.1.1";
      const connectionStatus = "connected";

      // Act
      render(
        <StatusLine status={status} connectionStatus={connectionStatus} />,
      );

      // Assert
      expect(screen.getByText("Connected")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle an empty status gracefully", () => {
      // Arrange
      const status = "";

      // Act
      render(<StatusLine status={status} />);

      // Assert
      expect(screen.getByText("Ready")).toBeInTheDocument();
    });

    it("should handle a very long status gracefully", () => {
      // Arrange
      const status = "123.456.789.012.345.678.901.234";

      // Act
      render(<StatusLine status={status} />);

      // Assert
      expect(screen.getByText(status)).toBeInTheDocument();
    });

    it("should display disconnected connection status correctly", () => {
      // Arrange
      const status = "192.168.1.1";
      const connectionStatus = "disconnected";

      // Act
      render(
        <StatusLine status={status} connectionStatus={connectionStatus} />,
      );

      // Assert
      expect(screen.getByText("Disconnected")).toBeInTheDocument();
    });
  });
});
