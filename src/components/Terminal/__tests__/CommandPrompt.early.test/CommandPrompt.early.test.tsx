import CommandPrompt from "../../CommandPrompt";

/**
 * Renders a command input prompt that handles user input, command execution,
 * and navigation through command history. It provides visual feedback during
 * command execution and updates the input based on history navigation.
 *
 * @param {Object} params - The parameters for the command input.
 * @param {string} params.prompt - The prompt symbol to display.
 * @param {function} params.onSubmit - Callback function to handle command submission.
 * @param {Array<string>} params.history - Array of previously submitted commands.
 * @param {boolean} params.autoFocus - Whether the input should be focused automatically.
 * @param {boolean} params.disabled - Whether the input is disabled.
 * @returns {JSX.Element} The rendered command input component.
 * @throws {Error} Throws an error if the input is invalid during submission.
 */

// Import necessary libraries and components
import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";

// Import necessary libraries and components
// Mock the handleSubmit function
// jest.mock("../CommandPrompt", () => {
//   const actual = jest.requireActual("../CommandPrompt");
//   return {
//     __esModule: true,
//     ...actual,
//     handleSubmit: jest.fn(),
//   };
// });

// Mock React hooks used in the component
jest.mock("react", () => {
  const actual = jest.requireActual("react");
  return {
    ...actual,
    useRef: jest.fn(),
    useState: jest.fn(),
    useEffect: jest.fn(),
  };
});

describe("CommandPrompt() CommandPrompt method", () => {
  // Happy Path Tests
  describe("Happy Paths", () => {
    it("should render the component with default props", () => {
      // Test to ensure the component renders correctly with default props
      const { getByText, getByRole } = render(
        <CommandPrompt
          prompt="$"
          onSubmit={jest.fn()}
          history={[]}
          autoFocus={true}
        />,
      );

      expect(getByText("$")).toBeInTheDocument();
      expect(getByRole("textbox")).toBeInTheDocument();
    });

    it("should call onSubmit with the correct command when Enter is pressed", () => {
      // Test to ensure onSubmit is called with the correct command
      const mockOnSubmit = jest.fn();
      const { getByRole } = render(
        <CommandPrompt
          prompt="$"
          onSubmit={mockOnSubmit}
          history={[]}
          autoFocus={true}
        />,
      );

      const input = getByRole("textbox");
      fireEvent.change(input, { target: { value: "ls" } });
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(mockOnSubmit).toHaveBeenCalledWith("ls");
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    it("should not call onSubmit if the input is empty", () => {
      // Test to ensure onSubmit is not called when input is empty
      const mockOnSubmit = jest.fn();
      const { getByRole } = render(
        <CommandPrompt
          prompt="$"
          onSubmit={mockOnSubmit}
          history={[]}
          autoFocus={true}
        />,
      );

      const input = getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("should navigate history correctly with ArrowUp and ArrowDown keys", () => {
      // Test to ensure history navigation works with ArrowUp and ArrowDown keys
      const mockOnKeyPress = jest.fn();
      const { getByRole } = render(
        <CommandPrompt
          prompt="$"
          onSubmit={jest.fn()}
          history={["command1", "command2"]}
          autoFocus={true}
          onKeyPress={mockOnKeyPress}
        />,
      );

      const input = getByRole("textbox");
      fireEvent.keyDown(input, { key: "ArrowUp", code: "ArrowUp" });
      expect(mockOnKeyPress).toHaveBeenCalled();

      fireEvent.keyDown(input, { key: "ArrowDown", code: "ArrowDown" });
      expect(mockOnKeyPress).toHaveBeenCalled();
    });
  });
});
