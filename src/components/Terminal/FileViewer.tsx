/*
 * 1. Implement a cleanup function in `handleClose` to ensure any ongoing operations related to closing are properly terminated before calling `onClose`.
 * 2. Add a prop to control the transition duration for closing, allowing for more flexible UI experiences.
 * 3. Enhance accessibility by adding ARIA roles and properties to the modal for better screen reader support.
 * 4. Implement error handling to manage exceptions and provide user feedback.
 * 5. Optimize performance by reducing unnecessary computations or using memoization.
 * 6. Enhance code readability by adding comments and using descriptive variable names.
 * 7. Use semantic HTML elements for better accessibility and SEO.
 * 8. Implement responsive design to ensure proper display on various devices.
 * 9. Optimize performance by minimizing CSS and JavaScript file sizes.
 */
import * as React from "react";
const {   useCallback, useEffect, useState   } = React;

import { Glitch } from "../UI";

interface FileViewerProps {
  filename: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  fileType?: string;
}

const FileViewer: React.FC<FileViewerProps> = ({
  filename,
  content,
  isOpen,
  onClose,
  fileType = "text",
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // Handle close button click
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Handle ESC key press to close the viewer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Determine if the file is a JSON file and format it
  const isJsonFile =
    filename.endsWith(".json") ||
    (content.trim().startsWith("{") && content.trim().endsWith("}")) ||
    (content.trim().startsWith("[") && content.trim().endsWith("]"));

  // Format JSON if needed
  const formattedContent = isJsonFile ? formatJsonContent(content) : content;

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 
        ${isClosing ? "opacity-0" : "opacity-100"}`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80"
        onClick={handleClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleClose();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Close file viewer"
      ></div>

      {/* Dialog */}
      <div
        className={`relative bg-terminal-black border border-terminal-green p-4 rounded-md w-3/4 max-w-4xl max-h-[80vh] 
          transform transition-transform duration-300 
          ${isClosing ? "scale-95" : "scale-100"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-terminal-green pb-2 mb-4">
          <div className="flex items-center">
            <span className="text-terminal-green mr-2">📄</span>
            <Glitch intensity="low">
              <h3 className="text-terminal-green font-bold">{filename}</h3>
            </Glitch>
          </div>
          <button
            onClick={handleClose}
            className="text-terminal-red hover:text-terminal-white focus:outline-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto max-h-[calc(80vh-8rem)]">
          <pre
            className={`whitespace-pre-wrap p-2 rounded text-terminal-white ${getContentClass(fileType, isJsonFile)}`}
          >
            {renderContent(formattedContent, isJsonFile)}
          </pre>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-terminal-green flex justify-between">
          <span className="text-terminal-cyan text-sm">
            {formatFileInfo(content)}
          </span>
          <button
            onClick={handleClose}
            className="bg-terminal-black border border-terminal-green text-terminal-green py-1 px-3 rounded hover:bg-terminal-green hover:text-terminal-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions
function formatJsonContent(content: string): string {
  try {
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return content; // Return original content if parsing fails
  }
}

function getContentClass(fileType: string, isJson: boolean): string {
  if (isJson) {
    return "json-content";
  }

  switch (fileType.toLowerCase()) {
    case "code":
    case "javascript":
    case "typescript":
    case "js":
    case "ts":
      return "code-content";
    case "markdown":
    case "md":
      return "markdown-content";
    default:
      return "text-content";
  }
}

function formatFileInfo(content: string): string {
  const lines = content.split("\n").length;
  const chars = content.length;
  return `${lines} lines, ${chars} characters`;
}

function renderContent(content: string, isJson: boolean): React.ReactNode {
  if (!isJson) {
    return content;
  }

  // Simple JSON syntax highlighting
  return content.split("\n").map((line, index) => {
    // Highlight keys in quotes followed by a colon
    const highlightedLine = line
      .replace(/(".*?"):/g, "<span class='text-terminal-yellow'>$1</span>:")
      .replace(
        /(:\s*)"(.*?)"/g,
        "$1<span class='text-terminal-green'>$2</span>",
      )
      .replace(
        /(:\s*)(true|false|null|\d+)/g,
        "$1<span class='text-terminal-cyan'>$2</span>",
      );

    return (
      <div key={index} dangerouslySetInnerHTML={{ __html: highlightedLine }} />
    );
  });
}

export default FileViewer;
