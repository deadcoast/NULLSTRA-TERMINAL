import React from 'react';
import TerminalDialog from '../../TerminalDialog';

// src/components/Terminal/TerminalDialog.test.tsx
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

// src/components/Terminal/TerminalDialog.test.tsx
// Mock interface for TerminalDialogProps
interface MockTerminalDialogProps {
  title: string;
  children: React.ReactNode;
  onClose?: jest.Mock;
  className?: string;
  showCloseButton?: boolean;
}

describe('TerminalDialog() TerminalDialog method', () => {
  // Happy paths
  describe('Happy paths', () => {
    it('should render the dialog with the given title and children', () => {
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: <div>Test Content</div>,
      } as any;

      render(<TerminalDialog {...mockProps} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should render with additional className if provided', () => {
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: <div>Test Content</div>,
        className: 'additional-class',
      } as any;

      render(<TerminalDialog {...mockProps} />);

      const dialogElement = screen
        .getByText('Test Title')
        .closest('.terminal-dialog');
      expect(dialogElement).toHaveClass('additional-class');
    });

    it('should render the close button if showCloseButton is true', () => {
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: <div>Test Content</div>,
        showCloseButton: true,
        onClose: jest.fn(),
      } as any;

      render(<TerminalDialog {...mockProps} />);

      expect(screen.getByRole('button', { name: /x/i })).toBeInTheDocument();
    });

    it('should call onClose when the close button is clicked', () => {
      const mockOnClose = jest.fn();
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: <div>Test Content</div>,
        showCloseButton: true,
        onClose: mockOnClose,
      } as any;

      render(<TerminalDialog {...mockProps} />);

      fireEvent.click(screen.getByRole('button', { name: /x/i }));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('should not render the close button if showCloseButton is false', () => {
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: <div>Test Content</div>,
        showCloseButton: false,
      } as any;

      render(<TerminalDialog {...mockProps} />);

      expect(
        screen.queryByRole('button', { name: /x/i })
      ).not.toBeInTheDocument();
    });

    it('should handle missing onClose gracefully when close button is clicked', () => {
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: <div>Test Content</div>,
        showCloseButton: true,
      } as any;

      render(<TerminalDialog {...mockProps} />);

      const closeButton = screen.getByRole('button', { name: /x/i });
      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton); // Should not throw an error
    });

    it('should render without crashing when no children are provided', () => {
      const mockProps: MockTerminalDialogProps = {
        title: 'Test Title',
        children: null,
      } as any;

      render(<TerminalDialog {...mockProps} />);

      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
  });
});
