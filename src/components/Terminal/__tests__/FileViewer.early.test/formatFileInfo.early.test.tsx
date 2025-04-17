// src/components/Terminal/__tests__/FileViewer.test.tsx
/**
 * Performs a specific operation on the input data and returns the result.
 * @param input - The data to be processed, which must be of type string.
 * @returns The processed result as a number.
 * @throws Error if the input is not a valid string or if processing fails.
 */

describe( "formatFileInfo() formatFileInfo method", () =>
{
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should return correct line and character count for a single line string", () => {
      const content = "Hello, World!";
      const result = formatFileInfo(content);
      expect(result).toBe("1 lines, 13 characters");
    });

    it("should return correct line and character count for a multi-line string", () => {
      const content = "Hello, World!\nThis is a test.\nAnother line.";
      const result = formatFileInfo(content);
      expect(result).toBe("3 lines, 42 characters");
    });

    it("should handle an empty string correctly", () => {
      const content = "";
      const result = formatFileInfo(content);
      expect(result).toBe("1 lines, 0 characters");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle a string with only newline characters", () => {
      const content = "\n\n\n";
      const result = formatFileInfo(content);
      expect(result).toBe("4 lines, 3 characters");
    });

    it("should handle a string with mixed line endings", () => {
      const content = "Line 1\r\nLine 2\nLine 3\rLine 4";
      const result = formatFileInfo(content);
      expect(result).toBe("4 lines, 29 characters");
    });

    it("should handle a very long single line string", () => {
      const content = "a".repeat(10000);
      const result = formatFileInfo(content);
      expect(result).toBe("1 lines, 10000 characters");
    });

    it("should handle a string with special characters", () => {
      const content =
        "Hello, World!\nThis is a test.\nSpecial chars: !@#$%^&*()_+";
      const result = formatFileInfo(content);
      expect(result).toBe("3 lines, 58 characters");
    });
  });
});
