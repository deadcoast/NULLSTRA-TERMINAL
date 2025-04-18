import * as React from "react";
const {   useEffect, useState   } = React;

interface ThemeType {
  name: string;
  description: string;
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  selection: string;
  cursor: string;
  border: string;
  panelBackground: string;
  panelForeground: string;
  buttonBackground: string;
  buttonForeground: string;
  isDark?: boolean;
}

interface HighContrastThemeProps {
  onApply: (theme: ThemeType) => void;
  onCancel: () => void;
  baseTheme: ThemeType;
}

// Function to calculate color contrast ratio
const getContrastRatio = (color1: string, color2: string): number => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Calculate relative luminance
  const getLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map((value) => {
      value /= 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  const luminance1 = getLuminance(rgb1);
  const luminance2 = getLuminance(rgb2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
};

// Function to darken or lighten a color
const adjustColor = (color: string, amount: number): string => {
  const hexToRgb = (hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  const rgbToHex = (rgb: number[]): string => {
    return (
      "#" +
      rgb
        .map((v) => {
          const hex = Math.min(255, Math.max(0, Math.round(v))).toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const rgb = hexToRgb(color);
  const adjustedRgb = rgb.map((value) => value + amount);
  return rgbToHex(adjustedRgb);
};

const HighContrastTheme: React.FC<HighContrastThemeProps> = ({
  onApply,
  onCancel,
  baseTheme,
}) => {
  const [theme, setTheme] = useState<ThemeType>({
    ...baseTheme,
    name: "High Contrast Theme",
    description: "A custom high contrast theme",
  });
  const [contrastScore, setContrastScore] = useState<number>(0);

  // Update contrast score when theme changes
  useEffect(() => {
    const mainContrast = getContrastRatio(theme.background, theme.foreground);
    setContrastScore(mainContrast);
  }, [theme]);

  const handleColorChange = (property: keyof ThemeType, value: string) => {
    setTheme((prev) => ({
      ...prev,
      [property]: value,
    }));
  };

  const applyPreset = (
    preset: "blackOnWhite" | "whiteOnBlack" | "yellowOnBlack" | "blueOnWhite",
  ) => {
    switch (preset) {
      case "blackOnWhite":
        setTheme((prev) => ({
          ...prev,
          background: "#FFFFFF",
          foreground: "#000000",
          primary: "#0000CC",
          secondary: "#006600",
          accent: "#CC0000",
          panelBackground: "#F0F0F0",
          panelForeground: "#000000",
          buttonBackground: "#0000CC",
          buttonForeground: "#FFFFFF",
          isDark: false,
        }));
        break;
      case "whiteOnBlack":
        setTheme((prev) => ({
          ...prev,
          background: "#000000",
          foreground: "#FFFFFF",
          primary: "#66CCFF",
          secondary: "#66FF66",
          accent: "#FF6666",
          panelBackground: "#222222",
          panelForeground: "#FFFFFF",
          buttonBackground: "#66CCFF",
          buttonForeground: "#000000",
          isDark: true,
        }));
        break;
      case "yellowOnBlack":
        setTheme((prev) => ({
          ...prev,
          background: "#000000",
          foreground: "#FFFF00",
          primary: "#00FFFF",
          secondary: "#FF00FF",
          accent: "#00FF00",
          panelBackground: "#222222",
          panelForeground: "#FFFFFF",
          buttonBackground: "#00FFFF",
          buttonForeground: "#000000",
          isDark: true,
        }));
        break;
      case "blueOnWhite":
        setTheme((prev) => ({
          ...prev,
          background: "#FFFFFF",
          foreground: "#00008B",
          primary: "#0000FF",
          secondary: "#8B0000",
          accent: "#006400",
          panelBackground: "#F0F0F0",
          panelForeground: "#000000",
          buttonBackground: "#0000FF",
          buttonForeground: "#FFFFFF",
          isDark: false,
        }));
        break;
    }
  };

  const getScoreClass = () => {
    if (contrastScore >= 7) return "score-good";
    if (contrastScore >= 4.5) return "score-medium";
    return "score-poor";
  };

  return (
    <div className="theme-creator">
      <h2>Create High Contrast Theme</h2>

      <div className="presets">
        <button
          className="preset-button"
          onClick={() => applyPreset("blackOnWhite")}
        >
          Black on White
        </button>
        <button
          className="preset-button"
          onClick={() => applyPreset("whiteOnBlack")}
        >
          White on Black
        </button>
        <button
          className="preset-button"
          onClick={() => applyPreset("yellowOnBlack")}
        >
          Yellow on Black
        </button>
        <button
          className="preset-button"
          onClick={() => applyPreset("blueOnWhite")}
        >
          Blue on White
        </button>
      </div>

      <div className="contrast-score">
        <span>Contrast Ratio:</span>
        <span className={`score-value ${getScoreClass()}`}>
          {contrastScore.toFixed(2)}
          {contrastScore >= 7
            ? " (Excellent)"
            : contrastScore >= 4.5
            ? " (Good)"
            : " (Poor)"}
        </span>
      </div>

      <div className="color-inputs">
        <div className="color-input-group">
          <label htmlFor="background">Background</label>
          <input
            type="color"
            id="background"
            value={theme.background}
            onChange={(e) => handleColorChange("background", e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label htmlFor="foreground">Foreground</label>
          <input
            type="color"
            id="foreground"
            value={theme.foreground}
            onChange={(e) => handleColorChange("foreground", e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label htmlFor="primary">Primary</label>
          <input
            type="color"
            id="primary"
            value={theme.primary}
            onChange={(e) => handleColorChange("primary", e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label htmlFor="secondary">Secondary</label>
          <input
            type="color"
            id="secondary"
            value={theme.secondary}
            onChange={(e) => handleColorChange("secondary", e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label htmlFor="accent">Accent</label>
          <input
            type="color"
            id="accent"
            value={theme.accent}
            onChange={(e) => handleColorChange("accent", e.target.value)}
          />
        </div>

        <div className="color-input-group">
          <label htmlFor="panelBackground">Panel Background</label>
          <input
            type="color"
            id="panelBackground"
            value={theme.panelBackground}
            onChange={(e) =>
              handleColorChange("panelBackground", e.target.value)
            }
          />
        </div>
      </div>

      <div className="action-buttons">
        <button className="cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="apply-button"
          onClick={() => onApply(theme)}
          disabled={contrastScore < 4.5}
        >
          Apply Theme
        </button>
      </div>
    </div>
  );
};

export default HighContrastTheme;
export type { ThemeType };
