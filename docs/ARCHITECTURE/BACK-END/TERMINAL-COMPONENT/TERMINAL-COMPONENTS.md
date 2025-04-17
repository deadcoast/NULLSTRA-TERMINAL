# COMPONENT STRUCTURE FOR TERMINAL WINDOW

## TERMINAL WINDOW COMPONENT

```tsx
// src/components/Terminal/TerminalWindow.tsx
import React, { ReactNode } from "react";
import "../styles/terminal.css";

interface TerminalWindowProps {
  children: ReactNode;
  className?: string;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-background">
        <div className="terminal-scanlines"></div>
        <div className="terminal-content">{children}</div>
      </div>
    </div>
  );
};

export default TerminalWindow;
```

## TERMINAL HEADER COMPONENT

```tsx
// src/components/Terminal/TerminalHeader.tsx
import React from "react";

interface TerminalHeaderProps {
  title: string;
  className?: string;
}

const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  title,
  className = "",
}) => {
  return (
    <div className={`terminal-header ${className}`}>
      <div className="terminal-header-tag">TERMINAL</div>
      <div className="terminal-header-content">{title}</div>
    </div>
  );
};

export default TerminalHeader;
```

## TERMINAL OUTPUT COMPONENT

```tsx
// src/components/Terminal/TerminalOutput.tsx
import React, { useRef, useEffect } from "react";

interface TerminalOutputProps {
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({
  children,
  className = "",
  autoScroll = true,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [children, autoScroll]);

  return (
    <div ref={outputRef} className={`terminal-output ${className}`}>
      {children}
    </div>
  );
};

export default TerminalOutput;
```

## TERMINAL OUTPUT LINE COMPONENT

```tsx
// src/components/Terminal/TerminalOutputLine.tsx
import React from "react";

interface TerminalOutputLineProps {
  type?: "error" | "warning" | "success" | "info" | "system";
  prefix?: string;
  timestamp?: string;
  children: React.ReactNode;
  className?: string;
}

const TerminalOutputLine: React.FC<TerminalOutputLineProps> = ({
  type,
  prefix,
  timestamp,
  children,
  className = "",
}) => {
  return (
    <div
      className={`terminal-line ${
        type ? `terminal-line-${type}` : ""
      } ${className}`}
    >
      {prefix && <span className="terminal-line-prefix">{prefix}</span>}
      {timestamp && <span className="terminal-timestamp">{timestamp}</span>}
      <span className="terminal-line-content">{children}</span>
    </div>
  );
};

export default TerminalOutputLine;
```

## TERMINAL PROMPT COMPONENT

```tsx
// src/components/Terminal/TerminalPrompt.tsx
import React, { useState, useRef, KeyboardEvent, useEffect } from "react";

interface TerminalPromptProps {
  path: string;
  onCommand: (command: string) => void;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
}

const TerminalPrompt: React.FC<TerminalPromptProps> = ({
  path,
  onCommand,
  className = "",
  disabled = false,
  placeholder = "",
}) => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled, path]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim()) {
        onCommand(input);
        setInput("");
      }
    }
  };

  return (
    <div className={`terminal-prompt ${className}`}>
      <span className="terminal-prompt-user">USER</span>
      <span className="terminal-prompt-separator">/</span>
      <span className="terminal-prompt-path">{path}</span>
      <div className="terminal-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input"
          placeholder={placeholder}
          disabled={disabled}
          spellCheck="false"
          autoComplete="off"
          autoCapitalize="off"
        />
        <span
          className={`terminal-cursor ${
            disabled ? "terminal-cursor-hidden" : ""
          }`}
        ></span>
      </div>
    </div>
  );
};

export default TerminalPrompt;
```

## TERMINAL FILE LIST COMPONENT

```tsx
// src/components/Terminal/TerminalFileList.tsx
import React from "react";

interface TerminalFileListProps {
  title: string;
  files: string[];
  className?: string;
  onFileClick?: (file: string) => void;
}

const TerminalFileList: React.FC<TerminalFileListProps> = ({
  title,
  files,
  className = "",
  onFileClick,
}) => {
  return (
    <div className={`terminal-file-list ${className}`}>
      <div className="terminal-file-list-header">{title}</div>
      <div className="terminal-file-list-content">
        {files.map((file, index) => (
          <span
            key={index}
            className={`terminal-file-name ${
              onFileClick ? "terminal-file-clickable" : ""
            }`}
            onClick={onFileClick ? () => onFileClick(file) : undefined}
          >
            {file}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TerminalFileList;
```

## TERMINAL DIALOG COMPONENT

```tsx
// src/components/Terminal/TerminalDialog.tsx
import React, { ReactNode } from "react";

interface TerminalDialogProps {
  title: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  showCloseButton?: boolean;
}

const TerminalDialog: React.FC<TerminalDialogProps> = ({
  title,
  children,
  onClose,
  className = "",
  showCloseButton = true,
}) => {
  return (
    <div className={`terminal-dialog ${className}`}>
      <div className="terminal-dialog-header">
        <span className="terminal-dialog-title">{title}</span>
        {showCloseButton && onClose && (
          <button className="terminal-dialog-close" onClick={onClose}>
            X
          </button>
        )}
      </div>
      <div className="terminal-dialog-content">{children}</div>
    </div>
  );
};

export default TerminalDialog;
```

## TERMINAL BUTTON COMPONENT

```tsx
// src/components/Terminal/TerminalButton.tsx
import React from "react";

interface TerminalButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
  disabled?: boolean;
}

const TerminalButton: React.FC<TerminalButtonProps> = ({
  children,
  onClick,
  className = "",
  active = false,
  disabled = false,
}) => {
  return (
    <button
      className={`terminal-button ${active ? "terminal-button-active" : ""} ${
        disabled ? "terminal-button-disabled" : ""
      } ${className}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TerminalButton;
```

## TERMINAL STATUS LINE COMPONENT

```tsx
// src/components/Terminal/TerminalStatusLine.tsx
import React from "react";

interface TerminalStatusLineProps {
  ipAddress: string;
  className?: string;
  children?: React.ReactNode;
}

const TerminalStatusLine: React.FC<TerminalStatusLineProps> = ({
  ipAddress,
  className = "",
  children,
}) => {
  return (
    <div className={`terminal-status-line ${className}`}>
      <span className="terminal-status-ip">&lt;{ipAddress}&gt;</span>
      {children || (
        <span className="terminal-status-time">
          {new Date().toLocaleTimeString()}
        </span>
      )}
    </div>
  );
};

export default TerminalStatusLine;
```

## CRT EFFECT COMPONENT

```tsx
// src/components/UI/CRTEffect.tsx
import React, { useEffect, useRef } from "react";

interface CRTEffectProps {
  intensity?: number;
  className?: string;
  flickerFrequency?: number;
  scanlineSpacing?: number;
}

const CRTEffect: React.FC<CRTEffectProps> = ({
  intensity = 0.5,
  className = "",
  flickerFrequency = 0.03,
  scanlineSpacing = 4,
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

    // Variables for animation
    let frameId: number;

    // Render function
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render scanlines
      const scanlineOpacity = 0.2 * intensity;
      ctx.fillStyle = `rgba(0, 0, 0, ${scanlineOpacity})`;

      for (let i = 0; i < canvas.height; i += scanlineSpacing) {
        ctx.fillRect(0, i, canvas.width, scanlineSpacing / 2);
      }

      // Add random flicker
      if (Math.random() < flickerFrequency * intensity) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.02 * intensity})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Add vignette effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.height / 3,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );

      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(1, `rgba(0, 0, 0, ${0.9 * intensity})`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [intensity, flickerFrequency, scanlineSpacing]);

  return <canvas ref={canvasRef} className={`crt-effect ${className}`} />;
};

export default CRTEffect;
```

## CSS HAS BEEN UPDATED WITH MORE EFFECTS AND STYLES

```css
// src/styles/terminal.css
/* Base terminal styles */
.terminal-window {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: #000;
  font-family: "JetBrains Mono", "Consolas", monospace;
  color: #00ff00;
  font-size: 16px;
  line-height: 1.4;
}

.terminal-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  overflow: auto;
}

.terminal-scanlines {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
  background-size: 100% 4px;
  z-index: 2;
}

.terminal-content {
  position: relative;
  z-index: 1;
  padding: 20px;
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

/* Terminal header */
.terminal-header {
  display: flex;
  margin-bottom: 10px;
  border: 1px solid #ff00ff;
  background-color: rgba(10, 0, 10, 0.7);
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
  overflow: hidden;
}

.terminal-header-tag {
  background-color: #ff00ff;
  color: #000;
  padding: 5px 10px;
  font-weight: bold;
}

.terminal-header-content {
  padding: 5px 10px;
  color: #ff00ff;
  flex-grow: 1;
  text-align: center;
}

/* Terminal output */
.terminal-output {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  border: 1px solid #ff00ff;
  box-shadow: inset 0 0 5px rgba(255, 0, 255, 0.3);
}

.terminal-line {
  margin-bottom: 5px;
  word-wrap: break-word;
}

.terminal-line-error {
  color: #ff0000;
}

.terminal-line-warning {
  color: #ffff00;
}

.terminal-line-success {
  color: #00ff00;
}

.terminal-line-info {
  color: #00ffff;
}

.terminal-line-system {
  color: #ffffff;
}

.terminal-line-prefix {
  background-color: #ff00ff;
  color: #000;
  padding: 1px 5px;
  margin-right: 8px;
  font-weight: bold;
}

.terminal-timestamp {
  color: #888;
  margin-right: 8px;
}

/* Terminal prompt */
.terminal-prompt {
  display: flex;
  align-items: center;
  background-color: rgba(0, 20, 0, 0.5);
  padding: 5px 10px;
  border: 1px solid #00ff00;
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.terminal-prompt-user {
  color: #90ee90;
  font-weight: bold;
}

.terminal-prompt-separator {
  color: #ffffff;
  margin: 0 5px;
}

.terminal-prompt-path {
  color: #90ee90;
  margin-right: 10px;
}

.terminal-input-wrapper {
  flex-grow: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.terminal-input {
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  color: #00ff00;
  font-family: inherit;
  font-size: inherit;
  padding: 0;
}

.terminal-cursor {
  width: 8px;
  height: 16px;
  background-color: #00ff00;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
}

.terminal-cursor-hidden {
  display: none;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

/* Terminal file list */
.terminal-file-list {
  margin-bottom: 10px;
  border: 1px solid #ff00ff;
  background-color: rgba(10, 0, 10, 0.7);
}

.terminal-file-list-header {
  padding: 5px 10px;
  color: #ff00ff;
}

.terminal-file-list-content {
  padding: 5px 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.terminal-file-name {
  color: #ff00ff;
  padding: 2px 5px;
}

.terminal-file-clickable {
  cursor: pointer;
}

.terminal-file-clickable:hover {
  background-color: rgba(255, 0, 255, 0.2);
}

/* Terminal dialog */
.terminal-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 800px;
  background-color: rgba(0, 20, 0, 0.9);
  border: 1px solid #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
  z-index: 10;
}

.terminal-dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #00ff00;
  color: #000;
}

.terminal-dialog-title {
  font-weight: bold;
}

.terminal-dialog-close {
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-weight: bold;
}

.terminal-dialog-content {
  padding: 15px;
}

/* Terminal button */
.terminal-button {
  background-color: rgba(0, 20, 0, 0.8);
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 5px 10px;
  margin: 5px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s ease;
}

.terminal-button:hover {
  background-color: rgba(0, 40, 0, 0.8);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.terminal-button-active {
  background-color: rgba(0, 60, 0, 0.8);
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.7) inset;
}

.terminal-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Terminal status line */
.terminal-status-line {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  font-size: 14px;
  color: #ff00ff;
}

.terminal-status-ip {
  font-weight: bold;
}

/* CRT effect */
.crt-effect {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 3;
  mix-blend-mode: overlay;
}
```
