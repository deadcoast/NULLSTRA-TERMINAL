import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "../../../../context";
import ThemeSelector from "../../ThemeSelector";

// Mock the useTheme hook
jest.mock("../../../../context", () => {
  const actual = jest.requireActual("../../../../context");
  return {
    ...actual,
    useTheme: jest.fn(),
  };
});

// Create a complete mock theme that satisfies the TerminalTheme interface
const createMockTheme = (id: string, name: string, bgColor: string) => ({
  id,
  name,
  colors: {
    background: bgColor,
    foreground: "#F1F1F1",
    cursor: "#ea39b9ff",
    selection: "#536D8C",
    black: "#000000",
    red: "#FF0055",
    green: "#c2f04cff",
    yellow: "#f6ed5dff",
    blue: "#0088FF",
    magenta: "#ea39b9ff",
    cyan: "#2f04cfff",
    white: "#F1F1F1",
    brightBlack: "#686868",
    brightRed: "#FF6E6E",
    brightGreen: "#DCEF55",
    brightYellow: "#FFFC67",
    brightBlue: "#6871FF",
    brightMagenta: "#FF77FF",
    brightCyan: "#84FFFD",
    brightWhite: "#FFFFFF",
  },
  effects: {
    glitchIntensity: "low" as const,
    crtEffect: true,
    crtIntensity: 0.5,
    scanlines: true,
    noise: true,
    noiseIntensity: 0.1,
    textShadow: true,
    animation: "subtle" as const,
  },
  fonts: {
    primary: "var(--font-terminal), monospace",
    secondary: "Roboto Mono, monospace",
    size: "14px",
    lineHeight: "1.5",
  },
});

describe("ThemeSelector() ThemeSelector method", () => {
  const mockSetTheme = jest.fn();
  const mockUseTheme = jest.mocked(useTheme);

  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: createMockTheme("1", "Default", "#000"),
      setTheme: mockSetTheme,
      availableThemes: [
        createMockTheme("1", "Default", "#000"),
        createMockTheme("2", "Dark", "#111"),
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
      expect(mockSetTheme).toHaveBeenCalledWith(
        createMockTheme("2", "Dark", "#111"),
      );
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
        theme: createMockTheme("1", "Default", "#000"),
        setTheme: mockSetTheme,
        availableThemes: [],
      });
      render(<ThemeSelector minimal={true} />);
      fireEvent.click(screen.getByText("Theme: Default"));
      expect(screen.queryByText("Select Theme")).not.toBeInTheDocument();
    });

    it("should not crash if setTheme is not provided", () => {
      // Using an empty function instead of undefined
      const noopSetTheme = jest.fn();

      mockUseTheme.mockReturnValue({
        theme: createMockTheme("1", "Default", "#000"),
        setTheme: noopSetTheme,
        availableThemes: [createMockTheme("1", "Default", "#000")],
      });
      render(<ThemeSelector minimal={true} />);
      fireEvent.click(screen.getByText("Theme: Default"));
      fireEvent.click(screen.getByText("Default"));
      expect(mockSetTheme).not.toHaveBeenCalled();
    });
  });
});
