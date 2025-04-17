import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import TerminalManager from '../../TerminalManager';

// Mocking nested components
jest.mock('../../../context', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

jest.mock('../Terminal', () => ({
  __esModule: true,
  default: ({ ipAddress }: { ipAddress: string }) => (
    <div>Terminal: {ipAddress}</div>
  ),
}));

jest.mock('../ThemeSelector', () => ({
  __esModule: true,
  default: () => <div>ThemeSelector</div>,
}));

describe('TerminalManager() TerminalManager method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should render with default session when no initial sessions are provided', () => {
      render(<TerminalManager />);
      expect(screen.getByText(/Main Terminal/)).toBeInTheDocument();
    });

    it('should allow creating a new session', () => {
      render(<TerminalManager />);
      fireEvent.click(screen.getByText('+ New Terminal'));
      expect(screen.getAllByText(/Terminal/).length).toBe(2);
    });

    it('should switch active session when a tab is clicked', () => {
      render(<TerminalManager />);
      fireEvent.click(screen.getByText('+ New Terminal'));
      const newTab = screen.getAllByText(/Terminal/)[1];
      fireEvent.click(newTab);
      expect(newTab).toHaveClass('bg-lime text-night font-bold');
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should not allow creating more sessions than maxSessions', () => {
      render(<TerminalManager maxSessions={2} />);
      fireEvent.click(screen.getByText('+ New Terminal'));
      fireEvent.click(screen.getByText('+ New Terminal'));
      expect(screen.queryByText('+ New Terminal')).not.toBeInTheDocument();
    });

    it('should not close the last remaining session', () => {
      render(<TerminalManager />);
      const closeButton = screen.getByText('✕');
      fireEvent.click(closeButton);
      expect(screen.getByText(/Main Terminal/)).toBeInTheDocument();
    });

    it('should activate another session if the active one is closed', () => {
      render(<TerminalManager />);
      fireEvent.click(screen.getByText('+ New Terminal'));
      const newTab = screen.getAllByText(/Terminal/)[1];
      fireEvent.click(newTab);
      const closeButton = newTab.querySelector('button');
      if (closeButton) {
        fireEvent.click(closeButton);
      }
      expect(screen.getByText(/Main Terminal/)).toHaveClass(
        'bg-lime text-night font-bold'
      );
    });
  });
});
