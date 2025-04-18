import React, { createContext, useContext, useEffect, useState } from "react";

export interface TerminalTheme {
  id: string;
  name: string;
  description?: string;
  colors: {
    background: string;
    foreground: string;
    cursor: string;
    selection: string;
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    brightBlack: string;
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;
  };
  effects: {
    glitchIntensity: "none" | "low" | "medium" | "high";
    crtEffect: boolean;
    crtIntensity: number; // 0-1
    scanlines: boolean;
    noise: boolean;
    noiseIntensity: number; // 0-1
    textShadow: boolean;
    animation: "none" | "subtle" | "normal" | "intense";
  };
  fonts: {
    primary: string;
    secondary?: string;
    size: string;
    lineHeight: string;
  };
}

// Define some preset themes
export const terminalThemes: Record<string, TerminalTheme> = {
  cyberpunk: {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Neon-inspired cyberpunk theme with vibrant colors",
    colors: {
      background: "#0b0b0cff", // night
      foreground: "#F1F1F1",
      cursor: "#ea39b9ff", // shocking-pink
      selection: "#536D8C",
      black: "#000000",
      red: "#FF0055",
      green: "#c2f04cff", // lime
      yellow: "#f6ed5dff", // maize
      blue: "#0088FF",
      magenta: "#ea39b9ff", // shocking-pink
      cyan: "#2f04cfff", // chrysler-blue
      white: "#F1F1F1",
      brightBlack: "#686868",
      brightRed: "#FF6E6E",
      brightGreen: "#DCEF55", // brighter lime
      brightYellow: "#FFFC67",
      brightBlue: "#6871FF",
      brightMagenta: "#FF77FF",
      brightCyan: "#84FFFD",
      brightWhite: "#FFFFFF",
    },
    effects: {
      glitchIntensity: "medium",
      crtEffect: true,
      crtIntensity: 0.4,
      scanlines: true,
      noise: true,
      noiseIntensity: 0.1,
      textShadow: true,
      animation: "normal",
    },
    fonts: {
      primary: "var(--font-terminal), Fira Code, monospace",
      secondary: "Roboto Mono, monospace",
      size: "14px",
      lineHeight: "1.5",
    },
  },
  hacker: {
    id: "hacker",
    name: "Hacker",
    description: "Classic hacker-style green-on-black theme",
    colors: {
      background: "#0C0C0C",
      foreground: "#00FF00",
      cursor: "#FFFFFF",
      selection: "#1A3A1A",
      black: "#000000",
      red: "#CC0000",
      green: "#00CC00",
      yellow: "#CCCC00",
      blue: "#0000CC",
      magenta: "#CC00CC",
      cyan: "#00CCCC",
      white: "#CCCCCC",
      brightBlack: "#555555",
      brightRed: "#FF0000",
      brightGreen: "#00FF00",
      brightYellow: "#FFFF00",
      brightBlue: "#0000FF",
      brightMagenta: "#FF00FF",
      brightCyan: "#00FFFF",
      brightWhite: "#FFFFFF",
    },
    effects: {
      glitchIntensity: "low",
      crtEffect: true,
      crtIntensity: 0.5,
      scanlines: true,
      noise: true,
      noiseIntensity: 0.05,
      textShadow: true,
      animation: "subtle",
    },
    fonts: {
      primary: "Source Code Pro, monospace",
      secondary: "Courier New, monospace",
      size: "14px",
      lineHeight: "1.5",
    },
  },
  midnight: {
    id: "midnight",
    name: "Midnight",
    description: "Sleek dark blue theme with subtle accents",
    colors: {
      background: "#0F1729",
      foreground: "#D0D0D0",
      cursor: "#5BA2FF",
      selection: "#253457",
      black: "#000000",
      red: "#FF4059",
      green: "#59FF99",
      yellow: "#FFDA59",
      blue: "#5BA2FF",
      magenta: "#FF59F0",
      cyan: "#59FFFC",
      white: "#D0D0D0",
      brightBlack: "#505050",
      brightRed: "#FF7B8C",
      brightGreen: "#8CFFBB",
      brightYellow: "#FFE68C",
      brightBlue: "#8CBFFF",
      brightMagenta: "#FF8CF7",
      brightCyan: "#8CFFFD",
      brightWhite: "#FFFFFF",
    },
    effects: {
      glitchIntensity: "none",
      crtEffect: false,
      crtIntensity: 0.2,
      scanlines: false,
      noise: false,
      noiseIntensity: 0,
      textShadow: true,
      animation: "subtle",
    },
    fonts: {
      primary: "JetBrains Mono, monospace",
      secondary: "Consolas, monospace",
      size: "14px",
      lineHeight: "1.6",
    },
  },
  retro: {
    id: "retro",
    name: "Retro",
    description: "Amber terminal with vintage effects",
    colors: {
      background: "#1C1005",
      foreground: "#FFB000",
      cursor: "#FFFFFF",
      selection: "#6B4D0C",
      black: "#000000",
      red: "#AB3600",
      green: "#90FF00",
      yellow: "#FFB000",
      blue: "#0054FF",
      magenta: "#AE00FF",
      cyan: "#00A1FF",
      white: "#FFC896",
      brightBlack: "#685A42",
      brightRed: "#FF5D00",
      brightGreen: "#B6FF00",
      brightYellow: "#FFCC00",
      brightBlue: "#0088FF",
      brightMagenta: "#D400FF",
      brightCyan: "#00CCFF",
      brightWhite: "#FFFFFF",
    },
    effects: {
      glitchIntensity: "low",
      crtEffect: true,
      crtIntensity: 0.7,
      scanlines: true,
      noise: true,
      noiseIntensity: 0.2,
      textShadow: true,
      animation: "normal",
    },
    fonts: {
      primary: "VT323, monospace",
      secondary: "Px437 IBM VGA8, monospace",
      size: "16px",
      lineHeight: "1.4",
    },
  },
  nullstra: {
    id: "nullstra",
    name: "NULLSTRA",
    description: "Official NULLSTRA terminal theme with branded colors",
    colors: {
      background: "#0b0b0cff", // night
      foreground: "#c2f04cff", // lime
      cursor: "#ea39b9ff", // shocking-pink
      selection: "#2f04cf33", // chrysler-blue with alpha
      black: "#000000ff", // black
      red: "#FF0055",
      green: "#c2f04cff", // lime
      yellow: "#f6ed5dff", // maize
      blue: "#2f04cfff", // chrysler-blue
      magenta: "#ea39b9ff", // shocking-pink
      cyan: "#9cb7ceff", // powder-blue
      white: "#F1F1F1",
      brightBlack: "#222222",
      brightRed: "#FF6E6E",
      brightGreen: "#DCEF55", // brighter lime
      brightYellow: "#FFFC67",
      brightBlue: "#6871FF",
      brightMagenta: "#F969D2", // brighter shocking-pink
      brightCyan: "#BFD5E4", // brighter powder-blue
      brightWhite: "#FFFFFF",
    },
    effects: {
      glitchIntensity: "low",
      crtEffect: true,
      crtIntensity: 0.5,
      scanlines: true,
      noise: true,
      noiseIntensity: 0.05,
      textShadow: true,
      animation: "subtle",
    },
    fonts: {
      primary: "var(--font-terminal), monospace",
      secondary: "Consolas, monospace",
      size: "14px",
      lineHeight: "1.5",
    },
  },
};

// Create the context with the nullstra theme as default
interface ThemeContextType {
  theme: TerminalTheme;
  setTheme: (theme: TerminalTheme | string) => void;
  availableThemes: TerminalTheme[];
}

const ThemeContext = createContext<ThemeContextType>({
  theme: terminalThemes.nullstra,
  setTheme: () => {},
  availableThemes: Object.values(terminalThemes),
});

// Theme provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<TerminalTheme>(
    terminalThemes.nullstra,
  );
  const [availableThemes, _setAvailableThemes] = useState<TerminalTheme[]>(
    Object.values(terminalThemes),
  );

  // Function to change the theme
  const setTheme = (newTheme: TerminalTheme | string) => {
    if (typeof newTheme === "string") {
      // If a string ID is provided, find the corresponding theme
      const foundTheme = terminalThemes[newTheme];
      if (foundTheme) {
        setThemeState(foundTheme);
        localStorage.setItem("terminal-theme", newTheme);
      }
    } else {
      // If a theme object is provided, use it directly
      setThemeState(newTheme);
      localStorage.setItem("terminal-theme", newTheme.id);
    }
  };

  // Load the theme from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("terminal-theme");
    if (savedTheme && terminalThemes[savedTheme]) {
      setThemeState(terminalThemes[savedTheme]);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, availableThemes }}>
      <div className="theme-wrapper" style={{
        // Ensure critical theme values are directly applied to wrapper
        "--terminal-black": theme.colors.background,
        "--terminal-green": theme.colors.green,
        "--terminal-magenta": theme.colors.magenta,
        "--font-terminal": theme.fonts.primary,
      } as React.CSSProperties}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
