/**
 * Renders a message component based on the type and content of the provided message object.
 * It handles various message types including progress, table data, file listings, and standard messages.
 * 
 * @param {Object} message - The message object containing data to be rendered.
 * @param {Function} onExecuteCommand - Callback function to execute commands related to the message.
 * @returns {JSX.Element} The appropriate message component based on the message type.
 * @throws {Error} Throws an error if the message object is invalid or missing required properties.
 */

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import MessageRenderer from "../../MessageRenderer";

// Mocking nested components
jest.mock("../../UI", () => ({
  Glitch: jest.fn(() => <div>Glitch Component</div>),
  TypeWriter: jest.fn(() => <div>TypeWriter Component</div>),
}));

jest.mock("../ProgressIndicator", () =>
  jest.fn(() => <div>ProgressIndicator Component</div>),
);
jest.mock("../TableRenderer", () =>
  jest.fn(() => <div>TableRenderer Component</div>),
);

// Main describe block for MessageRenderer tests
describe("MessageRenderer() MessageRenderer method", () => {
  // Happy path tests
  describe("Happy Paths", () => {
    it("renders ProgressMessage when message has progress", () => {
      const message = { progress: true, type: "info" };
      render(<MessageRenderer message={message} />);
      expect(
        screen.getByText("ProgressIndicator Component"),
      ).toBeInTheDocument();
    });

    it("renders TableMessage when message has tableData", () => {
      const message = { tableData: { headers: [], rows: [] }, type: "info" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("TableRenderer Component")).toBeInTheDocument();
    });

    it("renders FileListingMessage when message has files", () => {
      const message = { files: ["file1.txt"], type: "info" };
      render(<MessageRenderer message={message} />);
      expect(
        screen.getByText("FileListingMessage Component"),
      ).toBeInTheDocument();
    });

    it("renders ErrorMessage for error type", () => {
      const message = { type: "error" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("ErrorMessage Component")).toBeInTheDocument();
    });

    it("renders SuccessMessage for success type", () => {
      const message = { type: "success" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("SuccessMessage Component")).toBeInTheDocument();
    });

    it("renders WarningMessage for warning type", () => {
      const message = { type: "warning" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("WarningMessage Component")).toBeInTheDocument();
    });

    it("renders InfoMessage for info type", () => {
      const message = { type: "info" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("InfoMessage Component")).toBeInTheDocument();
    });

    it("renders CommandMessage for command type", () => {
      const message = { type: "command" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("CommandMessage Component")).toBeInTheDocument();
    });

    it("renders DefaultMessage for unknown type", () => {
      const message = { type: "unknown" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });
  });

  // Edge case tests
  describe("Edge Cases", () => {
    it("renders DefaultMessage when message type is undefined", () => {
      const message = {};
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });

    it("handles empty files array gracefully", () => {
      const message = { files: [], type: "info" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });

    it("handles missing tableData gracefully", () => {
      const message = { type: "info" };
      render(<MessageRenderer message={message} />);
      expect(screen.getByText("DefaultMessage Component")).toBeInTheDocument();
    });
  });
});
