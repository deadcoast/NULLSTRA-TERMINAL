/**
 * Terminal UI rendering utilities
 * Contains helper functions for rendering terminal UI elements
 */

import {
  BOX_CHARS,
  createHorizontalLine,
  padLine,
  prefixLine,
} from "./boxDrawing";

/**
 * Generates the top bar section.
 * @param {number} titleWidth - The width allocated for the first section (e.g., 'CLEye').
 * @param {number} contentWidth - The width allocated for the second section (e.g., '> ALWAYS_WATCHING').
 * @param {string} title - The text for the first section.
 * @param {string} content - The text for the second section.
 * @returns {string[]} - An array containing the three lines of the top bar.
 */
export function generateTopBar(
  titleWidth: number,
  contentWidth: number,
  title: string,
  content: string,
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
export function generateButtonSection(
  buttonInnerWidth: number,
  totalWidth: number,
  title: string,
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
  const top = padLine(topContent, totalWidth);

  // Line 2: │ ║   NULLSTRA   ║ ... │
  const middleContent =
    BOX_CHARS.VT +
    " " +
    BOX_CHARS.DVT +
    " ".repeat(titlePadding) +
    title +
    " ".repeat(titlePadding + extraPadding) +
    BOX_CHARS.DVT;
  const middle = padLine(middleContent, totalWidth);

  // Line 3: │ ╠──────────────╝ ... │
  const bottomContent =
    BOX_CHARS.VT +
    " " +
    BOX_CHARS.LTD +
    BOX_CHARS.HZ.repeat(buttonInnerWidth) +
    BOX_CHARS.DBR;
  const bottom = padLine(bottomContent, totalWidth);

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
export function generateContentLine(
  lineNumber: number,
  content: string,
  totalWidth: number,
  lineNumberWidth: number = 1,
): string {
  const numStr = lineNumber.toString().padStart(lineNumberWidth, " "); // Pad number if needed
  const left = BOX_CHARS.VT + numStr + BOX_CHARS.LTD + BOX_CHARS.HZ + " "; // Example: │1╠─
  const right = " " + BOX_CHARS.VT; // Example:  │
  const availableWidth = totalWidth - left.length - right.length;
  const paddedContent = content.padEnd(availableWidth, " ");

  return left + paddedContent + right;
}

/**
 * Generates the line marking the end of the numbered section.
 * @param {number} totalWidth - The total width of the terminal line.
 * @param {number} lineNumberWidth - The width used for line numbers (must match generateContentLine).
 * @returns {string} - The formatted line string.
 */
export function generateLineNumberEnd(
  totalWidth: number,
  lineNumberWidth: number = 1,
): string {
  // Needs to align with the vertical line before the number and the ╝ character
  // Example: ├─╝
  const left =
    BOX_CHARS.LT + BOX_CHARS.HZ.repeat(lineNumberWidth) + BOX_CHARS.DBR; // Assuming ╝ aligns under ╠
  const right = BOX_CHARS.VT;
  const padding = totalWidth - left.length - right.length;
  return left + " ".repeat(padding) + right;
}

/**
 * Generates the final bottom border.
 * @param {number} totalWidth - The total width of the terminal line.
 * @returns {string} - The bottom border string.
 */
export function generateBottomBorder(totalWidth: number): string {
  return createHorizontalLine(
    totalWidth,
    BOX_CHARS.BL,
    BOX_CHARS.HZ,
    BOX_CHARS.BR,
  );
}

/**
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
export function generateTerminalFrame(config: {
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
  const {
    totalWidth,
    topBarTitle,
    topBarTitleWidth,
    topBarContent,
    buttonTitle,
    buttonInnerWidth,
    initialContent,
    lineNumberWidth = 1,
    leadingSpaces = "  ",
  } = config;

  const lines: string[] = [];
  const topBarContentWidth = totalWidth - topBarTitleWidth - 3; // -3 for borders │, ┬, │

  // 1. Top Bar
  const topBarLines = generateTopBar(
    topBarTitleWidth,
    topBarContentWidth,
    topBarTitle,
    topBarContent,
  );
  lines.push(...topBarLines.map((line) => prefixLine(line, leadingSpaces)));

  // 2. Button Section
  const buttonLines = generateButtonSection(
    buttonInnerWidth,
    totalWidth,
    buttonTitle,
  );
  lines.push(...buttonLines.map((line) => prefixLine(line, leadingSpaces)));

  // 3. Initial Content Lines with Numbers
  initialContent.forEach((content, index) => {
    const line = generateContentLine(
      index + 1,
      content,
      totalWidth,
      lineNumberWidth,
    );
    lines.push(prefixLine(line, leadingSpaces));
  });

  // 4. Line Number End Separator
  const endLine = generateLineNumberEnd(totalWidth, lineNumberWidth);
  lines.push(prefixLine(endLine, leadingSpaces));

  // 5. Bottom Border
  const bottomLine = generateBottomBorder(totalWidth);
  lines.push(prefixLine(bottomLine, leadingSpaces));

  return lines;
}
