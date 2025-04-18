/**
 * 1. Add a cleanup function in `triggerUpdate` to ensure that the timeout is cleared if the component unmounts before the animation completes.
 * 2. Use `useCallback` for `triggerUpdate` to prevent unnecessary re-creations of the function on re-renders.
 * 3. Consider using a CSS transition for the `updated` class to enhance the visual effect of the update animation.
 */
import * as React from "react";
const {   useEffect, useState   } = React;

interface StatusTagProps {
  children: React.ReactNode;
  className?: string;
  type?: "success" | "error" | "warning" | "info";
  autoUpdateInterval?: number; // Automatically show update effect at interval (ms)
}

const StatusTag: React.FC<StatusTagProps> = ({
  children,
  className = "",
  type = "info",
  autoUpdateInterval = 0,
}) => {
  const [updated, setUpdated] = useState(false);

  // Function to trigger the update animation
  const triggerUpdate = () => {
    setUpdated(true);

    // Remove updated class after animation completes
    setTimeout(() => {
      setUpdated(false);
    }, 1500); // Match animation duration
  };

  // Auto-update effect if autoUpdateInterval is set
  useEffect(() => {
    if (autoUpdateInterval > 0) {
      const interval = setInterval(() => {
        triggerUpdate();
      }, autoUpdateInterval);

      return () => clearInterval(interval);
    }
  }, [autoUpdateInterval]);

  // Generate color classes based on type
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-terminal-green text-terminal-black";
      case "error":
        return "bg-terminal-red text-terminal-white";
      case "warning":
        return "bg-terminal-yellow text-terminal-black";
      case "info":
      default:
        return "bg-terminal-cyan text-terminal-black";
    }
  };

  return (
    <span
      className={`status-tag ${updated ? "updated" : ""} ${getTypeClasses()} ${className}`}
    >
      {children}
    </span>
  );
};

export default StatusTag;
