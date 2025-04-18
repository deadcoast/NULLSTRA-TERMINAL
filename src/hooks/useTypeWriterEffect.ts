import { useCallback, useEffect, useState, useRef } from "react";

// Define the options interface for the enhanced hook
interface EnhancedTypewriterOptions {
  /** The full string text to type out. */
  text: string;
  /** Delay in milliseconds before typing starts. Defaults to 0. */
  startDelay?: number;
  /** Optional callback function to execute when typing is fully complete. */
  onComplete?: () => void;
  /** Optional regex or string to split the text by. Defaults to splitting after punctuation followed by space. */
  splitRegex?: RegExp | string;
  /** Minimum speed (ms per chunk). Defaults to 50ms */
  minSpeed?: number;
  /** Maximum speed (ms per chunk). Defaults to 150ms */
  maxSpeed?: number;
  /** Multiplier for chunk length to determine speed. Defaults to 3. */
  speedMultiplier?: number;
  /** Maximum random pause added after each chunk (ms). Defaults to 100ms. */
  maxRandomPause?: number;
}

/**
 * A React custom hook for a typewriter effect that types text chunk by chunk
 * with variable speed and random pauses after punctuation.
 */
const useEnhancedTypewriter = ({
  text,
  startDelay = 0,
  onComplete,
  splitRegex = /(?<=[.,!?:;])\s+/, // Default split by punctuation + space
  minSpeed = 50, // Default min speed
  maxSpeed = 150, // Default max speed
  speedMultiplier = 3, // Default speed calculation factor
  maxRandomPause = 100, // Default max random pause
}: EnhancedTypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Refs to manage timeouts and chunk index safely within async operations
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const chunkIndexRef = useRef(0);

  // --- Control Functions ---

  /**
   * Starts the typing animation from the beginning.
   * Resets the displayed text and typing state.
   */
  const startTyping = useCallback(() => {
    // Clear any existing timeout if restarting
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setDisplayedText("");
    setIsTyping(true);
    setIsComplete(false);
    chunkIndexRef.current = 0; // Reset chunk index
  }, []);

  /**
   * Immediately completes the typing animation, displaying the full text.
   * Clears any pending timeouts and calls onComplete.
   */
  const completeTyping = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!isComplete) {
      // Avoid redundant calls if already complete
      setDisplayedText(text);
      setIsTyping(false);
      setIsComplete(true);
      if (onComplete) {
        // Use a microtask to ensure state updates before callback
        queueMicrotask(onComplete);
      }
    }
  }, [text, onComplete, isComplete]);

  // --- Core Typing Logic ---

  useEffect(() => {
    // Function to clear the current timeout
    const clearCurrentTimeout = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Only proceed if typing is enabled and not yet complete
    if (isTyping && !isComplete) {
      const chunks = text.split(splitRegex);

      // Recursive function to type the next chunk
      const typeNextChunk = () => {
        // Ensure we are still supposed to be typing
        if (!isTyping || isComplete || chunkIndexRef.current >= chunks.length) {
          // If state changed externally (e.g., completeTyping called), stop.
          if (!isComplete && chunkIndexRef.current >= chunks.length) {
            // Normal completion
            setIsTyping(false);
            setIsComplete(true);
            if (onComplete) {
              queueMicrotask(onComplete); // Ensure state updates before callback
            }
          }
          clearCurrentTimeout();
          return;
        }

        const currentChunk = chunks[chunkIndexRef.current];
        // Add the space back unless it's the last chunk or the next chunk starts with space (less common)
        // A more robust way is to capture the delimiter during split if needed, but this works for the default regex
        const chunkToAdd =
          currentChunk + (chunkIndexRef.current < chunks.length - 1 ? " " : "");

        // Calculate variable speed based on chunk length
        const baseSpeed = Math.max(
          minSpeed,
          Math.min(maxSpeed, currentChunk.length * speedMultiplier),
        );
        // Add a random slight pause after punctuation/chunk
        const randomPause = Math.random() * maxRandomPause;
        const totalDelay = baseSpeed + randomPause;

        // Update displayed text
        setDisplayedText((prev) => prev + chunkToAdd);
        chunkIndexRef.current++;

        // If there are more chunks, schedule the next one
        if (chunkIndexRef.current < chunks.length) {
          timeoutRef.current = setTimeout(typeNextChunk, totalDelay);
        } else {
          // Last chunk has been processed
          timeoutRef.current = setTimeout(() => {
            if (!isComplete) {
              // Check again in case completeTyping was called meanwhile
              setIsTyping(false);
              setIsComplete(true);
              if (onComplete) {
                onComplete();
              }
            }
            timeoutRef.current = null; // Clear ref
          }, totalDelay); // Apply delay even after the last chunk before marking complete
        }
      };

      // Start the process after the initial startDelay
      clearCurrentTimeout(); // Clear any previous timeout just in case
      if (chunks.length > 0 && chunks[0] !== "") {
        // Handle empty text or splits resulting in empty first chunk
        timeoutRef.current = setTimeout(typeNextChunk, startDelay);
      } else {
        // If text is empty or results in no typable chunks, complete immediately
        setIsTyping(false);
        setIsComplete(true);
        if (onComplete) {
          onComplete();
        }
      }
    } else if (!isTyping && timeoutRef.current) {
      // If typing was stopped externally (isTyping became false), ensure timeout is cleared
      clearCurrentTimeout();
    }

    // Cleanup function: clear timeout when component unmounts or dependencies change
    return () => {
      clearCurrentTimeout();
    };
  }, [
    text,
    startDelay,
    isTyping,
    isComplete, // Added isComplete as dependency
    onComplete,
    splitRegex,
    minSpeed,
    maxSpeed,
    speedMultiplier,
    maxRandomPause,
  ]); // Include all props used in the effect

  return {
    displayedText,
    isTyping,
    isComplete,
    startTyping,
    completeTyping,
  };
};

export default useEnhancedTypewriter;
