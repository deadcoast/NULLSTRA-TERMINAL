import { fireEvent, render, screen } from '@testing-library/react';
import { TerminalManager } from '../../';

// Mock the Terminal component to avoid rendering the full terminal
jest.mock('../Terminal', () => {
  return function MockTerminal({ ipAddress }: { ipAddress: string }) {
    return (
      <div data-testid="mock-terminal" data-ip={ipAddress}>
        Mock Terminal Content
      </div>
    );
  };
});

// Mock the ThemeSelector component
jest.mock('../ThemeSelector', () => {
  return function MockThemeSelector({ minimal }: { minimal?: boolean }) {
    return (
      <div
        data-testid="mock-theme-selector"
        data-minimal={minimal ? 'true' : 'false'}
      >
        Theme Selector
      </div>
    );
  };
});

describe('TerminalManager', () => {
  const mockRandomValue = 123;

  // Mock Math.random to return predictable values for testing
  const originalRandom = Math.random;
  beforeEach(() => {
    Math.random = jest.fn(() => 0.5);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  test('renders with default session when no initialSessions provided', () => {
    render(<TerminalManager />);

    // Check if a default session is created
    expect(screen.getByText('Main Terminal')).toBeInTheDocument();

    // Check if Terminal component is rendered with the right IP
    const terminalElement = screen.getByTestId('mock-terminal');
    expect(terminalElement).toHaveAttribute(
      'data-ip',
      expect.stringMatching(/^192\.168\.\d+\.\d+$/)
    );

    // Check if ThemeSelector is rendered
    expect(screen.getByTestId('mock-theme-selector')).toBeInTheDocument();
  });

  test('renders with provided initialSessions', () => {
    const initialSessions = [
      {
        id: 'test-id-1',
        name: 'Test Terminal 1',
        ipAddress: '10.0.0.1',
      },
      {
        id: 'test-id-2',
        name: 'Test Terminal 2',
        ipAddress: '10.0.0.2',
      },
    ];

    render(<TerminalManager initialSessions={initialSessions} />);

    // Check if both session tabs are rendered
    expect(screen.getByText('Test Terminal 1')).toBeInTheDocument();
    expect(screen.getByText('Test Terminal 2')).toBeInTheDocument();

    // Check if the first terminal is active by default
    const terminalElement = screen.getByTestId('mock-terminal');
    expect(terminalElement).toHaveAttribute('data-ip', '10.0.0.1');
  });

  test('creates a new terminal session when "New Terminal" button is clicked', () => {
    // Mock Date.now() to return a predictable value
    const originalDateNow = Date.now;
    Date.now = jest.fn(() => 1234567890);

    render(<TerminalManager />);

    // Click the New Terminal button
    fireEvent.click(screen.getByText('+ New Terminal'));

    // Check if a new terminal tab is created
    expect(screen.getByText('Terminal 2')).toBeInTheDocument();

    // Check if the new terminal is active
    const terminalElement = screen.getByTestId('mock-terminal');
    expect(terminalElement).toHaveAttribute(
      'data-ip',
      expect.stringMatching(/^192\.168\.\d+\.\d+$/)
    );

    // Restore original Date.now
    Date.now = originalDateNow;
  });

  test('switches to a different terminal when clicked', () => {
    const initialSessions = [
      {
        id: 'test-id-1',
        name: 'Test Terminal 1',
        ipAddress: '10.0.0.1',
      },
      {
        id: 'test-id-2',
        name: 'Test Terminal 2',
        ipAddress: '10.0.0.2',
      },
    ];

    render(<TerminalManager initialSessions={initialSessions} />);

    // Check if the first terminal is active by default
    let terminalElement = screen.getByTestId('mock-terminal');
    expect(terminalElement).toHaveAttribute('data-ip', '10.0.0.1');

    // Click the second terminal tab
    fireEvent.click(screen.getByText('Test Terminal 2'));

    // Check if the second terminal is now active
    terminalElement = screen.getByTestId('mock-terminal');
    expect(terminalElement).toHaveAttribute('data-ip', '10.0.0.2');
  });

  test('closes a terminal session when the close button is clicked', () => {
    const initialSessions = [
      {
        id: 'test-id-1',
        name: 'Test Terminal 1',
        ipAddress: '10.0.0.1',
      },
      {
        id: 'test-id-2',
        name: 'Test Terminal 2',
        ipAddress: '10.0.0.2',
      },
    ];

    render(<TerminalManager initialSessions={initialSessions} />);

    // There should be 2 terminal tabs
    expect(screen.getByText('Test Terminal 1')).toBeInTheDocument();
    expect(screen.getByText('Test Terminal 2')).toBeInTheDocument();

    // Find all close buttons and click the first one
    const closeButtons = screen.getAllByText('✕');
    expect(closeButtons.length).toBe(2);
    fireEvent.click(closeButtons[0]);

    // The first terminal tab should be removed
    expect(screen.queryByText('Test Terminal 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Terminal 2')).toBeInTheDocument();

    // The second terminal should be active
    const terminalElement = screen.getByTestId('mock-terminal');
    expect(terminalElement).toHaveAttribute('data-ip', '10.0.0.2');
  });

  test('does not render the "New Terminal" button when maxSessions is reached', () => {
    const initialSessions = [
      { id: 'test-id-1', name: 'Test Terminal 1', ipAddress: '10.0.0.1' },
      { id: 'test-id-2', name: 'Test Terminal 2', ipAddress: '10.0.0.2' },
    ];

    render(
      <TerminalManager initialSessions={initialSessions} maxSessions={2} />
    );

    // The "New Terminal" button should not be visible
    expect(screen.queryByText('+ New Terminal')).not.toBeInTheDocument();
  });
});
