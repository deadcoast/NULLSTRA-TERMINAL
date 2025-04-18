import * as React from "react";
const {   useEffect, useState   } = React;
import { ThemeType } from "../../types/theme";

interface HighContrastThemeProps {
  onApply: (theme: ThemeType) => void;
  onCancel: () => void;
}

const HighContrastTheme: React.FC<HighContrastThemeProps> = ({
  onApply,
  onCancel,
}) => {
  const [foregroundColor, setForegroundColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [contrastRatio, setContrastRatio] = useState(21);

  // Calculate contrast ratio between two colors
  const calculateContrastRatio = (fg: string, bg: string): number => {
    // Convert hex to RGB
    const hexToRgb = (hex: string): number[] => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // Calculate relative luminance
    const getLuminance = (rgb: number[]): number => {
      const [r, g, b] = rgb.map((c) => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const rgbFg = hexToRgb(fg);
    const rgbBg = hexToRgb(bg);

    const luminanceFg = getLuminance(rgbFg);
    const luminanceBg = getLuminance(rgbBg);

    const brighter = Math.max(luminanceFg, luminanceBg);
    const darker = Math.min(luminanceFg, luminanceBg);

    return (brighter + 0.05) / (darker + 0.05);
  };

  // Update contrast ratio when colors change
  useEffect(() => {
    setContrastRatio(calculateContrastRatio(foregroundColor, backgroundColor));
  }, [foregroundColor, backgroundColor]);

  // Create the theme object
  const createTheme = (): ThemeType => {
    return {
      name: "High Contrast",
      description: "Accessibility-focused high contrast theme",
      background: backgroundColor,
      foreground: foregroundColor,
      primary: foregroundColor,
      secondary: foregroundColor,
      accent: foregroundColor,
      error: "#FF0000",
      success: "#00FF00",
      warning: "#FFFF00",
      info: foregroundColor,
      selection: foregroundColor,
      cursor: foregroundColor,
      border: foregroundColor,
      panelBackground: backgroundColor,
      panelForeground: foregroundColor,
      buttonBackground: foregroundColor,
      buttonForeground: backgroundColor,
      isDark: backgroundColor.toLowerCase() !== "#ffffff",
    };
  };

  // Handle apply button click
  const handleApply = () => {
    onApply(createTheme());
  };

  return (
    <div className="high-contrast-theme-creator">
      <h2>High Contrast Theme Creator</h2>

      <div
        className="contrast-preview"
        style={{
          backgroundColor: backgroundColor,
          color: foregroundColor,
          padding: "20px",
          borderRadius: "4px",
          marginBottom: "20px",
        }}
      >
        <p>
          This is a preview text. The contrast ratio is:{" "}
          {contrastRatio.toFixed(2)}
        </p>
        {contrastRatio < 4.5 && (
          <p style={{ color: "#FF0000" }}>
            Warning: Contrast ratio is too low for accessibility standards (WCAG
            2.0). Minimum recommended is 4.5:1 for normal text.
          </p>
        )}
      </div>

      <div className="theme-controls">
        <div className="control-group">
          <label htmlFor="background-color">Background Color:</label>
          <input
            id="background-color"
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
          <input
            type="text"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label htmlFor="foreground-color">Foreground Color:</label>
          <input
            id="foreground-color"
            type="color"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
          />
          <input
            type="text"
            value={foregroundColor}
            onChange={(e) => setForegroundColor(e.target.value)}
          />
        </div>

        <div className="contrast-score">
          <span>Contrast Score: </span>
          <span
            className={
              contrastRatio >= 7
                ? "excellent"
                : contrastRatio >= 4.5
                ? "good"
                : "poor"
            }
          >
            {contrastRatio >= 7
              ? "Excellent"
              : contrastRatio >= 4.5
              ? "Good"
              : "Poor"}
            ({contrastRatio.toFixed(2)}:1)
          </span>
        </div>

        <div className="preset-buttons">
          <button
            onClick={() => {
              setBackgroundColor("#000000");
              setForegroundColor("#FFFFFF");
            }}
          >
            Black on White
          </button>
          <button
            onClick={() => {
              setBackgroundColor("#FFFFFF");
              setForegroundColor("#000000");
            }}
          >
            White on Black
          </button>
          <button
            onClick={() => {
              setBackgroundColor("#000000");
              setForegroundColor("#FFFF00");
            }}
          >
            Yellow on Black
          </button>
        </div>
      </div>

      <div className="theme-actions">
        <button onClick={handleApply}>Apply Theme</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default HighContrastTheme;
