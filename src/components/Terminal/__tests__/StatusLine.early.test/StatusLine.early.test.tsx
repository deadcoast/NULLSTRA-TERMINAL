import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import StatusLine from '../../StatusLine';

// Mocking the updateTime function
// jest.mock("../StatusLine", () => {
//   const actual = jest.requireActual("../StatusLine");
//   return {
//     ...actual,
//     updateTime: jest.fn(),
//   };
// });

// Mocking React hooks
jest.mock('react', () => {
  const actual = jest.requireActual('react');
  return {
    ...actual,
    useEffect: actual.useEffect,
    useState: actual.useState,
  };
});

describe('StatusLine() StatusLine method', () => {
  // Happy Path Tests
  describe('Happy Paths', () => {
    it('should render the component with the given IP address and default network status', () => {
      // Arrange
      const ipAddress = '192.168.1.1';

      // Act
      render(<StatusLine ipAddress={ipAddress} />);

      // Assert
      expect(screen.getByText(`<${ipAddress}>`)).toBeInTheDocument();
      expect(
        screen.getByText(/^\d{2}:\d{2}:\d{2} \| \d{2}\/\d{2}\/\d{2}$/)
      ).toBeInTheDocument();
    });

    it('should render the component with network active class when networkActive is true', () => {
      // Arrange
      const ipAddress = '192.168.1.1';
      const networkActive = true;

      // Act
      render(
        <StatusLine ipAddress={ipAddress} networkActive={networkActive} />
      );

      // Assert
      const ipElement = screen.getByText(`<${ipAddress}>`);
      expect(ipElement).toHaveClass('network-active');
    });
  });

  // Edge Case Tests
  describe('Edge Cases', () => {
    it('should handle an empty IP address gracefully', () => {
      // Arrange
      const ipAddress = '';

      // Act
      render(<StatusLine ipAddress={ipAddress} />);

      // Assert
      expect(screen.getByText('<>')).toBeInTheDocument();
    });

    it('should handle a very long IP address gracefully', () => {
      // Arrange
      const ipAddress = '123.456.789.012.345.678.901.234';

      // Act
      render(<StatusLine ipAddress={ipAddress} />);

      // Assert
      expect(screen.getByText(`<${ipAddress}>`)).toBeInTheDocument();
    });

    it('should not apply network-active class when networkActive is false', () => {
      // Arrange
      const ipAddress = '192.168.1.1';
      const networkActive = false;

      // Act
      render(
        <StatusLine ipAddress={ipAddress} networkActive={networkActive} />
      );

      // Assert
      const ipElement = screen.getByText(`<${ipAddress}>`);
      expect(ipElement).not.toHaveClass('network-active');
    });
  });
});
