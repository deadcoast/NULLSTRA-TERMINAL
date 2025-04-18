/**
 * 1. Allow customizable intensity levels for more control over the glitch effect.
2. Implement a toggle for enabling/disabling the glitch effect dynamically.
 * 3. Add support for different glitch styles (e.g., color shift, distortion) to enhance visual variety.
 * 4. Implement error handling to manage invalid data inputs gracefully.
 * 5. Add customizable styles for table borders and text to enhance visual appeal.
 * 6. Optimize the `getColumnWidths` function for performance with large datasets.
 */
import * as React from "react";

import { Glitch } from "../UI";

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableRendererProps {
  data: TableData;
  title?: string;
  glitchEffect?: boolean;
}

const TableRenderer: React.FC<TableRendererProps> = ({
  data,
  title,
  glitchEffect = false,
}) => {
  // Calculate column widths based on content
  const columnWidths = getColumnWidths(data);

  // Create the table border characters
  const tableChars = {
    topLeft: "┌",
    topRight: "┐",
    bottomLeft: "└",
    bottomRight: "┘",
    horizontal: "─",
    vertical: "│",
    leftT: "├",
    rightT: "┤",
    topT: "┬",
    bottomT: "┴",
    cross: "┼",
  };

  // Generate the top border
  const topBorder = generateBorder(
    columnWidths,
    tableChars.topLeft,
    tableChars.topRight,
    tableChars.topT,
    tableChars.horizontal,
  );

  // Generate the header separator
  const headerSeparator = generateBorder(
    columnWidths,
    tableChars.leftT,
    tableChars.rightT,
    tableChars.cross,
    tableChars.horizontal,
  );

  // Generate the bottom border
  const bottomBorder = generateBorder(
    columnWidths,
    tableChars.bottomLeft,
    tableChars.bottomRight,
    tableChars.bottomT,
    tableChars.horizontal,
  );

  return (
    <div className="terminal-table my-2 text-terminal-white font-mono">
      {title && (
        <div className="mb-1">
          {glitchEffect ? (
            <Glitch intensity="low">
              <span className="text-terminal-cyan font-bold">{title}</span>
            </Glitch>
          ) : (
            <span className="text-terminal-cyan font-bold">{title}</span>
          )}
        </div>
      )}

      {/* Table Top Border */}
      <div className="text-terminal-cyan">{topBorder}</div>

      {/* Table Headers */}
      <div className="text-terminal-yellow">
        {tableChars.vertical}{" "}
        {data.headers
          .map((header, index) => {
            return header.padEnd(columnWidths[index] - 2);
          })
          .join(` ${tableChars.vertical} `)}{" "}
        {tableChars.vertical}
      </div>

      {/* Header Separator */}
      <div className="text-terminal-cyan">{headerSeparator}</div>

      {/* Table Rows */}
      {data.rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={
            rowIndex % 2 === 0
              ? "text-terminal-white"
              : "text-terminal-white opacity-80"
          }
        >
          {tableChars.vertical}{" "}
          {row
            .map((cell, cellIndex) => {
              return cell.padEnd(columnWidths[cellIndex] - 2);
            })
            .join(` ${tableChars.vertical} `)}{" "}
          {tableChars.vertical}
        </div>
      ))}

      {/* Table Bottom Border */}
      <div className="text-terminal-cyan">{bottomBorder}</div>
    </div>
  );
};

// Helper function to calculate the width needed for each column
const getColumnWidths = (data: TableData): number[] => {
  const widths: number[] = [];

  // Check header widths
  data.headers.forEach((header, index) => {
    widths[index] = header.length + 2; // Add padding
  });

  // Check row data widths
  data.rows.forEach((row) => {
    row.forEach((cell, index) => {
      const cellWidth = cell.length + 2; // Add padding
      if (!widths[index] || cellWidth > widths[index]) {
        widths[index] = cellWidth;
      }
    });
  });

  return widths;
};

// Helper function to generate table borders
const generateBorder = (
  widths: number[],
  leftChar: string,
  rightChar: string,
  joinChar: string,
  horizontalChar: string,
): string => {
  // Generate segments for each column
  const segments = widths.map((width) => horizontalChar.repeat(width));

  // Join segments with the join character
  return leftChar + segments.join(joinChar) + rightChar;
};

export default TableRenderer;
