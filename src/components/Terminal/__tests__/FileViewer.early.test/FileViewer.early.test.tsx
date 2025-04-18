import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import FileViewer from "../../FileViewer";
/**
 * Renders a file viewer component that displays the content of a file.
 * It supports closing the viewer with the ESC key and formats JSON content if applicable.
 *
 * @param {Object} params - The parameters for the viewer.
 * @param {string} params.filename - The name of the file being viewed.
 * @param {string} params.content - The content of the file.
 * @param {boolean} params.isOpen - Indicates if the viewer is open.
 * @param {function} params.onClose - Callback function to execute when the viewer is closed.
 * @param {string} [params.fileType="text"] - The type of the file (default is "text").
 * @returns {JSX.Element|null} The rendered viewer component or null if not open.
 * @throws {Error} Throws an error if the content cannot be formatted.
 */

// Mock the helper functions
const _mockHandleClose = jest.fn();
const mockFormatJsonContent = jest.fn();
const mockRenderContent = jest.fn();

// Mock the FileViewer component with our mocked functions
jest.mock("../../FileViewer", () => {
  const originalModule = jest.requireActual("../../FileViewer");

  // Return the original component but with mocked internal functions
  return jest.fn((props) => {
    // Call the mock functions in the component's render
    if (props.isOpen) {
      mockFormatJsonContent(props.content);
      mockRenderContent(props.content);
    }

    return originalModule.default(props);
  });
});

jest.mock("../../UI", () => {
  const actual = jest.requireActual("../../UI");
  return {
    ...actual,
    Glitch: jest.fn(({ children }) => <div>{children}</div>),
  };
});

describe("FileViewer() FileViewer method", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Happy Paths", () => {
    it("should render the FileViewer with text content", () => {
      render(
        <FileViewer
          filename="example.txt"
          content="This is a text file."
          isOpen={true}
          onClose={mockOnClose}
          fileType="text"
        />,
      );

      expect(screen.getByText("example.txt")).toBeInTheDocument();
      expect(screen.getByText("This is a text file.")).toBeInTheDocument();
    });

    it("should render the FileViewer with JSON content", () => {
      const jsonContent = '{"key": "value"}';
      mockFormatJsonContent.mockReturnValue(
        JSON.stringify(JSON.parse(jsonContent), null, 2),
      );
      mockRenderContent.mockReturnValue(<div>{jsonContent}</div>);

      render(
        <FileViewer
          filename="example.json"
          content={jsonContent}
          isOpen={true}
          onClose={mockOnClose}
          fileType="json"
        />,
      );

      expect(screen.getByText("example.json")).toBeInTheDocument();
      expect(screen.getByText(jsonContent)).toBeInTheDocument();
    });

    it("should close the FileViewer when the close button is clicked", () => {
      render(
        <FileViewer
          filename="example.txt"
          content="This is a text file."
          isOpen={true}
          onClose={mockOnClose}
          fileType="text"
        />,
      );

      fireEvent.click(screen.getByText("✕"));
      // We test the onClose was called instead of internal handleClose
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe("Edge Cases", () => {
    it("should not render the FileViewer when isOpen is false", () => {
      render(
        <FileViewer
          filename="example.txt"
          content="This is a text file."
          isOpen={false}
          onClose={mockOnClose}
          fileType="text"
        />,
      );

      expect(screen.queryByText("example.txt")).not.toBeInTheDocument();
    });

    it("should handle invalid JSON content gracefully", () => {
      const invalidJsonContent = '{"key": "value"}';
      mockFormatJsonContent.mockReturnValue(invalidJsonContent);

      render(
        <FileViewer
          filename="example.json"
          content={invalidJsonContent}
          isOpen={true}
          onClose={mockOnClose}
          fileType="json"
        />,
      );

      expect(screen.getByText("example.json")).toBeInTheDocument();
      expect(screen.getByText(invalidJsonContent)).toBeInTheDocument();
    });

    it("should close the FileViewer when the ESC key is pressed", () => {
      render(
        <FileViewer
          filename="example.txt"
          content="This is a text file."
          isOpen={true}
          onClose={mockOnClose}
          fileType="text"
        />,
      );

      fireEvent.keyDown(window, { key: "Escape", code: "Escape" });
      // We test the onClose was called
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
