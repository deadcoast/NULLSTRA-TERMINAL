# Futuristic Terminal UI - Component Architecture & Implementation

## Next.js Project Structure Implementation

This document provides a comprehensive implementation guide for building a futuristic terminal UI using Next.js, React, TypeScript, and Tailwind CSS. The architecture follows the provided folder structure and ensures all components work together cohesively.

## Core Configuration Files

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          black: "#000000",
          darkBg: "#0A0A0A",
          green: "#00FF00",
          brightGreen: "#90EE90",
          magenta: "#FF00FF",
          cyan: "#00FFFF",
          yellow: "#FFBF00",
          red: "#FF0000",
          white: "#FFFFFF",
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', "Consolas", "monospace"],
      },
      boxShadow: {
        "terminal-green": "0 0 5px rgba(0, 255, 0, 0.7)",
        "terminal-magenta": "0 0 5px rgba(255, 0, 255, 0.7)",
        "terminal-red": "0 0 5px rgba(255, 0, 0, 0.7)",
        "terminal-cyan": "0 0 5px rgba(0, 255, 255, 0.7)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "33%": { transform: "translate(-5px, 2px)" },
          "66%": { transform: "translate(5px, -2px)" },
        },
        flicker: {
          "0%, 100%": { opacity: 1 },
          "33%": { opacity: 0.95 },
          "66%": { opacity: 0.98 },
        },
        typing: {
          from: { width: "0" },
          to: { width: "100%" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        scanline: "scanline 8s linear infinite",
        glitch: "glitch 0.3s ease-in-out infinite",
        flicker: "flicker 5s linear infinite",
        typing: "typing 3.5s steps(40, end)",
      },
    },
  },
  plugins: [],
};
```

### `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap");

@layer base {
  body {
    @apply bg-terminal-black text-terminal-green font-mono m-0 p-0 overflow-hidden;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-terminal-black;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-terminal-green bg-opacity-50 rounded;
  }
}

@layer components {
  .terminal {
    @apply relative w-full h-screen overflow-hidden bg-terminal-black p-4;
  }

  .terminal-header {
    @apply border border-terminal-magenta text-terminal-magenta p-2 mb-3 shadow-terminal-magenta;
  }

  .terminal-output {
    @apply border border-terminal-magenta bg-terminal-black bg-opacity-70 p-3 my-2 overflow-y-auto;
    height: calc(100% - 120px);
  }

  .command-prompt {
    @apply border border-terminal-green bg-terminal-black bg-opacity-80 p-2 mt-2 flex items-center;
  }

  /* Terminal message types */
  .msg-info {
    @apply text-terminal-cyan;
  }

  .msg-warning {
    @apply text-terminal-yellow;
  }

  .msg-error {
    @apply text-terminal-red;
  }

  .msg-success {
    @apply text-terminal-green;
  }

  /* Status indicators */
  .status-tag {
    @apply font-bold mr-2;
  }

  .status-ok {
    @apply text-terminal-green;
  }

  .status-fail {
    @apply text-terminal-red;
  }

  .status-warn {
    @apply text-terminal-yellow;
  }

  .status-info {
    @apply text-terminal-cyan;
  }

  /* CRT Effect */
  .crt-overlay::before {
    content: "";
    @apply absolute top-0 left-0 right-0 bottom-0 pointer-events-none;
    background: linear-gradient(
      rgba(18, 16, 16, 0.1) 50%,
      rgba(0, 0, 0, 0.15) 50%
    );
    background-size: 100% 4px;
    z-index: 10;
  }

  /* Scanline effect */
  .scanline {
    @apply absolute top-0 left-0 w-full h-[10px] bg-terminal-green bg-opacity-10 pointer-events-none opacity-30;
    animation: scanline 8s linear infinite;
    z-index: 11;
  }

  /* Typing cursor */
  .cursor {
    @apply inline-block w-2 h-4 bg-terminal-green ml-1;
    animation: blink 1s step-end infinite;
  }
}
```

## Next.js App Files

### `app/layout.tsx`

```typescript
import "../global.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Futuristic Terminal UI",
  description: "Interactive terminal UI with cyberpunk aesthetics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

### `app/page.tsx`

```typescript
"use client";

import Terminal from "../components/Terminal";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Terminal />
    </main>
  );
}
```

## Component Implementations

### `components/Terminal/index.tsx`

This is the main terminal component that orchestrates all sub-components.

```typescript
"use client";

import { useState, useEffect, useRef } from "react";
import TerminalHeader from "./TerminalHeader";
import TerminalOutput from "./TerminalOutput";
import CommandPrompt from "./CommandPrompt";
import StatusLine from "./StatusLine";
import OverlayEffects from "./OverlayEffects";
import useTerminal from "../../hooks/useTerminal";
import { TerminalMessage } from "../../utils/terminalCommands";

export interface TerminalProps {
  initialMessages?: TerminalMessage[];
  showHeader?: boolean;
  showStatus?: boolean;
  ipAddress?: string;
}

const Terminal: React.FC<TerminalProps> = ({
  initialMessages = [],
  showHeader = true,
  showStatus = true,
  ipAddress = "931.461.60231.14.vt920",
}) => {
  const {
    messages,
    currentPath,
    executeCommand,
    commandHistory,
    historyIndex,
    navigateHistory,
    addMessage,
  } = useTerminal(initialMessages);

  const terminalRef = useRef<HTMLDivElement>(null);
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);

  // Simulate boot sequence
  useEffect(() => {
    // Add boot sequence messages
    const bootMessages = [
      { type: "info", content: "[INIT] System startup sequence initiated..." },
      { type: "info", content: "[CHECK] Running pre-boot diagnostics..." },
      {
        type: "error",
        content: "[FAIL] Irregularities detected in module: 3C-8D. Retrying...",
      },
      {
        type: "error",
        content: "[FAIL] Irregularities detected in module: 3C-8D. Retrying...",
      },
      { type: "info", content: "[OK] Irregularities bypassed. Proceeding." },
      {
        type: "warning",
        content:
          "[WARN] Power fluctuation detected. Adjusting voltage compensation...",
      },
      { type: "info", content: "[OK] Compensation applied." },
      {
        type: "info",
        content: "[OK] Connection to primary conduit established.",
      },
    ];

    let timeout = 0;
    bootMessages.forEach((msg, index) => {
      timeout += Math.random() * 500 + 200;
      setTimeout(() => {
        addMessage(msg);
        if (index === bootMessages.length - 1) {
          setTimeout(() => setBootSequenceComplete(true), 500);
        }
      }, timeout);
    });

    return () => {
      // Clear all timeouts on unmount
      let id = setTimeout(() => {}, 0);
      while (id--) {
        clearTimeout(id);
      }
    };
  }, []);

  return (
    <div className="terminal crt-overlay" ref={terminalRef}>
      <OverlayEffects />

      {showHeader && (
        <TerminalHeader title="CyberAcme Systems Inc. MainFrame Terminal" />
      )}

      <TerminalOutput messages={messages} />

      {bootSequenceComplete && (
        <CommandPrompt
          path={currentPath}
          onSubmit={executeCommand}
          history={commandHistory}
          historyIndex={historyIndex}
          onNavigateHistory={navigateHistory}
        />
      )}

      {showStatus && <StatusLine ipAddress={ipAddress} />}
    </div>
  );
};

export default Terminal;
```

### `components/Terminal/TerminalHeader.tsx`

```typescript
import React from "react";

interface TerminalHeaderProps {
  title: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  showControls?: boolean;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  onMinimize,
  onMaximize,
  onClose,
  showControls = false,
}) => {
  return (
    <div className="terminal-header flex justify-between items-center">
      <div className="text-center w-full">
        <div className="border-b border-terminal-magenta border-opacity-50 mb-2 pb-1">
          {"*".repeat(60)}
        </div>
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="border-t border-terminal-magenta border-opacity-50 mt-2 pt-1">
          {"*".repeat(60)}
        </div>
      </div>

      {showControls && (
        <div className="flex">
          <button
            onClick={onMinimize}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-yellow"
          />
          <button
            onClick={onMaximize}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-green"
          />
          <button
            onClick={onClose}
            className="w-4 h-4 mx-1 rounded-full bg-terminal-red"
          />
        </div>
      )}
    </div>
  );
};

export default TerminalHeader;
```

### `components/Terminal/TerminalOutput.tsx`

```typescript
import React, { useEffect, useRef } from "react";
import { TerminalMessage } from "../../utils/terminalCommands";
import TypeWriter from "../UI/TypeWriter";

interface TerminalOutputProps {
  messages: TerminalMessage[];
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ messages }) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages]);

  const getMessageClass = (type: string): string => {
    switch (type) {
      case "error":
        return "msg-error";
      case "warning":
        return "msg-warning";
      case "success":
        return "msg-success";
      case "info":
      default:
        return "msg-info";
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
  };

  return (
    <div className="terminal-output" ref={outputRef}>
      {messages.map((message, index) => {
        // Check if this is a file listing message
        const isFileListing = message.content.includes(
          "contains the following files:"
        );
        // Check if this is a terminal header message
        const isTerminalHeader = message.prefix === "TERMINAL";

        return (
          <div
            key={index}
            className={`mb-1 ${
              isTerminalHeader ? "text-terminal-magenta" : ""
            }`}
          >
            {message.prefix && (
              <span
                className={`px-1 py-0.5 font-bold ${
                  isTerminalHeader
                    ? "bg-terminal-magenta text-terminal-black"
                    : ""
                }`}
              >
                {message.prefix}
              </span>
            )}

            {message.timestamp && (
              <span className="text-terminal-cyan text-opacity-70 mr-2">
                {message.timestamp}
              </span>
            )}

            <span className={getMessageClass(message.type)}>
              {message.animated ? (
                <TypeWriter text={message.content} delay={30} />
              ) : (
                message.content
              )}
            </span>

            {/* Render file listings in a special way */}
            {isFileListing && message.files && (
              <div className="pl-4 mt-1 flex flex-wrap gap-2">
                {message.files.map((file, fileIndex) => (
                  <span key={fileIndex} className="text-terminal-magenta">
                    {file}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TerminalOutput;
```

### `components/Terminal/CommandPrompt.tsx`

```typescript
import React, { useState, useEffect, KeyboardEvent, useRef } from "react";

interface CommandPromptProps {
  path: string;
  onSubmit: (command: string) => void;
  history: string[];
  historyIndex: number;
  onNavigateHistory: (direction: "up" | "down") => void;
}

const CommandPrompt: React.FC<CommandPromptProps> = ({
  path,
  onSubmit,
  history,
  historyIndex,
  onNavigateHistory,
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount and when path changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [path]);

  // Update input when navigating through history
  useEffect(() => {
    if (historyIndex >= 0 && historyIndex < history.length) {
      setInput(history[historyIndex]);
    } else if (historyIndex === -1) {
      setInput("");
    }
  }, [historyIndex, history]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        onSubmit(input);
        setInput("");
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onNavigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onNavigateHistory("down");
    }
  };

  return (
    <div className="command-prompt">
      <div className="text-terminal-brightGreen mr-2">
        USER <span className="text-terminal-white">/</span>
        {path}
      </div>
      <div className="flex-1 flex items-center">
        <span className="text-terminal-white mr-1">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-terminal-green"
          autoFocus
        />
        <span className="cursor" />
      </div>
    </div>
  );
};

export default CommandPrompt;
```

### `components/Terminal/StatusLine.tsx`

```typescript
import React, { useState, useEffect } from "react";

interface StatusLineProps {
  ipAddress: string;
}

const StatusLine: React.FC<StatusLineProps> = ({ ipAddress }) => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toTimeString().split(" ")[0];
      const dateStr = now.toLocaleDateString("en-US", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      });

      setTime(timeStr);
      setDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-between text-xs mt-2 border-t border-terminal-green border-opacity-30 pt-1">
      <div className="text-terminal-magenta">&lt;{ipAddress}&gt;</div>
      <div className="text-terminal-cyan">
        {time} | {date}
      </div>
    </div>
  );
};

export default StatusLine;
```

### `components/Terminal/OverlayEffects.tsx`

```typescript
import React, { useEffect, useState } from "react";

interface OverlayEffectsProps {
  glitchFrequency?: number; // milliseconds
}

const OverlayEffects: React.FC<OverlayEffectsProps> = ({
  glitchFrequency = 5000,
}) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const triggerRandomGlitch = () => {
      // Random chance to trigger a glitch
      if (Math.random() < 0.3) {
        setGlitchActive(true);

        setTimeout(() => {
          setGlitchActive(false);
        }, Math.random() * 200 + 50);
      }
    };

    const glitchInterval = setInterval(triggerRandomGlitch, glitchFrequency);

    return () => clearInterval(glitchInterval);
  }, [glitchFrequency]);

  return (
    <>
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3OLi4ubm5uVlZWPj4+NjY19fX2JiYl/f39ra2uRkZGZmZlpaWmXl5dvb29xcXGTk5NnZ2c4zIgLAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfmAx0HHBZVePY+AAAAHWlUWHRDb21tZW50AAAAAABDcmVhdGVkIHdpdGggR0lNUGQuZQcAAAGASURBVEjHzZbJkoMgDIbhnwSQRdZs7/+gnaS6Rk1Q6UtnLgWfyZJACD+LX6KCZ1Wy/R9JjJGQzCi6klASP8KQUoiYVEDKALUiUReK7t/kaYoMiAVAUlOECZAVUFH6q8p8R1q2dvLEZFYkEUPs9XJW7Sd9pkwJBBL9TGFcFbvMmZJ8T0a5t7+In7MytCSOH7JQ93XbtCK51L/Nnm/bmNnxx8W2H9IHJB6JtCQJk/51XJ3xSpZxT0sHJCci+lJwxI9tu3i2IAlIKbA//5yH3iNB5dy8MrMPmSVnRIeHN1L+qcE4CxIQV3UT5Uu/krEgkYa4+rjSh+h7DoVEI5GPJU/5tKrWGpFE9LgSUu+PaYw0IeSnxZDKAxJRaERigLh9mFdHEh9N0p68LYwlUYM0IZ71LG/tmmuRgNSLZDKbzC5B1tPnt2WRBcn5rHP7T7sNix89F5K89Iy73YYlonNtVpJFLRDWNQdT4tFh5l7jQWgJ8ueK4hyKWlcfSbXXGtbL5mL+By6jQ/v5PCQ0AAAAAElFTkSuQmCC")',
        }}
      />

      {/* Glitch effect */}
      {glitchActive && (
        <div className="absolute inset-0 bg-terminal-green bg-opacity-5 animate-glitch pointer-events-none" />
      )}

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, transparent 60%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      />
    </>
  );
};

export default OverlayEffects;
```

### `components/UI/Glitch.tsx`

```typescript
import React, { useState, useEffect } from "react";

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

  // Define glitch parameters based on intensity
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

  useEffect(() => {
    if (!active) return;

    const { frequency, duration, probability } = glitchParams[intensity];

    const glitchInterval = setInterval(() => {
      // Random chance based on probability
      if (Math.random() < probability) {
        setIsGlitching(true);

        setTimeout(() => {
          setIsGlitching(false);
        }, Math.random() * duration + 50);
      }
    }, frequency);

    return () => clearInterval(glitchInterval);
  }, [active, intensity]);

  return (
    <div
      className={`relative inline-block ${
        isGlitching ? "animate-glitch" : ""
      } ${className}`}
      style={
        isGlitching
          ? {
              textShadow: `
          ${Math.random() < 0.5 ? "-" : ""}${
                Math.random() * 3
              }px 0 rgba(255, 0, 0, 0.5),
          ${Math.random() < 0.5 ? "-" : ""}${
                Math.random() * 3
              }px 0 rgba(0, 255, 0, 0.5),
          ${Math.random() < 0.5 ? "-" : ""}${
                Math.random() * 3
              }px 0 rgba(0, 0, 255, 0.5)
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
```

### `components/UI/TypeWriter.tsx`

```typescript
import React, { useState, useEffect } from "react";

interface TypeWriterProps {
  text: string;
  delay?: number; // milliseconds per character
  startDelay?: number; // milliseconds before typing starts
  showCursor?: boolean;
  onComplete?: () => void;
  className?: string;
}

const TypeWriter: React.FC<TypeWriterProps> = ({
  text,
  delay = 40,
  startDelay = 0,
  showCursor = false,
  onComplete,
  className = "",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Reset when text prop changes
    setDisplayedText("");
    setIsComplete(false);

    // Start typing after startDelay
    timeout = setTimeout(() => {
      let currentIndex = 0;

      const typingInterval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }, delay);

      return () => clearInterval(typingInterval);
    }, startDelay);

    return () => clearTimeout(timeout);
  }, [text, delay, startDelay, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && <span className="cursor" />}
    </span>
  );
};

export default TypeWriter;
```

### `components/UI/CRTEffect.tsx`

```typescript
import React, { useRef, useEffect } from "react";

interface CRTEffectProps {
  intensity?: number; // 0-1
  flicker?: boolean;
  curvature?: number; // 0-1
}

const CRTEffect: React.FC<CRTEffectProps> = ({
  intensity = 0.5,
  flicker = true,
  curvature = 0.3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize to match window
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    // Animation variables
    let frameId: number;
    let flickerValue = 1;

    // CRT render function
    const render = () => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render scan lines
      const scanLineHeight = 4;
      const scanLines = Math.ceil(canvas.height / scanLineHeight);

      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

      for (let i = 0; i < scanLines; i += 2) {
        ctx.fillRect(0, i * scanLineHeight, canvas.width, scanLineHeight);
      }

      // Apply vignette
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.max(canvas.width, canvas.height) / 1.5
      );

      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, `rgba(0, 0, 0, ${0.6 * intensity})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply curvature distortion
      if (curvature > 0) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

        for (let y = 0; y < canvas.height; y++) {
          for (let x = 0; x < canvas.width; x++) {
            // Calculate distance from center
            const dx = (x - centerX) / centerX;
            const dy = (y - centerY) / centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Apply quadratic distortion
            const strength = distance * curvature;
            const distortionX = dx * strength * strength;
            const distortionY = dy * strength * strength;

            // Map to new coordinates
            const sourceX = Math.floor(x + distortionX * centerX);
            const sourceY = Math.floor(y + distortionY * centerY);

            // Copy pixel if within bounds
            if (
              sourceX >= 0 &&
              sourceX < canvas.width &&
              sourceY >= 0 &&
              sourceY < canvas.height
            ) {
              const targetIndex = (y * canvas.width + x) * 4;
              const sourceIndex = (sourceY * canvas.width + sourceX) * 4;

              data[targetIndex] = data[sourceIndex];
              data[targetIndex + 1] = data[sourceIndex + 1];
              data[targetIndex + 2] = data[sourceIndex + 2];
              data[targetIndex + 3] = data[sourceIndex + 3];
            }
          }
        }

        ctx.putImageData(imageData, 0, 0);
      }

      // Apply random flicker effect
      if (flicker) {
        // Random flicker
        if (Math.random() < 0.03) {
          flickerValue = Math.max(0.7, Math.random());
        } else {
          // Gradually return to normal
          flickerValue = 0.95 * flickerValue + 0.05;
        }

        ctx.fillStyle = `rgba(0, 0, 0, ${1 - flickerValue})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      frameId = requestAnimationFrame(render);
    };

    // Start animation
    render();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [intensity, flicker, curvature]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: "overlay" }}
    />
  );
};

export default CRTEffect;
```

## Custom Hooks Implementation

### `hooks/useTerminal.ts`

```typescript
import { useState, useCallback } from "react";
import {
  TerminalMessage,
  executeCommand as processCommand,
} from "../utils/terminalCommands";

const useTerminal = (initialMessages: TerminalMessage[] = []) => {
  const [messages, setMessages] = useState<TerminalMessage[]>(initialMessages);
  const [currentPath, setCurrentPath] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add a message to the terminal
  const addMessage = useCallback((message: TerminalMessage) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // Add a formatted command entry and result to the terminal
  const addCommandEntry = useCallback(
    (command: string, result: TerminalMessage | TerminalMessage[]) => {
      // Add command entry
      const timestamp = new Date().toLocaleTimeString();

      setMessages((prev) => [
        ...prev,
        {
          type: "command",
          content: command,
          prefix: "USER",
          path: currentPath,
          timestamp,
        },
        ...(Array.isArray(result) ? result : [result]),
      ]);
    },
    [currentPath],
  );

  // Execute a command
  const executeCommand = useCallback(
    (command: string) => {
      // Add to command history
      setCommandHistory((prev) => [command, ...prev]);
      setHistoryIndex(-1);

      // Process the command
      const result = processCommand(command, currentPath);

      // Update path if command was cd
      if (command.trim().startsWith("cd ") && result.type === "success") {
        const newPath = command.trim().substring(3);
        setCurrentPath(currentPath ? `${currentPath}/${newPath}` : newPath);
      }

      // Add to messages
      addCommandEntry(command, result);

      return result;
    },
    [currentPath, addCommandEntry],
  );

  // Navigate command history
  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (direction === "up") {
        // Move back in history
        if (historyIndex < commandHistory.length - 1) {
          setHistoryIndex(historyIndex + 1);
        }
      } else {
        // Move forward in history
        if (historyIndex >= 0) {
          setHistoryIndex(historyIndex - 1);
        }
      }
    },
    [historyIndex, commandHistory],
  );

  return {
    messages,
    currentPath,
    executeCommand,
    addMessage,
    commandHistory,
    historyIndex,
    navigateHistory,
  };
};

export default useTerminal;
```

### `hooks/useCommandHistory.ts`

```typescript
import { useState, useCallback } from "react";

const useCommandHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add a command to history
  const addToHistory = useCallback((command: string) => {
    setHistory((prev) => [command, ...prev]);
    setHistoryIndex(-1);
  }, []);

  // Navigate through history
  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (direction === "up") {
        // Move back in history
        if (historyIndex < history.length - 1) {
          setHistoryIndex((prev) => prev + 1);
        }
      } else {
        // Move forward in history
        if (historyIndex >= 0) {
          setHistoryIndex((prev) => prev - 1);
        }
      }
    },
    [historyIndex, history.length],
  );

  // Get current command from history
  const getCurrentCommand = useCallback(() => {
    if (historyIndex >= 0 && historyIndex < history.length) {
      return history[historyIndex];
    }
    return "";
  }, [history, historyIndex]);

  return {
    history,
    historyIndex,
    addToHistory,
    navigateHistory,
    getCurrentCommand,
  };
};

export default useCommandHistory;
```

### `hooks/useTypewriterEffect.ts`

```typescript
import { useState, useEffect, useCallback } from "react";

interface TypewriterOptions {
  text: string;
  delay?: number;
  startDelay?: number;
  onComplete?: () => void;
}

const useTypewriterEffect = ({
  text,
  delay = 40,
  startDelay = 0,
  onComplete,
}: TypewriterOptions) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Start typing animation
  const startTyping = useCallback(() => {
    setDisplayedText("");
    setIsTyping(true);
    setIsComplete(false);
  }, []);

  // Force completion of typing
  const completeTyping = useCallback(() => {
    setDisplayedText(text);
    setIsTyping(false);
    setIsComplete(true);
    if (onComplete) onComplete();
  }, [text, onComplete]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let typingInterval: NodeJS.Timeout;

    if (isTyping) {
      // Reset state
      setDisplayedText("");
      setIsComplete(false);

      // Start typing after startDelay
      timeout = setTimeout(() => {
        let currentIndex = 0;

        typingInterval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.substring(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(typingInterval);
            setIsTyping(false);
            setIsComplete(true);
            if (onComplete) onComplete();
          }
        }, delay);
      }, startDelay);
    }

    return () => {
      clearTimeout(timeout);
      clearInterval(typingInterval);
    };
  }, [text, delay, startDelay, isTyping, onComplete]);

  return {
    displayedText,
    isTyping,
    isComplete,
    startTyping,
    completeTyping,
  };
};

export default useTypewriterEffect;
```

## Utility Functions Implementation

### `utils/terminalCommands.ts`

```typescript
export interface TerminalMessage {
  type: "error" | "warning" | "success" | "info" | "command";
  content: string;
  prefix?: string;
  timestamp?: string;
  path?: string;
  animated?: boolean;
  files?: string[];
}

// Mock file system structure
const fileSystem = {
  "": {
    type: "directory",
    children: {
      Command_History: { type: "directory" },
      Commerce: { type: "directory" },
      Diagnostics: { type: "directory" },
      Education: { type: "directory" },
      Ethics: { type: "directory" },
      Innovation: { type: "directory" },
      Interplanetary: { type: "directory" },
      Legislation: {
        type: "directory",
        children: {
          Diplomacy: { type: "directory" },
          Governance: { type: "directory" },
          Security: {
            type: "directory",
            children: {
              Asset_Protection: { type: "directory" },
              "Counter-Intelligence": { type: "directory" },
              Cybersecurity: {
                type: "directory",
                children: {
                  "decrypt.sh": {
                    type: "file",
                    content:
                      '#!/bin/bash\n# Decryption utility\necho "Decrypting data..."',
                  },
                  Diplomatic_Security: { type: "directory" },
                  "Security_Research_&_Development": { type: "directory" },
                  Security_Training: { type: "directory" },
                  Surveillance: { type: "directory" },
                  Threat_Assessment: {
                    type: "directory",
                    children: {
                      STARTING_LINE: {
                        type: "directory",
                        children: {
                          "starting_line.txt": {
                            type: "file",
                            content:
                              "CLASSIFIED REPORT: [CLEARANCE REQUIRED]\nCODENAME: STARTING LINE\n\nCASE FILE: [SECURITY CLASSIFIED]\nTYPE: Multi-target Threat Assessment\nSTATUS: [SECURITY CLASSIFIED]\n\nSUMMARY:\nExternal infosec breach compromised vital intelligence related to system-wide security.\nHighly classified details related to PRO:GO and its target were discovered by non-NULLSTRA operatives with intent to disseminate for currently undefined purposes including, but not limited to, anti-NULLSTRA activities, recruitment of public, private, and governmental parties into the ranks of known and suspected anti-NULLSTRA groups, including, but not limited to MIDA, Traxus OffWorld Industries, and Sekiguchi Genetics.\n\nNOTES:\nIncident response to secure systems breach via cross-party manipulation by third party operative(s).\n\nParties:\n- MIDA, primary\n- Traxus OffWorld Industries, secondary\n- Sekiguchi Genetics, secondary",
                          },
                        },
                      },
                    },
                  },
                },
              },
              Defense: { type: "directory" },
              Surveillance: { type: "directory" },
              Tactical_Operations: { type: "directory" },
            },
          },
        },
      },
      Operational_Protocols: { type: "directory" },
      Outreach: { type: "directory" },
      Research: { type: "directory" },
      Sustainability: { type: "directory" },
      System_Configurations: { type: "directory" },
      NULLSTRA_Departments: { type: "directory" },
      "User_Notes_[Batch]": { type: "directory" },
    },
  },
};

// Helper function to navigate file system
const getFileSystemItem = (path: string): any => {
  if (!path) return fileSystem[""];

  const pathParts = path.split("/").filter(Boolean);
  let current = fileSystem[""];

  for (const part of pathParts) {
    if (
      current.type !== "directory" ||
      !current.children ||
      !current.children[part]
    ) {
      return null;
    }
    current = current.children[part];
  }

  return current;
};

// Helper to convert timestamp to string
const getTimestamp = (): string => {
  return new Date().toLocaleTimeString();
};

// Execute terminal command
export const executeCommand = (
  commandString: string,
  currentPath: string,
): TerminalMessage | TerminalMessage[] => {
  const timestamp = getTimestamp();
  const [command, ...args] = commandString.trim().split(/\s+/);

  // Handle commands
  switch (command.toLowerCase()) {
    case "help":
      return {
        type: "info",
        content: "Available commands: ls, cd, help, sysinfo, read, exec, clear",
        timestamp,
        animated: true,
      };

    case "ls":
      const item = getFileSystemItem(currentPath);
      if (!item || item.type !== "directory") {
        return {
          type: "error",
          content: `Directory not found: ${currentPath}`,
          timestamp,
        };
      }

      // Get files/directories in current directory
      const files = Object.keys(item.children || {});

      return [
        {
          type: "info",
          content: `The folder ${
            currentPath || "root"
          } contains the following files:`,
          prefix: "TERMINAL",
          timestamp,
          files,
        },
      ];

    case "cd":
      const directory = args[0] || "";

      // Handle special cases
      if (directory === "..") {
        // Go up one level
        const pathParts = currentPath.split("/").filter(Boolean);
        pathParts.pop();
        return {
          type: "success",
          content: "Directory changed.",
          timestamp,
        };
      }

      // Validate destination exists
      let newPath = currentPath;
      if (currentPath) {
        newPath = `${currentPath}/${directory}`;
      } else {
        newPath = directory;
      }

      const target = getFileSystemItem(newPath);
      if (!target || target.type !== "directory") {
        return {
          type: "error",
          content: `Directory not found: ${newPath}`,
          timestamp,
        };
      }

      return {
        type: "success",
        content: "Directory changed.",
        timestamp,
      };

    case "read":
      const filePath = args[0] || "";

      // Determine full path
      let fullPath = filePath;
      if (!filePath.startsWith("/") && currentPath) {
        fullPath = `${currentPath}/${filePath}`;
      }

      const file = getFileSystemItem(fullPath);
      if (!file || file.type !== "file") {
        return {
          type: "error",
          content: `File not found: ${filePath}`,
          timestamp,
        };
      }

      return {
        type: "info",
        content: file.content,
        prefix: "TERMINAL",
        timestamp,
      };

    case "exec":
      const scriptPath = args[0] || "";

      // Determine full script path
      let fullScriptPath = scriptPath;
      if (!scriptPath.startsWith("/") && currentPath) {
        fullScriptPath = `${currentPath}/${scriptPath}`;
      }

      const script = getFileSystemItem(fullScriptPath);
      if (!script || script.type !== "file") {
        return {
          type: "error",
          content: `Script not found: ${scriptPath}`,
          timestamp,
        };
      }

      // Execute the script (simulate)
      return [
        {
          type: "info",
          content: `Executing ${scriptPath}`,
          prefix: "TERMINAL",
          timestamp,
        },
        {
          type: "info",
          content: "#!/bin/bash\n# Decryption utility",
          timestamp,
        },
        {
          type: "info",
          content: "Decrypting data...",
          timestamp,
          animated: true,
        },
        {
          type: "info",
          content: "[OK] Execution completed successfully.",
          timestamp,
        },
      ];

    case "sysinfo":
      return [
        {
          type: "info",
          prefix: "TERMINAL",
          content: "CYAQUEBC.local",
          timestamp,
        },
        {
          type: "info",
          content: "OS: NULLSTRA-UNIX 2803.04.1 LTS",
          timestamp,
        },
        {
          type: "info",
          content: "Host: CyberAcme Systems Model CV-4788",
          timestamp,
        },
        {
          type: "info",
          content: "Kernel: 15.92.0-NULLSTRA-secure",
          timestamp,
        },
        {
          type: "info",
          content: "Uptime: 45088d 17h 19m",
          timestamp,
        },
        {
          type: "info",
          content: "Packages: 23,471 (quantum-apt)",
          timestamp,
        },
        {
          type: "info",
          content: "Shell: neutron-shell 12.7.3",
          timestamp,
        },
        {
          type: "info",
          content: "Resolver: 18K-Hole",
          timestamp,
        },
        {
          type: "info",
          content: "DE: NeuroAqua 42.4.1",
          timestamp,
        },
        {
          type: "info",
          content: "WM: Quantum Compositor 30.7.3",
          timestamp,
        },
        {
          type: "info",
          content: "WM Theme: Grafix (DARK)",
          timestamp,
        },
        {
          type: "info",
          content: "Terminal: phantom-term 8.3.4",
          timestamp,
        },
        {
          type: "info",
          content: "CPU: Quantum Vector 2298 (128) @ 12.88THz",
          timestamp,
        },
        {
          type: "info",
          content: "Memory: 1.28TB Quantum-RAM",
          timestamp,
        },
        {
          type: "info",
          content: "Storage: 180TB Molecular Storage (Neural-Encrypted)",
          timestamp,
        },
        {
          type: "info",
          content: "Security: NeuralNetDefense Encryption Active",
          timestamp,
        },
      ];

    case "clear":
      return {
        type: "command",
        content: "Terminal cleared",
        timestamp,
        clearTerminal: true,
      };

    default:
      return {
        type: "error",
        content: `Command not found: ${command}`,
        timestamp,
      };
  }
};
```

### `utils/effectsHelper.ts`

```typescript
// Helper function to generate random static noise
export const generateNoise = (
  width: number,
  height: number,
  opacity: number = 0.1,
): string => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // Random static
    const value = Math.floor(Math.random() * 256);
    data[i] = value; // r
    data[i + 1] = value; // g
    data[i + 2] = value; // b
    data[i + 3] = Math.floor(opacity * 255); // alpha
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
};

// Helper function to apply glitch effect to text
export const glitchText = (text: string): string => {
  // Characters to randomly replace with
  const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?/\\";

  // Apply glitch to random positions
  const result = text
    .split("")
    .map((char) => {
      if (Math.random() < 0.05) {
        return glitchChars[Math.floor(Math.random() * glitchChars.length)];
      }
      return char;
    })
    .join("");

  return result;
};

// Helper to simulate connection issues
export const simulateConnectionIssue = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        resolve();
      },
      Math.random() * 1000 + 500,
    );
  });
};

// Generate random error message
export const generateRandomError = (): string => {
  const errors = [
    "[FAIL] Remote node unresponsive.",
    "[WARN] Link failure detected at node 4A-7D.",
    "[FAIL] Decryption failed.",
    "[WARN] Power fluctuation detected.",
    "[WARN] High fragmentation detected.",
    "[FAIL] Module 7E-1D misalignment detected.",
    "[WARN] Unrecognized transmission detected on secured channel.",
  ];

  return errors[Math.floor(Math.random() * errors.length)];
};

// Format timestamp for terminal display
export const formatTimestamp = (): string => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes(),
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
};

// Format IP address
export const formatIpAddress = (ip: string): string => {
  return `<${ip}>`;
};

// Make text appear typed
export const typeText = async (
  text: string,
  callback: (chunk: string) => void,
  speed: number = 30,
): Promise<void> => {
  let currentIndex = 0;

  return new Promise((resolve) => {
    const type = () => {
      if (currentIndex < text.length) {
        // Get next chunk of text (can be more than one character for faster typing)
        const chunkSize = Math.floor(Math.random() * 3) + 1;
        const end = Math.min(currentIndex + chunkSize, text.length);
        const chunk = text.substring(currentIndex, end);

        callback(chunk);
        currentIndex = end;

        setTimeout(type, speed);
      } else {
        resolve();
      }
    };

    type();
  });
};
```

## Main Application Integration

### `App.tsx`

```typescript
import React, { useState } from "react";
import Terminal from "./components/Terminal";

const App: React.FC = () => {
  const [showTerminal, setShowTerminal] = useState(true);

  return (
    <div className="min-h-screen bg-black">
      {showTerminal && (
        <Terminal
          ipAddress="931.461.60231.14.vt920"
          showHeader={true}
          showStatus={true}
        />
      )}
    </div>
  );
};

export default App;
```

## Development Process Recommendations

1. **Phased Implementation**:

   - Phase 1: Basic terminal functionality (layout, input/output)
   - Phase 2: Command processing and file system simulation
   - Phase 3: Visual effects and animations
   - Phase 4: Performance optimization and bug fixes

2. **Testing Strategy**:

   - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
   - Test on different screen sizes to ensure responsive behavior
   - Performance testing for animations and effects
   - Accessibility testing for keyboard navigation

3. **Performance Considerations**:

   - Use React.memo for components that don't need frequent re-renders
   - Implement virtualization for long terminal outputs
   - Use requestAnimationFrame for animations instead of setInterval
   - Consider throttling for window resize events

4. **Enhancement Roadmap**:
   - Add configurable themes (different color schemes)
   - Implement more complex file system operations
   - Add network simulation features
   - Implement a history viewer for past commands
   - Add customizable startup sequences
   - Implement multiplayer/shared terminal functionality
