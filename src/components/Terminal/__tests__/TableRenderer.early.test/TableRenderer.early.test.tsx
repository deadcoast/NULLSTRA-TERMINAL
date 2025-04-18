import TableRenderer from "../../TableRenderer";

// Import necessary libraries and components
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

// Mock the helper functions from TableRenderer
// These functions are defined in the TableRenderer component but not exported
const getColumnWidths = jest.fn();
const generateBorder = jest.fn();

// Mock the entire TableRenderer module
jest.mock("../../TableRenderer", () => {
  // Get the original component implementation
  const originalModule = jest.requireActual("../../TableRenderer");

  // Return a modified version with mocked helper functions
  return {
    __esModule: true,
    default: originalModule.default,
    getColumnWidths: getColumnWidths,
    generateBorder: generateBorder,
  };
});

jest.mock("../../UI", () => {
  const actual = jest.requireActual("../../UI");
  return {
    ...actual,
    Glitch: jest.fn(({ children }) => <div>{children}</div>),
  };
});

// Main describe block for TableRenderer tests
describe("TableRenderer() TableRenderer method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("renders table with title and glitch effect", () => {
      // Arrange
      const data = {
        headers: ["Name", "Age"],
        rows: [
          ["Alice", "30"],
          ["Bob", "25"],
        ],
      };
      const title = "User Table";
      const glitchEffect = true;

      // Mock implementations
      getColumnWidths.mockReturnValue([10, 5]);
      generateBorder.mockReturnValue("mocked-border");

      // Act
      const { getByText } = render(
        <TableRenderer data={data} title={title} glitchEffect={glitchEffect} />,
      );

      // Assert
      expect(getByText(title)).toBeInTheDocument();
      expect(getByText("mocked-border")).toBeInTheDocument();
      expect(getByText("Alice")).toBeInTheDocument();
      expect(getByText("Bob")).toBeInTheDocument();
    });

    it("renders table without title and glitch effect", () => {
      // Arrange
      const data = {
        headers: ["Name", "Age"],
        rows: [
          ["Alice", "30"],
          ["Bob", "25"],
        ],
      };

      // Mock implementations
      getColumnWidths.mockReturnValue([10, 5]);
      generateBorder.mockReturnValue("mocked-border");

      // Act
      const { queryByText } = render(<TableRenderer data={data} />);

      // Assert
      expect(queryByText("User Table")).not.toBeInTheDocument();
      expect(queryByText("mocked-border")).toBeInTheDocument();
      expect(queryByText("Alice")).toBeInTheDocument();
      expect(queryByText("Bob")).toBeInTheDocument();
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("handles empty data gracefully", () => {
      // Arrange
      const data = {
        headers: [],
        rows: [],
      };

      // Mock implementations
      getColumnWidths.mockReturnValue([]);
      generateBorder.mockReturnValue("mocked-border");

      // Act
      const { queryByText } = render(<TableRenderer data={data} />);

      // Assert
      expect(queryByText("mocked-border")).toBeInTheDocument();
      expect(queryByText("Alice")).not.toBeInTheDocument();
    });

    it("handles uneven row lengths", () => {
      // Arrange
      const data = {
        headers: ["Name", "Age"],
        rows: [["Alice"], ["Bob", "25"]],
      };

      // Mock implementations
      getColumnWidths.mockReturnValue([10, 5]);
      generateBorder.mockReturnValue("mocked-border");

      // Act
      const { getByText } = render(<TableRenderer data={data} />);

      // Assert
      expect(getByText("mocked-border")).toBeInTheDocument();
      expect(getByText("Alice")).toBeInTheDocument();
      expect(getByText("Bob")).toBeInTheDocument();
      expect(getByText("25")).toBeInTheDocument();
    });
  });
});
