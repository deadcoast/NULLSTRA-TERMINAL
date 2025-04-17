import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from '../page';

// Mock the Terminal component
jest.mock('../../components/Terminal', () => {
  return function MockTerminal(props: any) {
    return (
      <div data-testid="mock-terminal">
        Mock Terminal - IP: {props.ipAddress}, Show Header:{' '}
        {props.showHeader ? 'Yes' : 'No'}, Show Status:{' '}
        {props.showStatus ? 'Yes' : 'No'}
      </div>
    );
  };
});

describe('Home() Home method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should render the Home component with the Terminal component', () => {
      // Test to ensure the Home component renders correctly with the Terminal component
      const { getByTestId } = render(<Home />);
      const terminalElement = getByTestId('mock-terminal');
      expect(terminalElement).toBeInTheDocument();
      expect(terminalElement).toHaveTextContent(
        'Mock Terminal - IP: 192.168.1.1, Show Header: Yes, Show Status: Yes'
      );
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle the absence of props gracefully in Terminal component', () => {
      // Test to ensure the Terminal component can handle missing props gracefully
      jest.mock('../../components/Terminal', () => {
        return function MockTerminal() {
          return (
            <div data-testid="mock-terminal">Mock Terminal - No Props</div>
          );
        };
      });

      const { getByTestId } = render(<Home />);
      const terminalElement = getByTestId('mock-terminal');
      expect(terminalElement).toBeInTheDocument();
      expect(terminalElement).toHaveTextContent('Mock Terminal - No Props');
    });
  });
});
