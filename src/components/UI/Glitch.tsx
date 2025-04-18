import * as React from "react";
const {   useEffect, useState   } = React;

// Define glitch parameters outside the component
const glitchParams = {
  low: {
    frequency: 5000, // ms
    duration: 100, // ms
    probability: 0.1, // 0-1
  },
  medium: {
    frequency: 3000,
    duration: 200,
    probability: 0.3,
  },
  high: {
    frequency: 1000,
    duration: 300,
    probability: 0.5,
  },
};

interface GlitchProps {
  children: React.ReactNode;
  intensity?: "low" | "medium" | "high";
  active?: boolean;
  className?: string;
}

const Glitch: React.FC<GlitchProps> = ({
  children,
  intensity = "medium",
  active = true,
  className = "",
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (!active) {
      return;
    }

    // Access glitchParams from the outer scope
    const { frequency, duration, probability } = glitchParams[intensity];

    const glitchInterval = setInterval(() => {
      if (Math.random() < probability) {
        setIsGlitching(true);

        setTimeout(
          () => {
            setIsGlitching(false);
          },
          Math.random() * duration + 50,
        );
      }
    }, frequency);

    return () => clearInterval(glitchInterval);
    // Remove glitchParams from dependencies as it's stable now
  }, [active, intensity]);

  return (
    <div
      className={`relative inline-block ${isGlitching ? "animate-glitch" : ""} ${className}`}
      style={
        isGlitching
          ? {
              textShadow: `
          ${Math.random() < 0.5 ? "-" : ""}${Math.random() * 3}px 0 rgba(255, 0, 0, 0.5),
          ${Math.random() < 0.5 ? "-" : ""}${Math.random() * 3}px 0 rgba(0, 255, 0, 0.5),
          ${Math.random() < 0.5 ? "-" : ""}${Math.random() * 3}px 0 rgba(0, 0, 255, 0.5)
        `,
            }
          : {}
      }
    >
      {children}

      {isGlitching && (
        <>
          <div
            className="absolute inset-0 text-terminal-red opacity-50"
            style={{ transform: `translate(${Math.random() * 4 - 2}px, 0)` }}
          >
            {children}
          </div>
          <div
            className="absolute inset-0 text-terminal-cyan opacity-50"
            style={{ transform: `translate(${Math.random() * -4 + 2}px, 0)` }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default Glitch;
