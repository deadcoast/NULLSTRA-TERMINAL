import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import RootLayout from "../layout";

// Mocking the localFont function from 'next/font/local'
jest.mock("next/font/local", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    variable: "--font-terminal",
  })),
}));

describe("RootLayout() RootLayout method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render children correctly", () => {
      // Test to ensure children are rendered within the RootLayout
      const { getByText } = render(
        <RootLayout>
          <div>Test Child</div>
        </RootLayout>,
      );
      expect(getByText("Test Child")).toBeInTheDocument();
    });

    it("should apply the correct HTML structure and classes", () => {
      // Test to ensure the correct HTML structure and classes are applied
      const { container } = render(
        <RootLayout>
          <div>Test Child</div>
        </RootLayout>,
      );
      const htmlElement = container.querySelector("html");
      const bodyElement = container.querySelector("body");

      expect(htmlElement).toHaveAttribute("lang", "en");
      expect(htmlElement).toHaveClass("--font-terminal", "font-sans", "h-full");
      expect(bodyElement).toHaveClass("antialiased", "h-full");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should handle empty children gracefully", () => {
      // Test to ensure the component handles empty children gracefully
      const { container } = render(<RootLayout>{null}</RootLayout>);
      const bodyElement = container.querySelector("body");
      expect(bodyElement).toBeEmptyDOMElement();
    });

    it("should handle undefined children gracefully", () => {
      // Test to ensure the component handles undefined children gracefully
      const { container } = render(<RootLayout>{undefined}</RootLayout>);
      const bodyElement = container.querySelector("body");
      expect(bodyElement).toBeEmptyDOMElement();
    });
  });
});
