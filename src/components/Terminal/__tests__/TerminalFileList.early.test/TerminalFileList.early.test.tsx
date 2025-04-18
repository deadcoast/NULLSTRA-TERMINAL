import TerminalFileList from "../../TerminalFileList";

// src/components/Terminal/TerminalFileList.test.tsx
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// src/components/Terminal/TerminalFileList.test.tsx
describe("TerminalFileList() TerminalFileList method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the title correctly", () => {
      // Test to ensure the title is rendered correctly
      render(<TerminalFileList title="File List" files={[]} />);
      expect(screen.getByText("File List")).toBeInTheDocument();
    });

    it("should render files correctly", () => {
      // Test to ensure files are rendered correctly
      const files = ["file1.txt", "file2.txt"];
      render(<TerminalFileList title="Files" files={files} />);
      files.forEach((file) => {
        expect(screen.getByText(file)).toBeInTheDocument();
      });
    });

    it("should apply the className prop correctly", () => {
      // Test to ensure className prop is applied
      const { container } = render(
        <TerminalFileList title="Files" files={[]} className="custom-class" />,
      );
      expect(container.firstChild).toHaveClass("custom-class");
    });

    it("should call onFileClick when a file is clicked", () => {
      // Test to ensure onFileClick is called when a file is clicked
      const onFileClickMock = jest.fn();
      const files = ["file1.txt"];
      render(
        <TerminalFileList
          title="Files"
          files={files}
          onFileClick={onFileClickMock}
        />,
      );
      fireEvent.click(screen.getByText("file1.txt"));
      expect(onFileClickMock).toHaveBeenCalledWith("file1.txt");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should render without files", () => {
      // Test to ensure component renders correctly without files
      render(<TerminalFileList title="Empty List" files={[]} />);
      expect(screen.getByText("Empty List")).toBeInTheDocument();
    });

    it("should not call onFileClick if not provided", () => {
      // Test to ensure onFileClick is not called if not provided
      const files = ["file1.txt"];
      render(<TerminalFileList title="Files" files={files} />);
      fireEvent.click(screen.getByText("file1.txt"));
      // No assertion for onFileClick as it is not provided
    });

    it("should handle long file names gracefully", () => {
      // Test to ensure long file names are handled
      const longFileName = "a".repeat(100);
      render(<TerminalFileList title="Files" files={[longFileName]} />);
      expect(screen.getByText(longFileName)).toBeInTheDocument();
    });

    it("should handle special characters in file names", () => {
      // Test to ensure special characters in file names are handled
      const specialCharFileName = "file@#$%.txt";
      render(<TerminalFileList title="Files" files={[specialCharFileName]} />);
      expect(screen.getByText(specialCharFileName)).toBeInTheDocument();
    });
  });
});
