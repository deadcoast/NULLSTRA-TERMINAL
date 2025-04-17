import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import TerminalOutput from '../../TerminalOutput';

// Mock the MessageRenderer component
jest.mock('../MessageRenderer', () => ({
  __esModule: true,
  default: ({ message }: any) => (
    <div data-testid="message-renderer">{JSON.stringify(message)}</div>
  ),
}));

// Mock the CommandResult and TerminalMessage types
const mockCommandResult = { type: 'commandResult', data: 'Command executed' };
const mockTerminalMessage = { type: 'terminalMessage', content: 'Hello World' };

describe('TerminalOutput() TerminalOutput method', () => {
  describe('Happy Paths', () => {
    it('renders messages correctly', () => {
      // Test to ensure that messages are rendered correctly
      const messages = [mockTerminalMessage, mockCommandResult];
      render(<TerminalOutput messages={messages} />);

      const renderedMessages = screen.getAllByTestId('message-renderer');
      expect(renderedMessages).toHaveLength(2);
      expect(renderedMessages[0]).toHaveTextContent(
        JSON.stringify(mockTerminalMessage)
      );
      expect(renderedMessages[1]).toHaveTextContent(
        JSON.stringify(mockCommandResult)
      );
    });

    it('renders with an empty messages array', () => {
      // Test to ensure that the component handles an empty messages array gracefully
      render(<TerminalOutput messages={[]} />);
      const renderedMessages = screen.queryAllByTestId('message-renderer');
      expect(renderedMessages).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles null messages gracefully', () => {
      // Test to ensure that the component handles null messages gracefully
      render(<TerminalOutput messages={null as any} />);
      const renderedMessages = screen.queryAllByTestId('message-renderer');
      expect(renderedMessages).toHaveLength(0);
    });

    it('handles undefined messages gracefully', () => {
      // Test to ensure that the component handles undefined messages gracefully
      render(<TerminalOutput messages={undefined as any} />);
      const renderedMessages = screen.queryAllByTestId('message-renderer');
      expect(renderedMessages).toHaveLength(0);
    });

    it('handles a large number of messages', () => {
      // Test to ensure that the component can handle a large number of messages
      const largeNumberOfMessages = Array.from({ length: 1000 }, (_, i) => ({
        type: 'terminalMessage',
        content: `Message ${i}`,
      }));
      render(<TerminalOutput messages={largeNumberOfMessages} />);
      const renderedMessages = screen.getAllByTestId('message-renderer');
      expect(renderedMessages).toHaveLength(1000);
    });
  });
});
