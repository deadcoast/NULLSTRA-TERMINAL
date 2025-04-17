/**
 * Retrieves a status message based on the current application state.
 * @param statusCode - A numeric code representing the status.
 * @returns A string containing the corresponding status message.
 * @throws Error if the statusCode is invalid or not recognized.
 */
import '@testing-library/jest-dom';
import ProgressIndicator from '../../ProgressIndicator';

import { render } from '@testing-library/react';

describe('getStatusMessage() getStatusMessage method', () => {
  // Happy path tests
  describe('Happy Paths', () => {
    it('should return "Processing... 50%" when progress is 50 and showPercentage is true', () => {
      const { getByText } = render(<ProgressIndicator progress={50} />);
      expect(getByText('Processing... 50%')).toBeInTheDocument();
    });

    it('should return "Complete" when isComplete is true', () => {
      const { getByText } = render(<ProgressIndicator isComplete={true} />);
      expect(getByText('Complete')).toBeInTheDocument();
    });

    it('should return "Error!" when isError is true', () => {
      const { getByText } = render(<ProgressIndicator isError={true} />);
      expect(getByText('Error!')).toBeInTheDocument();
    });

    it('should return custom status with percentage when status is provided and showPercentage is true', () => {
      const { getByText } = render(
        <ProgressIndicator progress={75} status="Loading" />
      );
      expect(getByText('Loading 75%')).toBeInTheDocument();
    });

    it('should return custom status without percentage when showPercentage is false', () => {
      const { getByText } = render(
        <ProgressIndicator
          progress={75}
          status="Loading"
          showPercentage={false}
        />
      );
      expect(getByText('Loading')).toBeInTheDocument();
    });
  });

  // Edge case tests
  describe('Edge Cases', () => {
    it('should return "Processing..." with animated dots when progress is undefined', () => {
      jest.useFakeTimers();
      const { getByText } = render(<ProgressIndicator />);
      jest.advanceTimersByTime(300);
      expect(getByText('Processing..')).toBeInTheDocument();
      jest.advanceTimersByTime(300);
      expect(getByText('Processing...')).toBeInTheDocument();
      jest.advanceTimersByTime(300);
      expect(getByText('Processing.')).toBeInTheDocument();
      jest.useRealTimers();
    });

    it('should handle negative progress by returning "Processing... 0%"', () => {
      const { getByText } = render(<ProgressIndicator progress={-10} />);
      expect(getByText('Processing... 0%')).toBeInTheDocument();
    });

    it('should handle progress greater than 100 by returning "Processing... 100%"', () => {
      const { getByText } = render(<ProgressIndicator progress={150} />);
      expect(getByText('Processing... 100%')).toBeInTheDocument();
    });

    it('should return status with dots when progress is undefined and showPercentage is false', () => {
      jest.useFakeTimers();
      const { getByText } = render(
        <ProgressIndicator status="Loading" showPercentage={false} />
      );
      jest.advanceTimersByTime(300);
      expect(getByText('Loading..')).toBeInTheDocument();
      jest.advanceTimersByTime(300);
      expect(getByText('Loading...')).toBeInTheDocument();
      jest.advanceTimersByTime(300);
      expect(getByText('Loading.')).toBeInTheDocument();
      jest.useRealTimers();
    });
  });
});
