import TableRenderer from "../../TableRenderer";

// Import necessary libraries and components
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

// Import necessary libraries and components
// Mock the necessary functions and components
// jest.mock("../TableRenderer", () => {
//   const actual = jest.requireActual("../TableRenderer");
//   return {
//     ...actual,
//     getColumnWidths: jest.fn(),
//     generateBorder: jest.fn(),
//   };
// });

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
      jest.mocked(getColumnWidths).mockReturnValue([10, 5]);
      jest.mocked(generateBorder).mockReturnValue("mocked-border");

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
      jest.mocked(getColumnWidths).mockReturnValue([10, 5]);
      jest.mocked(generateBorder).mockReturnValue("mocked-border");

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
      jest.mocked(getColumnWidths).mockReturnValue([]);
      jest.mocked(generateBorder).mockReturnValue("mocked-border");

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
      jest.mocked(getColumnWidths).mockReturnValue([10, 5]);
      jest.mocked(generateBorder).mockReturnValue("mocked-border");

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
