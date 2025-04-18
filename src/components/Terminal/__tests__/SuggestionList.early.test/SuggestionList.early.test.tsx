import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import SuggestionList from "../../SuggestionList";

describe("SuggestionList() SuggestionList method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("renders suggestions correctly", () => {
      // Test to ensure suggestions are rendered correctly
      const suggestions = ["command1", "command2", "command3"];
      const onSelect = jest.fn();
      render(
        <SuggestionList
          suggestions={suggestions}
          activeSuggestion={1}
          onSelect={onSelect}
        />,
      );

      suggestions.forEach((suggestion) => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    it("highlights the active suggestion", () => {
      // Test to ensure the active suggestion is highlighted
      const suggestions = ["command1", "command2", "command3"];
      const onSelect = jest.fn();
      render(
        <SuggestionList
          suggestions={suggestions}
          activeSuggestion={1}
          onSelect={onSelect}
        />,
      );

      const activeElement = screen.getByText("command2");
      expect(activeElement).toHaveClass(
        "bg-terminal-green text-terminal-black",
      );
    });

    it("calls onSelect with the correct index when a suggestion is clicked", () => {
      // Test to ensure onSelect is called with the correct index
      const suggestions = ["command1", "command2", "command3"];
      const onSelect = jest.fn();
      render(
        <SuggestionList
          suggestions={suggestions}
          activeSuggestion={1}
          onSelect={onSelect}
        />,
      );

      fireEvent.click(screen.getByText("command1"));
      expect(onSelect).toHaveBeenCalledWith(0);
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("returns null when there are no suggestions", () => {
      // Test to ensure component returns null when no suggestions are provided
      const onSelect = jest.fn();
      const { container } = render(
        <SuggestionList
          suggestions={[]}
          activeSuggestion={0}
          onSelect={onSelect}
        />,
      );
      expect(container.firstChild).toBeNull();
    });

    it("handles negative activeSuggestion index gracefully", () => {
      // Test to ensure negative activeSuggestion index does not break the component
      const suggestions = ["command1", "command2"];
      const onSelect = jest.fn();
      render(
        <SuggestionList
          suggestions={suggestions}
          activeSuggestion={-1}
          onSelect={onSelect}
        />,
      );

      suggestions.forEach((suggestion) => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    it("handles out-of-bounds activeSuggestion index gracefully", () => {
      // Test to ensure out-of-bounds activeSuggestion index does not break the component
      const suggestions = ["command1", "command2"];
      const onSelect = jest.fn();
      render(
        <SuggestionList
          suggestions={suggestions}
          activeSuggestion={10}
          onSelect={onSelect}
        />,
      );

      suggestions.forEach((suggestion) => {
        expect(screen.getByText(suggestion)).toBeInTheDocument();
      });
    });

    it("renders file and folder icons correctly when isCommand is false", () => {
      // Test to ensure file and folder icons are rendered correctly when isCommand is false
      const suggestions = ["file.txt", "folder/"];
      const onSelect = jest.fn();
      render(
        <SuggestionList
          suggestions={suggestions}
          activeSuggestion={0}
          onSelect={onSelect}
          isCommand={false}
        />,
      );

      expect(screen.getByText("📄")).toBeInTheDocument();
      expect(screen.getByText("📁")).toBeInTheDocument();
    });
  });
});
