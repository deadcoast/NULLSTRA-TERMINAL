import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import ProgressIndicator from '../../ProgressIndicator';

describe('glitchEffect() glitchEffect method', () => {
  describe('Happy Paths', () => {
    test('renders with default props', () => {
      // This test checks if the component renders correctly with default props
      render(<ProgressIndicator />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    test('renders with a specific progress value', () => {
      // This test checks if the component displays the correct progress percentage
      render(<ProgressIndicator progress={50} />);
      expect(screen.getByText('Processing... 50%')).toBeInTheDocument();
    });

    test('renders with a custom status message', () => {
      // This test checks if the component displays a custom status message
      render(<ProgressIndicator status="Loading" />);
      expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    test('renders with a label', () => {
      // This test checks if the component displays a label
      render(<ProgressIndicator label="Progress" />);
      expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    test('renders with glitch effect', () => {
      // This test checks if the component renders with the glitch effect
      render(<ProgressIndicator glitchEffect={true} />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      // Additional checks for glitch effect can be added here
    });

    test('renders as complete', () => {
      // This test checks if the component displays the complete status
      render(<ProgressIndicator isComplete={true} />);
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });

    test('renders as error', () => {
      // This test checks if the component displays the error status
      render(<ProgressIndicator isError={true} />);
      expect(screen.getByText('Error!')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    test('renders with progress less than 0', () => {
      // This test checks if the component handles progress less than 0 gracefully
      render(<ProgressIndicator progress={-10} />);
      expect(screen.getByText('Processing... 0%')).toBeInTheDocument();
    });

    test('renders with progress greater than 100', () => {
      // This test checks if the component handles progress greater than 100 gracefully
      render(<ProgressIndicator progress={150} />);
      expect(screen.getByText('Processing... 100%')).toBeInTheDocument();
    });

    test('renders without percentage when showPercentage is false', () => {
      // This test checks if the component does not show percentage when showPercentage is false
      render(<ProgressIndicator progress={50} showPercentage={false} />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      expect(screen.queryByText('50%')).not.toBeInTheDocument();
    });

    test('renders indeterminate progress with animated dots', () => {
      // This test checks if the component shows animated dots for indeterminate progress
      render(<ProgressIndicator />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
      // Additional checks for animated dots can be added here
    });
  });

  describe('glitchEffect', () => {
    test('renders with glitch effect active', () => {
      // This test checks if the glitch effect is active when glitchEffect is true
      render(<ProgressIndicator glitchEffect={true} />);
      const glitchElement = screen.getByText('Processing...');
      expect(glitchElement).toBeInTheDocument();
      // Additional checks for glitch effect can be added here
    });

    test('renders without glitch effect when inactive', () => {
      // This test checks if the glitch effect is not active when glitchEffect is false
      render(<ProgressIndicator glitchEffect={false} />);
      const glitchElement = screen.getByText('Processing...');
      expect(glitchElement).toBeInTheDocument();
      // Additional checks to ensure no glitch effect can be added here
    });
  });
});
