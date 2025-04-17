import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "../../../../context";
import ThemeSelector from "../../ThemeSelector";

// Mock the useTheme hook
jest.mock("../../../context", () => {
  const actual = jest.requireActual("../../../context");
  return {
    ...actual,
    useTheme: jest.fn(),
  };
});

describe("ThemeSelector() ThemeSelector method", () => {
  const mockSetTheme = jest.fn();
  const mockUseTheme = jest.mocked(useTheme);

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: {
        id: "1",
        name: "Default",
        colors: {
          background: "#000",
          cyan: "#0ff",
          green: "#0f0",
          magenta: "#f0f",
        },
      },
      setTheme: mockSetTheme,
      availableThemes: [
        {
          id: "1",
          name: "Default",
          colors: {
            background: "#000",
            cyan: "#0ff",
            green: "#0f0",
            magenta: "#f0f",
          },
        },
        {
          id: "2",
          name: "Dark",
          colors: {
            background: "#111",
            cyan: "#0ee",
            green: "#0e0",
            magenta: "#e0e",
          },
        },
      ],
    });
  });

  describe("Happy Paths", () => {
    it("should render the minimal theme selector with the current theme name", () => {
      render(<ThemeSelector minimal={true} />);
      expect(screen.getByText("Theme: Default")).toBeInTheDocument();
    });

    it("should open the theme selection dropdown when the button is clicked", () => {
      render(<ThemeSelector minimal={true} />);
      fireEvent.click(screen.getByText("Theme: Default"));
      expect(screen.getByText("Select Theme")).toBeInTheDocument();
    });

    it("should change the theme when a new theme is selected", () => {
      render(<ThemeSelector minimal={true} />);
      fireEvent.click(screen.getByText("Theme: Default"));
      fireEvent.click(screen.getByText("Dark"));
      expect(mockSetTheme).toHaveBeenCalledWith({
        id: "2",
        name: "Dark",
        colors: {
          background: "#111",
          cyan: "#0ee",
          green: "#0e0",
          magenta: "#e0e",
        },
      });
    });

    it("should render the full theme selector with all available themes", () => {
      render(<ThemeSelector minimal={false} />);
      expect(screen.getByText("Terminal Theme")).toBeInTheDocument();
      expect(screen.getByText("Default")).toBeInTheDocument();
      expect(screen.getByText("Dark")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle no available themes gracefully", () => {
      mockUseTheme.mockReturnValue({
        theme: {
          id: "1",
          name: "Default",
          colors: {
            background: "#000",
            cyan: "#0ff",
            green: "#0f0",
            magenta: "#f0f",
          },
        },
        setTheme: mockSetTheme,
        availableThemes: [],
      });
      render(<ThemeSelector minimal={true} />);
      fireEvent.click(screen.getByText("Theme: Default"));
      expect(screen.queryByText("Select Theme")).not.toBeInTheDocument();
    });

    it("should not crash if setTheme is not provided", () => {
      mockUseTheme.mockReturnValue({
        theme: {
          id: "1",
          name: "Default",
          colors: {
            background: "#000",
            cyan: "#0ff",
            green: "#0f0",
            magenta: "#f0f",
          },
        },
        setTheme: undefined,
        availableThemes: [
          {
            id: "1",
            name: "Default",
            colors: {
              background: "#000",
              cyan: "#0ff",
              green: "#0f0",
              magenta: "#f0f",
            },
          },
        ],
      });
      render(<ThemeSelector minimal={true} />);
      fireEvent.click(screen.getByText("Theme: Default"));
      fireEvent.click(screen.getByText("Default"));
      expect(mockSetTheme).not.toHaveBeenCalled();
    });
  });
});
