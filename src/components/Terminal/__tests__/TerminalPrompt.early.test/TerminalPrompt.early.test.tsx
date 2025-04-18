import * as React from "react";
import TerminalPrompt from "../../TerminalPrompt";

// src/components/Terminal/__tests__/TerminalPrompt.test.tsx
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";

// src/components/Terminal/__tests__/TerminalPrompt.test.tsx
// Mock the Glitch component
jest.mock("../../../UI", () => ({
  Glitch: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock the SuggestionList component
jest.mock("../../SuggestionList", () => ({
  __esModule: true,
  default: ({
    suggestions,
    onSelect,
  }: {
    suggestions: string[];
    onSelect: (index: number) => void;
  }) => (
    <ul role="listbox">
      {suggestions.map((suggestion, index) => (
        <li
          key={index}
          role="option"
          aria-selected={index === 0}
          onClick={() => onSelect(index)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSelect(index);
            }
          }}
          tabIndex={0}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  ),
}));

// Mock the useCommandCompletion hook
jest.mock("../../../hooks", () => ({
  useCommandCompletion: () => ({
    suggestions: ["suggestion1", "suggestion2"],
    activeSuggestion: 0,
    completedValue: "",
    showSuggestions: true,
    navigateSuggestions: jest.fn(),
    selectSuggestion: jest.fn(),
    resetSuggestions: jest.fn(),
    handleTabCompletion: jest.fn(),
  }),
}));

describe("TerminalPrompt() TerminalPrompt method", () => {
  describe("Happy paths", () => {
    it("should render the TerminalPrompt with default props", () => {
      render(<TerminalPrompt />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("should call onSubmit when Enter is pressed", () => {
      const onSubmitMock = jest.fn();
      render(<TerminalPrompt onSubmit={onSubmitMock} />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test command" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(onSubmitMock).toHaveBeenCalledWith("test command");
    });

    it("should show suggestions when typing", () => {
      render(<TerminalPrompt />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });

      expect(screen.getByText("suggestion1")).toBeInTheDocument();
      expect(screen.getByText("suggestion2")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("should not call onSubmit when input is empty and Enter is pressed", () => {
      const onSubmitMock = jest.fn();
      render(<TerminalPrompt onSubmit={onSubmitMock} />);
      const input = screen.getByRole("textbox");

      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(onSubmitMock).not.toHaveBeenCalled();
    });

    it("should handle ArrowUp key for history navigation", () => {
      const onNavigateHistoryMock = jest.fn();
      render(<TerminalPrompt onNavigateHistory={onNavigateHistoryMock} />);
      const input = screen.getByRole("textbox");

      fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" });

      expect(onNavigateHistoryMock).toHaveBeenCalledWith("up");
    });

    it("should handle Ctrl+L for clearing the terminal", () => {
      const onClearMock = jest.fn();
      render(<TerminalPrompt onClear={onClearMock} />);
      const input = screen.getByRole("textbox");

      fireEvent.keyDown(input, { key: "l", code: "KeyL", ctrlKey: true });

      expect(onClearMock).toHaveBeenCalled();
    });

    it("should not show suggestions when disabled", () => {
      render(<TerminalPrompt disabled />);
      const input = screen.getByRole("textbox");

      fireEvent.change(input, { target: { value: "test" } });

      expect(screen.queryByText("suggestion1")).not.toBeInTheDocument();
      expect(screen.queryByText("suggestion2")).not.toBeInTheDocument();
    });
  });
});
