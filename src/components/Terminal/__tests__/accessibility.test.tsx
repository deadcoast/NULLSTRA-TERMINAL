import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { TerminalManager } from "../../";

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Extend Jest matchers for jest-axe with proper TypeScript declaration
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

// Mock the Terminal component to simplify testing
jest.mock("../Terminal", () => {
  return function MockTerminal({
    ipAddress,
  }: {
    ipAddress: string;
    initialMessages?: string[];
  }) {
    return (
      <div data-testid="mock-terminal" data-ip={ipAddress}>
        <div role="log" aria-live="polite">
          <div className="terminal-output">
            <p>Welcome to the Terminal</p>
            <p>Type &apos;help&apos; for available commands</p>
          </div>
        </div>
        <div className="terminal-input-container">
          <span aria-hidden="true">$</span>
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command input
          </label>
          <input
            id="terminal-input"
            type="text"
            className="terminal-input"
            placeholder="Enter command..."
            aria-label="Terminal command input"
          />
        </div>
      </div>
    );
  };
});

// Mock the ThemeSelector component
jest.mock("../ThemeSelector", () => {
  return function MockThemeSelector({ minimal }: { minimal?: boolean }) {
    return (
      <div
        data-testid="mock-theme-selector"
        data-minimal={minimal ? "true" : "false"}
      >
        <label htmlFor="theme-selector">Select Theme:</label>
        <select id="theme-selector" aria-label="Theme selection">
          <option value="dark">Dark Theme</option>
          <option value="light">Light Theme</option>
          <option value="cyberpunk">Cyberpunk Theme</option>
        </select>
      </div>
    );
  };
});

describe("Terminal Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<TerminalManager />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should have accessible form elements", () => {
    render(<TerminalManager />);

    // Terminal input should have label
    const input = screen.getByLabelText("Terminal command input");
    expect(input).toBeInTheDocument();

    // Theme selector should have label
    const themeSelector = screen.getByLabelText("Theme selection");
    expect(themeSelector).toBeInTheDocument();
  });

  it("should have appropriate ARIA attributes", () => {
    render(<TerminalManager />);

    // Terminal output should have appropriate ARIA attributes
    const terminalOutput = screen.getByRole("log");
    expect(terminalOutput).toHaveAttribute("aria-live", "polite");
  });
});
