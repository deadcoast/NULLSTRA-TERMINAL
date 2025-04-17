import React from "react";
import App from "../App";

// src/__tests__/App.test.tsx
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

// src/__tests__/App.test.tsx
// Mock the TerminalManager component
jest.mock("../../components", () => ({
  TerminalManager: jest.fn(() => <div>Mocked TerminalManager</div>),
}));

describe("App() App method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the TerminalManager when showTerminal is true", () => {
      // Test to ensure that the TerminalManager is rendered when showTerminal is true
      render(<App />);
      expect(screen.getByText("Mocked TerminalManager")).toBeInTheDocument();
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should not render the TerminalManager when showTerminal is false", () => {
      // Test to ensure that the TerminalManager is not rendered when showTerminal is false
      // We need to mock useState to return false for showTerminal
      jest
        .spyOn(React, "useState")
        .mockImplementationOnce(() => [false, jest.fn()]);

      render(<App />);
      expect(
        screen.queryByText("Mocked TerminalManager"),
      ).not.toBeInTheDocument();
    });
  });
});
