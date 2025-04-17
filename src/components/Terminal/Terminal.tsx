'use client';
/**
 * 1. Implement error handling to manage exceptions and improve robustness.  
2. Use TypeScript interfaces or types to define data structures for better type safety.  
3. Optimize performance by minimizing unnecessary computations or using memoization.  
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../../context';
import { useSocket } from '../../hooks';
import { CommandResult } from '../../hooks/useSocket';
import { formatIpAddress, formatTimestamp } from '../../utils/effectsHelper';
import { TerminalMessage } from '../../utils/terminalCommands/types';
import { CRTEffect } from '../UI';
import FileViewer from './FileViewer';
import StatusPanel from './StatusPanel';
import './terminal.css';

import TerminalHeader from './TerminalHeader';
import TerminalOutput from './TerminalOutput';
import TerminalPrompt from './TerminalPrompt';
import TerminalStatusLine from './TerminalStatusLine';
import TerminalWindow from './TerminalWindow';
import ThemeSelector from './ThemeSelector';

const BOX_CHARS = {
  // Single Line
  TL: '┌',
  TR: '┐',
  BL: '└',
  BR: '┘',
  HZ: '─',
  VT: '│',
  LT: '├',
  RT: '┤',
  TT: '┬',
  BT: '┴',
  // Double Line (Used in Button/Line Numbers)
  DVT: '║', // Double Vertical
  DTL: '╔',
  DTR: '╗',
  DBL: '╚',
  DBR: '╝',
  // Mixed Single/Double (Used in Button/Line Numbers)
  LTD: '╠', // VT-Double HZ Left Tee ( │ + ═ ) -> Your example uses this: │╠─
  RTD: '╣', // VT-Double HZ Right Tee ( │ + ═ ) -> Not in example, but inverse of LTD
  DHLT: '╦', // Double HZ-VT Top Tee ( ═ + │ ) -> Your example uses this: ─╦─
  DHBT: '╩', // Double HZ-VT Bottom Tee ( ═ + │ ) -> Not in example
  // Mixed Double/Single (Not explicitly in example, but possible)
  DLT: '╟', // Double VT-HZ Left Tee ( ║ + ─ )
  DRT: '╢', // Double VT-HZ Right Tee ( ║ + ─ )
  TTD: '╤', // Top Tee Double Vertical
  BTD: '╧', // Bottom Tee Double Vertical
};

/**
 * Generates the top bar section.
 * @param {number} titleWidth - The width allocated for the first section (e.g., 'CLEye').
 * @param {number} contentWidth - The width allocated for the second section (e.g., '> ALWAYS_WATCHING').
 * @param {string} title - The text for the first section.
 * @param {string} content - The text for the second section.
 * @returns {string[]} - An array containing the three lines of the top bar.
 */
function generateTopBar(
  titleWidth: number,
  contentWidth: number,
  title: string,
  content: string
): string[] {
  const top =
    BOX_CHARS.TL +
    BOX_CHARS.HZ.repeat(titleWidth) +
    BOX_CHARS.TT +
    BOX_CHARS.HZ.repeat(contentWidth) +
    BOX_CHARS.TR;
  const middle =
    BOX_CHARS.VT +
    ` ${title} `.padEnd(titleWidth) +
    BOX_CHARS.VT +
    ` ${content} `.padEnd(contentWidth) +
    BOX_CHARS.VT;
  const bottom =
    BOX_CHARS.LT +
    BOX_CHARS.HZ.repeat(titleWidth) +
    BOX_CHARS.BT +
    BOX_CHARS.HZ.repeat(contentWidth) +
    BOX_CHARS.RT;
  return [top, middle, bottom];
}

/**
 * Generates the button section (based on your provided structure).
 * Requires knowledge of the total terminal width to add padding and the right border.
 * @param {number} buttonInnerWidth - The width inside the double borders (excluding the ║ chars).
 * @param {number} totalWidth - The total width of the terminal line (for padding).
 * @param {string} title - The text for the button.
 * @returns {string[]} - An array containing the three lines of the button section.
 */
function generateButtonSection(
  buttonInnerWidth: number,
  totalWidth: number,
  title: string
): string[] {
  const titlePadding = Math.floor((buttonInnerWidth - title.length) / 2);
  const extraPadding = buttonInnerWidth - title.length - 2 * titlePadding; // Handles odd widths

  // Line 1: ├─╦──────────────╗ ... │
  const topContent =
    BOX_CHARS.LT +
    BOX_CHARS.HZ +
    BOX_CHARS.DHLT +
    BOX_CHARS.HZ.repeat(buttonInnerWidth) +
    BOX_CHARS.DTR;
  const top = topContent.padEnd(totalWidth - 1, ' ') + BOX_CHARS.VT;

  // Line 2: │ ║   NULLSTRA   ║ ... │
  const middleContent =
    BOX_CHARS.VT +
    ' ' +
    BOX_CHARS.DVT +
    ' '.repeat(titlePadding) +
    title +
    ' '.repeat(titlePadding + extraPadding) +
    BOX_CHARS.DVT;
  const middle = middleContent.padEnd(totalWidth - 1, ' ') + BOX_CHARS.VT;

  // Line 3: │ ╠──────────────╝ ... │
  const bottomContent =
    BOX_CHARS.VT +
    ' ' +
    BOX_CHARS.LTD +
    BOX_CHARS.HZ.repeat(buttonInnerWidth) +
    BOX_CHARS.DBR;
  const bottom = bottomContent.padEnd(totalWidth - 1, ' ') + BOX_CHARS.VT;

  return [top, middle, bottom];
}

/**
 * Generates a single content line with a line number.
 * @param {number} lineNumber - The line number to display.
 * @param {string} content - The actual content for the line.
 * @param {number} totalWidth - The total width of the terminal line.
 * @param {number} lineNumberWidth - How much space to allocate for the number (e.g., 1 or 2 for numbers < 100).
 * @returns {string} - The formatted line string.
 */
function generateContentLine(
  lineNumber: number,
  content: string,
  totalWidth: number,
  lineNumberWidth: number = 1
): string {
  const numStr = lineNumber.toString().padStart(lineNumberWidth, ' '); // Pad number if needed
  const left = BOX_CHARS.VT + numStr + BOX_CHARS.LTD + BOX_CHARS.HZ + ' '; // Example: │1╠─
  const right = ' ' + BOX_CHARS.VT; // Example:  │
  const availableWidth = totalWidth - left.length - right.length;
  const paddedContent = content.padEnd(availableWidth, ' ');

  return left + paddedContent + right;
}

/**
 * Generates the line marking the end of the numbered section.
 * @param {number} totalWidth - The total width of the terminal line.
 * @param {number} lineNumberWidth - The width used for line numbers (must match generateContentLine).
 * @returns {string} - The formatted line string.
 */
function generateLineNumberEnd(
  totalWidth: number,
  lineNumberWidth: number = 1
): string {
  // Needs to align with the vertical line before the number and the ╝ character
  // Example: ├─╝
  const left =
    BOX_CHARS.LT + BOX_CHARS.HZ.repeat(lineNumberWidth) + BOX_CHARS.DBR; // Assuming ╝ aligns under ╠
  const right = BOX_CHARS.VT;
  const padding = totalWidth - left.length - right.length;
  return left + ' '.repeat(padding) + right;
}

/**
 * Generates the final bottom border.
 * @param {number} totalWidth - The total width of the terminal line.
 * @returns {string} - The bottom border string.
 */
function generateBottomBorder(totalWidth: number): string {
  return BOX_CHARS.BL + BOX_CHARS.HZ.repeat(totalWidth - 2) + BOX_CHARS.BR;
}

/**
 * Generates the complete terminal frame.
 * @param {Object} config - The configuration object containing:
 *   - totalWidth: The total width of the terminal line.
 *   - topBarTitle: The title for the top bar./**
 * Generates the complete static frame of the terminal.
 * @param {object} config
 * @param {number} config.totalWidth - Overall width (character count).
 * @param {string} config.topBarTitle - Title for the top bar left section.
 * @param {number} config.topBarTitleWidth - Width for the top bar left section.
 * @param {string} config.topBarContent - Content for the top bar right section.
 * @param {string} config.buttonTitle - Title for the button.
 * @param {number} config.buttonInnerWidth - Width inside the button's double borders.
 * @param {string[]} config.initialContent - Array of initial content strings for numbered lines.
 * @param {number} config.lineNumberWidth - Space for line numbers (e.g., 1 for 1-9, 2 for 10-99).
 * @param {string} config.leadingSpaces - Optional string to prepend to each line (e.g., '  ').
 * @returns {string[]} - Array of strings representing the complete terminal frame.
 */
function generateTerminalFrame({
  totalWidth,
  topBarTitle,
  topBarTitleWidth,
  topBarContent,
  buttonTitle,
  buttonInnerWidth,
  initialContent,
  lineNumberWidth = 1,
  leadingSpaces = '  ', // Match your original code's indentation
}: {
  totalWidth: number;
  topBarTitle: string;
  topBarTitleWidth: number;
  topBarContent: string;
  buttonTitle: string;
  buttonInnerWidth: number;
  initialContent: string[];
  lineNumberWidth?: number;
  leadingSpaces?: string;
}): string[] {
  const lines: string[] = [];
  const topBarContentWidth = totalWidth - topBarTitleWidth - 3; // -3 for borders │, ┬, │

  // 1. Top Bar
  const topBarLines = generateTopBar(
    topBarTitleWidth,
    topBarContentWidth,
    topBarTitle,
    topBarContent
  );
  lines.push(...topBarLines.map((line) => leadingSpaces + line));

  // 2. Button Section
  const buttonLines = generateButtonSection(
    buttonInnerWidth,
    totalWidth,
    buttonTitle
  );
  lines.push(...buttonLines.map((line) => leadingSpaces + line));

  // 3. Initial Content Lines with Numbers
  initialContent.forEach((content, index) => {
    const line = generateContentLine(
      index + 1,
      content,
      totalWidth,
      lineNumberWidth
    );
    lines.push(leadingSpaces + line);
  });

  // 4. Line Number End Separator
  const endLine = generateLineNumberEnd(totalWidth, lineNumberWidth);
  lines.push(leadingSpaces + endLine);

  // 5. Bottom Border
  const bottomLine = generateBottomBorder(totalWidth);
  lines.push(leadingSpaces + bottomLine);

  return lines;
}

// --- Configuration for the Frame ---
const terminalConfig = {
  totalWidth: 75, // Adjust to your desired total width (char count)
  topBarTitle: 'CLEye',
  topBarTitleWidth: 7, // Width for ' CLEye ' section
  topBarContent: '> ALWAYS_WATCHING',
  buttonTitle: 'NULLSTRA',
  buttonInnerWidth: 14, // Width for ' NULLSTRA ' section inside ║
  initialContent: [
    '{',
    ' "name": "USER_43127",',
    ' "IP": "192.168.1.100",',
    ' "path": "C:/chrome/chrome.exe",',
    ' "enabled_tracking": true',
    '}',
  ],
  lineNumberWidth: 1, // Use 1 for single-digit line numbers
  leadingSpaces: ' ', // Keep the indentation
};

// --- Define Props Interface ---
export interface TerminalProps {
  ipAddress?: string;
  showHeader?: boolean;
  showStatus?: boolean;
  initialMessages?: TerminalMessage[] | CommandResult[];
  title?: string;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
  className?: string;
}

// --- Terminal Component ---
const Terminal: React.FC<TerminalProps> = ({
  ipAddress = '127.0.0.1',
  showHeader = true,
  showStatus = true,
  initialMessages = [],
  title = 'Terminal',
  onMinimize,
  onMaximize,
  onClose,
  className,
}) => {
  // Theme context
  const { theme } = useTheme();
  const outputRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLInputElement>(null);
  const terminalOutputRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  // Terminal state
  const [inputValue, setInputValue] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [outputMessages, setOutputMessages] = useState<CommandResult[]>(
    initialMessages as CommandResult[]
  );
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  // Generate session ID based on IP address
  const sessionId = `session-${ipAddress.replace(/\./g, '-')}`;

  // Socket.io hook
  const {
    isConnected,
    isExecuting,
    commandResults,
    error,
    executeCommand,
    getCommandHistory,
    clearResults,
  } = useSocket();

  // State for file viewer
  const [fileViewer, setFileViewer] = useState({
    isOpen: false,
    filename: '',
    content: '',
    fileType: 'text',
  });

  // State for file viewer dialog
  const [fileViewerOpen, setFileViewerOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState({
    name: '',
    content: '',
    type: 'text',
  });

  // Update output messages when command results change
  useEffect(() => {
    if (commandResults.length > 0) {
      setOutputMessages((prevMessages) => [...prevMessages, ...commandResults]);
    }
  }, [commandResults]);

  // Show error messages
  useEffect(() => {
    if (error) {
      const errorMsg: CommandResult = {
        content: `Error: ${error}`,
        timestamp: new Date().toISOString(),
        type: 'error',
      };
      setOutputMessages((prev) => [...prev, errorMsg]);
    }
  }, [error]);

  // Scroll to bottom when output messages change
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop =
        terminalOutputRef.current.scrollHeight;
    }
  }, [outputMessages]);

  // Get command history from server on mount
  useEffect(() => {
    if (isConnected) {
      getCommandHistory(sessionId);
    }
  }, [isConnected, getCommandHistory, sessionId]);

  // Focus input on mount
  useEffect(() => {
    terminalInputRef.current?.focus();
  }, []);

  // Focus input when clicked anywhere in terminal
  const focusInput = () => {
    terminalInputRef.current?.focus();
  };

  const handleCommandSubmit = (command: string) => {
    if (!command.trim()) {
      return;
    }

    // Special command handling
    if (command.trim() === 'clear') {
      handleClear();
      return;
    }

    if (command.trim() === 'theme') {
      setThemeDialogOpen(true);
      return;
    }

    // Parse command and arguments
    const parts = command.trim().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    // Add to command history
    setCommandHistory((prev) => [command, ...prev].slice(0, 100));
    setHistoryIndex(-1);

    // Clear input
    setInputValue('');

    // Execute command
    executeCommand(cmd, args, sessionId);
  };

  // Handle input change
  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  // Handle key navigation (up/down for history)
  const handleKeyNavigation = (direction: 'up' | 'down') => {
    if (commandHistory.length === 0) {
      return;
    }

    if (direction === 'up') {
      // Navigate up in history
      const newIndex =
        historyIndex < commandHistory.length - 1
          ? historyIndex + 1
          : historyIndex;
      setHistoryIndex(newIndex);
      setInputValue(commandHistory[newIndex] || '');
    } else {
      // Navigate down in history
      const newIndex = historyIndex > 0 ? historyIndex - 1 : -1;
      setHistoryIndex(newIndex);
      setInputValue(newIndex === -1 ? '' : commandHistory[newIndex]);
    }
  };

  // Handle clear command
  const handleClear = useCallback(() => {
    setOutputMessages([]);
    clearResults();
  }, [clearResults]);

  // Open file viewer
  const handleOpenFile = (
    filename: string,
    content: string,
    fileType = 'text'
  ) => {
    setFileViewer({
      isOpen: true,
      filename,
      content,
      fileType,
    });
  };

  // --- Generate Initial Frame ---
  const initialFrameLines = generateTerminalFrame(terminalConfig);

  // Include the initial frame in messages for display
  const allDisplayMessages = React.useMemo(() => {
    const frameMessages = initialFrameLines.map((line) => ({
      content: line,
      timestamp: new Date().toISOString(),
      type: 'info' as const,
    }));

    // Add a spacer
    const spacerMessage = {
      content: '',
      timestamp: new Date().toISOString(),
      type: 'info' as const,
    };

    return [...frameMessages, spacerMessage, ...outputMessages];
  }, [initialFrameLines, outputMessages]);

  return (
    <div
      className={`terminal-container ${className || ''}`}
      onClick={focusInput}
    >
      <div
        className="h-screen overflow-hidden flex flex-col"
        style={{
          backgroundColor: theme.colors.background,
          color: theme.colors.foreground,
          fontFamily: theme.fonts.primary,
          fontSize: theme.fonts.size,
          lineHeight: theme.fonts.lineHeight,
        }}
      >
        <TerminalWindow isProcessing={isExecuting}>
          {/* Header section */}
          {showHeader && <TerminalHeader title={title} ipAddress={ipAddress} />}

          {/* Main terminal area */}
          <div className="flex-grow overflow-hidden relative p-2">
            {/* Add the CRT effect */}
            <CRTEffect
              intensity={theme.effects?.crtIntensity || 0.5}
              isProcessing={isExecuting}
            />

            {/* Status Panel */}
            <StatusPanel className="mb-4" />

            {/* Terminal output area */}
            <TerminalOutput
              messages={outputMessages}
              onExecuteCommand={handleCommandSubmit}
              ref={terminalOutputRef}
            />

            {/* Command input */}
            <TerminalPrompt
              value={inputValue}
              onChange={handleInputChange}
              onSubmit={handleCommandSubmit}
              onClear={handleClear}
              onKeyNavigation={handleKeyNavigation}
              disabled={isExecuting || !isConnected}
              ref={terminalInputRef}
              cursorStyle="fade"
            />
          </div>

          {/* Status bar */}
          {showStatus && (
            <TerminalStatusLine
              ipAddress={formatIpAddress(ipAddress)}
              isConnected={isConnected}
              isExecuting={isExecuting}
              timestamp={formatTimestamp()}
            />
          )}
        </TerminalWindow>

        {/* File viewer */}
        {fileViewer.isOpen && (
          <FileViewer
            filename={fileViewer.filename}
            content={fileViewer.content}
            fileType={fileViewer.fileType}
            isOpen={fileViewer.isOpen}
            onClose={() =>
              setFileViewer((prev) => ({ ...prev, isOpen: false }))
            }
          />
        )}

        {/* Theme selector */}
        {themeDialogOpen && (
          <div>
            <ThemeSelector minimal={false} />
            <button
              className="mt-2 px-3 py-1 border border-terminal-green text-terminal-green rounded"
              onClick={() => setThemeDialogOpen(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
