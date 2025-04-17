/**
 * Renders a progress indicator component that displays a progress bar and status message.
 * It supports indeterminate progress, complete/error states, and optional percentage display.
 *
 * @param {Object} props - The component props.
 * @param {number} [props.progress] - The progress value (0-100).
 * @param {string} [props.status] - The status message.
 * @param {boolean} [props.showPercentage] - Whether to show the percentage.
 * @param {boolean} [props.glitchEffect] - Whether to use the glitch effect.
 * @param {boolean} [props.isComplete] - Whether the progress is complete.
 * @param {boolean} [props.isError] - Whether the progress is in an error state.
 * @param {string} [props.label] - The label for the progress indicator.
 * 1. Add customizable intensity levels to allow users to adjust the glitch effect dynamically.
 * 2. Implement a toggle for enabling/disabling the glitch effect based on user interaction or specific events.
 * 3. Include a duration parameter to control how long the glitch effect lasts for better user experience.
 * 1. Add TypeScript types for the function parameters to ensure type safety and improve code readability.
 * 2. Use `useMemo` for the `colors` and `width` calculations to optimize performance by preventing unnecessary recalculations on re-renders.
 * 3. Implement a cleanup function in the `useEffect` to reset the `dots` state when the component unmounts or when the progress changes to avoid potential memory leaks.
 */
import React, { useEffect, useState } from 'react';
import { Glitch } from '../UI';

interface ProgressIndicatorProps {
  progress?: number; // 0-100, if undefined it's indeterminate
  status?: string;
  showPercentage?: boolean;
  glitchEffect?: boolean;
  isComplete?: boolean;
  isError?: boolean;
  label?: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  progress,
  status = 'Processing...',
  showPercentage = true,
  glitchEffect = false,
  isComplete = false,
  isError = false,
  label = '',
}) => {
  const [dots, setDots] = useState('');

  // Animated dots for indeterminate progress
  useEffect(() => {
    if (progress !== undefined || isComplete || isError) {
      return; // No animation needed for determinate progress or complete/error state
    }

    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) {
          return '';
        }
        return prev + '.';
      });
    }, 300);

    return () => clearInterval(interval);
  }, [progress, isComplete, isError]);

  // Determine colors based on state
  const getColors = () => {
    if (isError) {
      return {
        border: 'border-terminal-red',
        fill: 'bg-terminal-red',
        text: 'text-terminal-red',
      };
    }

    if (isComplete) {
      return {
        border: 'border-terminal-green',
        fill: 'bg-terminal-green',
        text: 'text-terminal-green',
      };
    }

    return {
      border: 'border-terminal-cyan',
      fill: 'bg-terminal-cyan',
      text: 'text-terminal-cyan',
    };
  };

  const colors = getColors();

  // Calculate width for determinate progress
  const calculateWidth = () => {
    if (progress === undefined) {
      // Animated progress for indeterminate state
      return 'animate-progress-indeterminate';
    }
    return `${Math.min(Math.max(progress, 0), 100)}%`;
  };

  // Get status message
  const getStatusMessage = () => {
    if (isError) {
      return 'Error!';
    }
    if (isComplete) {
      return 'Complete';
    }

    if (progress !== undefined && showPercentage) {
      return `${status} ${Math.round(progress)}%`;
    }

    return `${status}${dots}`;
  };

  return (
    <div className="my-2">
      {label && <div className={`mb-1 ${colors.text} font-bold`}>{label}</div>}
      <div className="flex items-center">
        <div
          className={`w-full h-2 ${colors.border} border rounded-full overflow-hidden flex-grow mr-2`}
        >
          <div
            className={`h-full ${colors.fill} transition-width duration-300 ${progress === undefined ? 'animate-progress-indeterminate' : ''}`}
            style={{ width: calculateWidth() }}
          />
        </div>
        <div className="flex-shrink-0 whitespace-nowrap">
          {glitchEffect ? (
            <Glitch intensity="low" active={true}>
              <span className={colors.text}>{getStatusMessage()}</span>
            </Glitch>
          ) : (
            <span className={colors.text}>{getStatusMessage()}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
