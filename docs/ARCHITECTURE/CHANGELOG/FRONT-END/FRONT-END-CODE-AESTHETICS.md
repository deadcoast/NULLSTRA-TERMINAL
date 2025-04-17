# FRONT END CODE AESTHETICS AND VISUAL EFFECTS

## TERMINAL CONTAINER

These components are designed to be pure UI containers that you can populate with your own data from your command system.

## Key Components

### Core Terminal UI Components

1. **TerminalWindow**: Pure container component

   ```tsx
   <TerminalWindow>{/* Your content goes here */}</TerminalWindow>
   ```

2. **TerminalHeader**: Header component that takes only a title

   ```tsx
   <TerminalHeader title="Your Title Here" />
   ```

3. **TerminalOutput**: Generic container for output content

   ```tsx
   <TerminalOutput>{/* Your terminal output lines go here */}</TerminalOutput>
   ```

4. **TerminalOutputLine**: Individual line with styling options

   ```tsx
   <TerminalOutputLine type="error" prefix="FAIL" timestamp="13:07:45">
     Error message here
   </TerminalOutputLine>
   ```

5. **TerminalPrompt**: Input component that takes a path and callback

   ```tsx
   <TerminalPrompt path="Legislation/Security" onCommand={handleCommand} />
   ```

6. **TerminalFileList**: Takes only a title and array of files

   ```tsx
   <TerminalFileList
     title="Directory contents:"
     files={yourFilesArray}
     onFileClick={handleFileClick}
   />
   ```

7. **TerminalDialog**: Modal dialog container
   ```tsx
   <TerminalDialog title="DECRYPT INPUT" onClose={closeDialog}>
     {/* Dialog content */}
   </TerminalDialog>
   ```

### Visual Effect Components

- **CRTEffect**: Configurable screen effect component
  ```tsx
  <CRTEffect intensity={0.7} flickerFrequency={0.03} scanlineSpacing={4} />
  ```

These components are completely decoupled from CURRENT data and logic. They're designed to be styled containers that you can populate with your command system's output. No example data, no hardcoded content - just the visual UI elements.

## Integration Example

Here's how you'd integrate these with your existing command system:

```tsx
// Inside your terminal component
return (
  <TerminalWindow>
    <CRTEffect />

    {showHeader && <TerminalHeader title={headerTitle} />}

    <TerminalOutput>
      {commandOutputs.map((output, index) => (
        <TerminalOutputLine
          key={index}
          type={output.type}
          prefix={output.prefix}
          timestamp={output.timestamp}
        >
          {output.content}
        </TerminalOutputLine>
      ))}
    </TerminalOutput>

    {currentDirectory && (
      <TerminalFileList
        title={`The folder ${currentDirectory} contains the following files:`}
        files={directoryContents}
        onFileClick={handleFileClick}
      />
    )}

    <TerminalPrompt
      path={currentPath}
      onCommand={executeCommand}
      disabled={isProcessing}
    />

    <TerminalStatusLine ipAddress={ipAddress} />

    {showDecryptDialog && (
      <TerminalDialog
        title="DECRYPT INPUT"
        onClose={() => setShowDecryptDialog(false)}
      >
        {/* Your decrypt UI */}
      </TerminalDialog>
    )}
  </TerminalWindow>
);
```

## NULLSTRA THEME

```typescript
nullstra: {
  id: 'nullstra',
  name: 'NULLSTRA',
  description: 'Official NULLSTRA terminal theme with branded colors',
  colors: {
    background: '#0b0b0cff', // night
    foreground: '#c2f04cff', // lime
    cursor: '#ea39b9ff', // shocking-pink
    selection: '#2f04cf33', // chrysler-blue with alpha
    black: '#000000ff', // black
    red: '#FF0055',
    green: '#c2f04cff', // lime
    yellow: '#f6ed5dff', // maize
    blue: '#2f04cfff', // chrysler-blue
    magenta: '#ea39b9ff', // shocking-pink
    cyan: '#9cb7ceff', // powder-blue
    // Additional colors defined...
  },
  effects: {
    glitchIntensity: 'low',
    crtEffect: true,
    crtIntensity: 0.5,
    scanlines: true,
    noise: true,
    noiseIntensity: 0.05,
    textShadow: true,
    animation: 'subtle',
  },
  fonts: {
    primary: 'var(--font-terminal), monospace',
    secondary: 'Consolas, monospace',
    size: '14px',
    lineHeight: '1.5',
  },
}
```

## CSS EFFECT INTEGRATION EXAMPLES

### Reactive Backgrounds

```css
.terminal-background {
  background-color: #0b0b0c; /* night */
  transition: background 0.3s ease;
  position: relative;
  overflow: hidden; /* For noise/scanline overlays */
}

.terminal-background.processing {
  /* Example: subtle radial pulse */
  background: radial-gradient(
    circle at center,
    rgba(0, 100, 0, 0.08) 0%,
    #0b0b0c 70%
  );
}

/* Add pseudo-elements for noise/scanlines */
.terminal-background::before {
  /* Noise */
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("noise.png"); /* Or generate with JS/Canvas/SVG */
  opacity: 0.05;
  animation: noise-animation 0.2s infinite steps(2);
}
.terminal-background::after {
  /* Scanlines */
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.1) 50%, transparent 50%);
  background-size: 100% 4px;
  opacity: 0.1;
  animation: scanline-animation 10s linear infinite;
}

@keyframes noise-animation {
  /* Simple example */
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(2px, 2px);
  }
}
@keyframes scanline-animation {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 -200px;
  }
}
```

### Command Execution Flash (CSS Example)

Apply `.command-executed` class briefly to the input line container.

```css
.command-input-line.command-executed {
  animation: command-flash 0.2s ease-out forwards;
}

@keyframes command-flash {
  0% {
    background-color: rgba(0, 255, 0, 0.15);
  }
  100% {
    background-color: transparent;
  }
}
```

### Status Indicator Animation (CSS Example)

Apply to status tags.

```css
.status-tag {
  position: relative;
  overflow: hidden; /* Optional: for internal animations */
  animation: status-appear 0.3s ease-out;
}

.status-tag.updated::after {
  /* Example: subtle shimmer on update */
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
  animation: status-slide 1.5s ease-out;
}

@keyframes status-appear {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes status-slide {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}
```

### Cursor Fade Blink (CSS Example)

```css
.cursor {
  background-color: #00ff00; /* Or appropriate color */
  animation: blink-fade 1s infinite steps(1, end);
}
@keyframes blink-fade {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
```

### Variable Text Intensity

```css
/* Add to global.css */

/* Variable text intensity */
.terminal-text {
  text-shadow: 0 0 1px rgba(0, 255, 0, 0.7);
  transition: text-shadow 0.3s ease;
}
.terminal-text.highlight {
  text-shadow: 0 0 3px rgba(0, 255, 0, 0.9);
}

/* Better cursor animation */
@keyframes cursor-pulse {
  0%,
  100% {
    opacity: 1;
  }
  40% {
    opacity: 0.8;
  }
  50% {
    opacity: 0;
  }
  60% {
    opacity: 0.8;
  }
}

.cursor {
  animation: cursor-pulse 1.2s infinite;
  box-shadow: 0 0 3px rgba(0, 255, 0, 0.7);
}

/* Command execution feedback */
.command-execute {
  animation: command-flash 0.3s ease;
}

@keyframes command-flash {
  0% {
    background-color: rgba(0, 255, 0, 0.2);
  }
  50% {
    background-color: rgba(0, 255, 0, 0.1);
  }
  100% {
    background-color: transparent;
  }
}

/* Status indicators */
.status-indicator {
  position: relative;
  overflow: hidden;
}

.status-indicator::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 0, 0.2),
    transparent
  );
  animation: status-slide 2s infinite;
}

@keyframes status-slide {
  0% {
    left: -100%;
  }
  50%,
  100% {
    left: 100%;
  }
}

/* Button hover states */
.terminal-button {
  transition: all 0.2s ease;
  border: 1px solid rgba(0, 255, 0, 0.5);
}

.terminal-button:hover {
  background-color: rgba(0, 255, 0, 0.2);
  border-color: rgba(0, 255, 0, 0.8);
  box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
}

/* Network activity indicator */
.network-active {
  position: relative;
}

.network-active::before {
  content: "";
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #00ff00;
  right: -10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}
```

### New JavaScript Effects

#### Improved Typewriter Effect

```typescript
// Enhanced TypeWriter component
const enhancedTypeWriter = (
  text: string,
  callback: (chunk: string) => void
) => {
  let currentIndex = 0;
  const chunks = text.split(/(?<=[.,!?:;])\s+/); // Split by punctuation

  const typeChunk = () => {
    if (currentIndex < chunks.length) {
      const chunk = chunks[currentIndex];

      // Variable speed based on chunk complexity
      const speed = Math.max(30, Math.min(100, chunk.length * 5));

      callback(chunk + " ");
      currentIndex++;

      // Random slight pause after punctuation
      setTimeout(typeChunk, speed + Math.random() * 100);
    }
  };

  typeChunk();
};
```

#### Dynamic Background Noise

```typescript
// Add to CRTEffect.tsx
const createNoise = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  intensity: number
) => {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    // More sophisticated noise algorithm
    const noise = Math.random() * 255;
    const value = noise < 230 ? 0 : noise;

    data[i] = value * intensity; // r
    data[i + 1] = value * intensity; // g
    data[i + 2] = value * intensity; // b
    data[i + 3] = noise < 230 ? 0 : (noise - 230) * 10 * intensity; // alpha
  }

  return imageData;
};

// Update the render function to apply dynamic noise
const render = () => {
  // ... existing code

  // Apply dynamic noise that changes during "processing" states
  const noiseIntensity = isProcessing ? 0.2 : 0.05;
  const noiseData = createNoise(ctx, canvas, noiseIntensity);
  ctx.putImageData(noiseData, 0, 0);

  // ... rest of rendering code
};
```

### Enhanced Components

#### Terminal Command Button

```tsx
// New component for the terminal buttons seen in the DECRYPT UI
interface TerminalButtonProps {
  icon: string;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}

const TerminalButton: React.FC<TerminalButtonProps> = ({
  icon,
  onClick,
  active = false,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`
        terminal-button w-8 h-8 flex items-center justify-center
        ${active ? "bg-terminal-green bg-opacity-20" : "bg-transparent"}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
      `}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className={`text-terminal-green ${
          isHovered && !disabled ? "text-opacity-100" : "text-opacity-80"
        }`}
      >
        {icon}
      </span>
      {isHovered && !disabled && (
        <div className="absolute bottom-full mb-1 px-2 py-1 text-xs bg-terminal-black border border-terminal-green rounded">
          {icon}
        </div>
      )}
    </button>
  );
};
```

#### Command Input with Enhanced Feedback

```tsx
// Enhanced CommandPrompt component
const CommandPrompt: React.FC<CommandPromptProps> = ({
  path,
  onSubmit,
  history,
  historyIndex,
  onNavigateHistory,
}) => {
  const [input, setInput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle command execution with visual feedback
  const handleSubmit = () => {
    if (!input.trim()) return;

    setIsExecuting(true);

    // Visual delay for execution effect
    setTimeout(() => {
      onSubmit(input);
      setInput("");
      setIsExecuting(false);
    }, 200);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onNavigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onNavigateHistory("down");
    }
  };

  return (
    <div className={`command-prompt ${isExecuting ? "command-execute" : ""}`}>
      <div className="text-terminal-brightGreen mr-2 flex items-center">
        <span>USER</span>
        <span className="text-terminal-white mx-1">/</span>
        <span className="path">{path}</span>
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
          disabled={isExecuting}
        />
        <span className={`cursor ${isExecuting ? "hidden" : ""}`} />
      </div>
    </div>
  );
};
```

1. **Enhanced Typewriter Effect**: Implement a more sophisticated typing algorithm that varies speed, adds natural pauses, and can render chunks of text rather than just characters

2. **Reactive Backgrounds**: Create background effects that subtly respond to terminal activity:

```css
.terminal.processing {
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 25, 0, 0.1) 0%,
    rgba(0, 0, 0, 0) 70%
  );
}
```

3. **Command Execution Flash**: Add a flash effect when commands are executed:

```css
@keyframes command-flash {
  0% {
    background-color: rgba(0, 255, 0, 0.1);
  }
  50% {
    background-color: rgba(0, 255, 0, 0.05);
  }
  100% {
    background-color: transparent;
  }
}
```

4. **Status Indicators**: Create subtle animations for terminal status changes:

```css
.status-indicator {
  position: relative;
  overflow: hidden;
}

.status-indicator::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(0, 255, 0, 0.1),
    transparent
  );
  animation: status-slide 2s infinite;
}
```
