import React, { useEffect, useRef, useState } from 'react';

interface TypeWriterProps {
  text: string;
  delay?: number; // milliseconds per character
  startDelay?: number; // milliseconds before typing starts
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
  highlightDuration?: number; // milliseconds for highlight to remain active
}

// Enhanced typewriter effect that varies speed, adds natural pauses, and renders chunks of text
const enhancedTypeWriter = (
  text: string,
  callback: (chunk: string) => void,
  onComplete?: () => void,
  baseDelay: number = 40
) => {
  let currentIndex = 0;
  const chunks = text.split(/(?<=[.,!?:;])\s+/); // Split by punctuation
  let displayedText = '';

  const typeChunk = () => {
    if (currentIndex < chunks.length) {
      const chunk = chunks[currentIndex];

      // Variable speed based on chunk complexity
      const speed = Math.max(30, Math.min(100, chunk.length * 5));
      const delayFactor =
        chunk.endsWith('.') || chunk.endsWith('!') || chunk.endsWith('?')
          ? 2.5
          : 1;

      displayedText += chunk + ' ';
      callback(displayedText);
      currentIndex++;

      // Random slight pause after punctuation
      setTimeout(typeChunk, speed + Math.random() * 100 * delayFactor);
    } else if (onComplete) {
      onComplete();
    }
  };

  typeChunk();
};

const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  delay = 40,
  startDelay = 0,
  showCursor = false,
  onComplete,
  className = '',
  highlightDuration = 1000, // Default 1 second highlight duration
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear any existing highlight timeouts
  const clearHighlightTimeout = () => {
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
      highlightTimeoutRef.current = null;
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Reset when text prop changes
    setDisplayedText('');
    setIsComplete(false);
    setIsHighlighted(false);
    clearHighlightTimeout();

    // Start typing after startDelay
    timeout = setTimeout(() => {
      // Set highlight when typing starts
      setIsHighlighted(true);

      enhancedTypeWriter(
        text,
        (chunk) => {
          setDisplayedText(chunk);

          // Reset highlight timeout with each new chunk
          clearHighlightTimeout();
          highlightTimeoutRef.current = setTimeout(() => {
            setIsHighlighted(false);
          }, highlightDuration);
        },
        () => {
          setIsComplete(true);
          if (onComplete) {
            onComplete();
          }

          // Keep highlight for highlightDuration after completion, then fade out
          clearHighlightTimeout();
          highlightTimeoutRef.current = setTimeout(() => {
            setIsHighlighted(false);
          }, highlightDuration);
        },
        delay
      );
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      clearHighlightTimeout();
    };
  }, [text, delay, startDelay, onComplete, highlightDuration]);

  const combinedClassName =
    `terminal-text ${isHighlighted ? 'highlight' : ''} ${className}`.trim();

  return (
    <span className={combinedClassName}>
      {displayedText}
      {showCursor && !isComplete && <span className="cursor" />}
    </span>
  );
};

export default TypeWriter;
