import React, { useEffect, useRef, useState } from "react";

interface TerminalAnimationsProps {
  type?: "typing" | "matrix" | "loading";
  content?: string;
  speed?: number;
  repeat?: boolean;
  className?: string;
}

const TerminalAnimations: React.FC<TerminalAnimationsProps> = ({
  type = "typing",
  content = "",
  speed = 50,
  repeat = false,
  className = "",
}) => {
  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const index = useRef(0);

  // Typing effect
  useEffect(() => {
    if (type !== "typing" || !content) return;

    // Reset if content changes
    setDisplayText("");
    index.current = 0;

    const interval = setInterval(() => {
      if (index.current < content.length) {
        setDisplayText((prev) => prev + content.charAt(index.current));
        index.current += 1;
      } else if (repeat) {
        setDisplayText("");
        index.current = 0;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [content, speed, type, repeat]);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  // Different animation types
  const renderAnimation = () => {
    switch (type) {
      case "typing":
        return (
          <div className="typing-animation">
            <span>{displayText}</span>
            <span className={`cursor ${cursorVisible ? "visible" : "hidden"}`}>
              _
            </span>
          </div>
        );
      case "matrix":
        return <div className="matrix-animation">Matrix Effect</div>;
      case "loading":
        return <div className="loading-animation">Loading...</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`terminal-animation ${className}`}>{renderAnimation()}</div>
  );
};

export default TerminalAnimations;
