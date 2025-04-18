import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { CommandResult } from "../../../../hooks/useSocket";
import { TerminalMessage } from "../../../../utils/terminalCommands/types";
import TerminalOutput from "../../TerminalOutput";

// Mock the MessageRenderer component
jest.mock("../MessageRenderer", () => ({
  __esModule: true,
  default: ({ message }: { message: TerminalMessage | CommandResult }) => (
    <div data-testid="message-renderer">{JSON.stringify(message)}</div>
  ),
}));

// Mock the CommandResult and TerminalMessage types
const mockTerminalMessage: TerminalMessage = {
  type: "info",
  content: "Hello World",
  timestamp: "2023-01-01T00:00:00.000Z",
};
const mockCommandResult: CommandResult = {
  type: "command",
  content: "Command executed",
  timestamp: "2023-01-01T00:00:00.000Z",
};

describe("TerminalOutput() TerminalOutput method", () => {
  describe("Happy Paths", () => {
    it("renders messages correctly", () => {
      // Test to ensure that messages are rendered correctly
      const messages = [mockTerminalMessage, mockCommandResult];
      render(<TerminalOutput messages={messages} />);

      const renderedMessages = screen.getAllByTestId("message-renderer");
      expect(renderedMessages).toHaveLength(2);
      expect(renderedMessages[0]).toHaveTextContent(
        JSON.stringify(mockTerminalMessage),
      );
      expect(renderedMessages[1]).toHaveTextContent(
        JSON.stringify(mockCommandResult),
      );
    });

    it("renders with an empty messages array", () => {
      // Test to ensure that the component handles an empty messages array gracefully
      render(<TerminalOutput messages={[]} />);
      const renderedMessages = screen.queryAllByTestId("message-renderer");
      expect(renderedMessages).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("handles null messages gracefully", () => {
      // Test to ensure that the component handles null messages gracefully
      render(
        <TerminalOutput
          messages={null as unknown as (TerminalMessage | CommandResult)[]}
        />,
      );
      const renderedMessages = screen.queryAllByTestId("message-renderer");
      expect(renderedMessages).toHaveLength(0);
    });

    it("handles undefined messages gracefully", () => {
      // Test to ensure that the component handles undefined messages gracefully
      render(
        <TerminalOutput
          messages={undefined as unknown as (TerminalMessage | CommandResult)[]}
        />,
      );
      const renderedMessages = screen.queryAllByTestId("message-renderer");
      expect(renderedMessages).toHaveLength(0);
    });

    it("handles a large number of messages", () => {
      // Test to ensure that the component can handle a large number of messages
      const largeNumberOfMessages: TerminalMessage[] = Array.from(
        { length: 1000 },
        (_, i) => ({
          type: "info",
          content: `Message ${i}`,
          timestamp: new Date().toISOString(),
        }),
      );
      render(<TerminalOutput messages={largeNumberOfMessages} />);
      const renderedMessages = screen.getAllByTestId("message-renderer");
      expect(renderedMessages).toHaveLength(1000);
    });
  });
});
