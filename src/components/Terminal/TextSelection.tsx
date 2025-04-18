import * as React from "react";
const {   useCallback, useEffect, useRef, useState   } = React;

export type SelectionMode = "normal" | "rectangular" | "smart";
export type SmartPattern =
  | "url"
  | "path"
  | "email"
  | "ipAddress"
  | "date"
  | "number";

interface TextSelectionProps {
  children: React.ReactNode;
  className?: string;
  selectionMode?: SelectionMode;
  autoSelectPatterns?: SmartPattern[];
  copyOnSelection?: boolean;
  persistSelection?: boolean;
  onSelectionChange?: (_text: string, _mode: SelectionMode) => void;
}

// Regular expressions for smart selection
const SMART_PATTERNS = {
  url: /(https?:\/\/[^\s]+)/g,
  path: /(\/?[\w.-]+\/[\w.-/]+)/g,
  email: /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
  ipAddress: /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g,
  date: /(\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})/g,
  number: /(\b\d+(\.\d+)?\b)/g,
};

const TextSelection: React.FC<TextSelectionProps> = ({
  children,
  className = "",
  selectionMode = "normal",
  autoSelectPatterns = ["url", "path", "email", "ipAddress"],
  copyOnSelection = false,
  persistSelection = false,
  onSelectionChange,
}) => {
  const [activeMode, setActiveMode] = useState<SelectionMode>(selectionMode);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [rectangularSelection, setRectangularSelection] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);
  const [selectedText, setSelectedText] = useState<string>("");
  const [highlightedRanges, setHighlightedRanges] = useState<
    Array<{
      text: string;
      type: SmartPattern;
      startIndex: number;
    }>
  >([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectionOverlayRef = useRef<HTMLDivElement>(null);

  // Toggle selection mode
  const toggleSelectionMode = useCallback(() => {
    setActiveMode((prev) => {
      switch (prev) {
        case "normal":
          return "rectangular";
        case "rectangular":
          return "smart";
        case "smart":
        default:
          return "normal";
      }
    });
  }, []);

  // Handle mouse down to start selection
  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setSelectionStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });

      // Clear previous selection if not in persistent mode
      if (!persistSelection) {
        setRectangularSelection(null);
        setSelectedText("");
      }
    }
  };

  // Handle mouse move to update selection
  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectionStart && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      if (activeMode === "rectangular") {
        // For rectangular selection, create a rectangle
        const left = Math.min(selectionStart.x, currentX);
        const top = Math.min(selectionStart.y, currentY);
        const width = Math.abs(currentX - selectionStart.x);
        const height = Math.abs(currentY - selectionStart.y);

        setRectangularSelection({ top, left, width, height });
      }

      // We'll handle normal selection using the browser's built-in selection API
    }
  };

  // Handle mouse up to finalize selection
  const handleMouseUp = () => {
    if (selectionStart) {
      setSelectionStart(null);

      if (activeMode === "normal") {
        // Get the browser's selection for normal mode
        const selection = window.getSelection();
        if (selection && selection.toString()) {
          const selectedText = selection.toString();
          setSelectedText(selectedText);

          if (onSelectionChange) {
            onSelectionChange(selectedText, "normal");
          }

          if (copyOnSelection) {
            copyToClipboard(selectedText);
          }
        }
      } else if (activeMode === "rectangular" && rectangularSelection) {
        // For rectangular selection, we need to extract text within the rectangle
        extractRectangularSelection();
      }
    }
  };

  // Extract text from rectangular selection
  const extractRectangularSelection = useCallback(() => {
    if (!rectangularSelection || !containerRef.current) return;

    const { top, left, width, height } = rectangularSelection;
    const container = containerRef.current;
    const containerText = container.innerText;
    const lines = containerText.split("\n");

    // Calculate character positions
    const charWidth = 8; // Estimate average character width
    const lineHeight = 20; // Estimate line height

    const startLine = Math.max(0, Math.floor(top / lineHeight));
    const endLine = Math.min(
      lines.length - 1,
      Math.floor((top + height) / lineHeight),
    );

    const startColumn = Math.max(0, Math.floor(left / charWidth));
    const endColumn = Math.max(0, Math.floor((left + width) / charWidth));

    // Extract the rectangular area of text
    const selectedLines = [];
    for (let i = startLine; i <= endLine; i++) {
      if (i < lines.length) {
        const line = lines[i] || "";
        const selectedPortion = line.substring(startColumn, endColumn);
        selectedLines.push(selectedPortion);
      }
    }

    const extractedText = selectedLines.join("\n");
    setSelectedText(extractedText);

    if (onSelectionChange) {
      onSelectionChange(extractedText, "rectangular");
    }

    if (copyOnSelection) {
      copyToClipboard(extractedText);
    }
  }, [rectangularSelection, copyOnSelection, onSelectionChange]);

  // Smart pattern detection
  const detectSmartPatterns = useCallback(() => {
    if (!containerRef.current || activeMode !== "smart") return;

    const containerText = containerRef.current.innerText;
    const foundPatterns: Array<{
      text: string;
      type: SmartPattern;
      startIndex: number;
    }> = [];

    // Find matches for each pattern type
    autoSelectPatterns.forEach((patternType) => {
      const regex = SMART_PATTERNS[patternType];
      if (regex) {
        let match;
        while ((match = regex.exec(containerText)) !== null) {
          foundPatterns.push({
            text: match[0],
            type: patternType,
            startIndex: match.index,
          });
        }
      }
    });

    setHighlightedRanges(foundPatterns);
  }, [activeMode, autoSelectPatterns]);

  // Handle smart pattern click
  const handlePatternClick = (text: string, _type: SmartPattern) => {
    setSelectedText(text);

    if (onSelectionChange) {
      onSelectionChange(text, "smart");
    }

    if (copyOnSelection) {
      copyToClipboard(text);
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Optional: show feedback that text was copied
        console.log("Text copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  // Toggle selection mode with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+R to toggle selection mode
      if (e.altKey && e.key === "r") {
        e.preventDefault();
        toggleSelectionMode();
      }

      // Alt+C to copy current selection
      if (e.altKey && e.key === "c" && selectedText) {
        e.preventDefault();
        copyToClipboard(selectedText);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [toggleSelectionMode, selectedText]);

  // Update smart patterns when mode changes
  useEffect(() => {
    if (activeMode === "smart") {
      detectSmartPatterns();
    } else {
      setHighlightedRanges([]);
    }
  }, [activeMode, detectSmartPatterns]);

  // Apply rectangular selection as a styled overlay
  useEffect(() => {
    if (rectangularSelection && selectionOverlayRef.current) {
      const overlay = selectionOverlayRef.current;
      overlay.style.top = `${rectangularSelection.top}px`;
      overlay.style.left = `${rectangularSelection.left}px`;
      overlay.style.width = `${rectangularSelection.width}px`;
      overlay.style.height = `${rectangularSelection.height}px`;
      overlay.style.display = "block";
    } else if (selectionOverlayRef.current) {
      selectionOverlayRef.current.style.display = "none";
    }
  }, [rectangularSelection]);

  // Use external selection mode if it changes
  useEffect(() => {
    setActiveMode(selectionMode);
  }, [selectionMode]);

  // Handle keyboard interaction for the main content container
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add keyboard controls for selection if needed
    // For example, Escape could clear selection
    if (e.key === "Escape") {
      setSelectedText("");
      setRectangularSelection(null);
    }
  };

  return (
    <div className={`text-selection-container relative ${className}`}>
      {/* Selection mode indicator */}
      <div className="selection-mode-indicator absolute top-0 right-0 text-xs px-2 py-1 bg-black bg-opacity-80 text-lime rounded">
        {activeMode === "normal" && "Normal Selection"}
        {activeMode === "rectangular" && "Rectangular Selection (Alt+R)"}
        {activeMode === "smart" && "Smart Selection (Alt+R)"}
      </div>

      {/* Main content container with selection events */}
      <div
        ref={containerRef}
        className="text-selection-content"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onKeyDown={handleKeyDown}
        role="textbox"
        tabIndex={0}
        aria-label="Text selection area"
      >
        {/* Rectangular selection overlay */}
        <div
          ref={selectionOverlayRef}
          className="absolute bg-lime bg-opacity-30 pointer-events-none z-10"
          style={{ display: "none" }}
        />

        {/* Smart pattern highlighting */}
        {activeMode === "smart" && containerRef.current && (
          <div className="smart-highlights absolute inset-0 pointer-events-none">
            {highlightedRanges.map((range, index) => (
              <div
                key={`${range.type}-${index}`}
                className="smart-highlight-indicator absolute"
                style={{
                  // Positioning would require more complex calculation in a real implementation
                  backgroundColor: "rgba(120, 255, 180, 0.2)",
                  cursor: "pointer",
                }}
                onClick={() => handlePatternClick(range.text, range.type)}
                role="button"
                tabIndex={0}
                aria-label={`Select ${range.type}: ${range.text}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePatternClick(range.text, range.type);
                  }
                }}
              >
                {range.text}
              </div>
            ))}
          </div>
        )}

        {/* Actual content */}
        {children}
      </div>

      {/* Selection actions */}
      {selectedText && (
        <div className="selection-actions absolute bottom-2 right-2 bg-black bg-opacity-80 rounded p-1 flex space-x-1">
          <button
            className="text-xs px-2 py-1 bg-night text-lime border border-lime rounded"
            onClick={() => copyToClipboard(selectedText)}
            aria-label="Copy selection"
            title="Copy selection (Alt+C)"
          >
            Copy
          </button>
          <button
            className="text-xs px-2 py-1 bg-night text-lime border border-lime rounded"
            onClick={() => setSelectedText("")}
            aria-label="Clear selection"
            title="Clear selection"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default TextSelection;
