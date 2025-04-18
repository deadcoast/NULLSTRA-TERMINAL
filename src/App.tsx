import * as React from "react";
const {   useEffect, useState   } = React;
import "./App.css";
import HighContrastTheme from "./components/themes/HighContrastTheme";
import { ThemeType } from "./types/theme";

// Default themes
const darkTheme: ThemeType = {
  name: "Dark",
  description: "Default dark theme",
  background: "#1E1E1E",
  foreground: "#D4D4D4",
  primary: "#569CD6",
  secondary: "#9CDCFE",
  accent: "#C586C0",
  error: "#F44747",
  success: "#6A9955",
  warning: "#FFCC00",
  info: "#75BEFF",
  selection: "#264F78",
  cursor: "#AEAFAD",
  border: "#454545",
  panelBackground: "#252526",
  panelForeground: "#CCCCCC",
  buttonBackground: "#0E639C",
  buttonForeground: "#FFFFFF",
  isDark: true,
};

const lightTheme: ThemeType = {
  name: "Light",
  description: "Default light theme",
  background: "#FFFFFF",
  foreground: "#333333",
  primary: "#0066B8",
  secondary: "#007ACC",
  accent: "#8B008B",
  error: "#E51400",
  success: "#107C10",
  warning: "#A6000C",
  info: "#1976D2",
  selection: "#ADD6FF",
  cursor: "#000000",
  border: "#E0E0E0",
  panelBackground: "#F3F3F3",
  panelForeground: "#444444",
  buttonBackground: "#007ACC",
  buttonForeground: "#FFFFFF",
  isDark: false,
};

const App: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>(darkTheme);
  const [showThemeCreator, setShowThemeCreator] = useState<boolean>(false);

  // Apply theme to the application
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--bg-color",
      currentTheme.background,
    );
    document.documentElement.style.setProperty(
      "--fg-color",
      currentTheme.foreground,
    );
    document.documentElement.style.setProperty(
      "--primary-color",
      currentTheme.primary,
    );
    document.documentElement.style.setProperty(
      "--secondary-color",
      currentTheme.secondary,
    );
    document.documentElement.style.setProperty(
      "--accent-color",
      currentTheme.accent,
    );
    document.documentElement.style.setProperty(
      "--error-color",
      currentTheme.error,
    );
    document.documentElement.style.setProperty(
      "--success-color",
      currentTheme.success,
    );
    document.documentElement.style.setProperty(
      "--warning-color",
      currentTheme.warning,
    );
    document.documentElement.style.setProperty(
      "--info-color",
      currentTheme.info,
    );
    document.documentElement.style.setProperty(
      "--selection-color",
      currentTheme.selection,
    );
    document.documentElement.style.setProperty(
      "--cursor-color",
      currentTheme.cursor,
    );
    document.documentElement.style.setProperty(
      "--border-color",
      currentTheme.border,
    );
    document.documentElement.style.setProperty(
      "--panel-bg-color",
      currentTheme.panelBackground,
    );
    document.documentElement.style.setProperty(
      "--panel-fg-color",
      currentTheme.panelForeground,
    );
    document.documentElement.style.setProperty(
      "--btn-bg-color",
      currentTheme.buttonBackground,
    );
    document.documentElement.style.setProperty(
      "--btn-fg-color",
      currentTheme.buttonForeground,
    );
  }, [currentTheme]);

  const handleThemeChange = (theme: ThemeType) => {
    setCurrentTheme(theme);
    setShowThemeCreator(false);
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--fg-color)",
        minHeight: "100vh",
      }}
    >
      <header className="app-header">
        <h1>Terminal Theme Demo</h1>
        <div className="theme-switcher">
          <button onClick={() => setCurrentTheme(darkTheme)}>Dark Theme</button>
          <button onClick={() => setCurrentTheme(lightTheme)}>
            Light Theme
          </button>
          <button onClick={() => setShowThemeCreator(true)}>
            Create High Contrast Theme
          </button>
        </div>
      </header>

      <main className="app-content">
        {showThemeCreator ? (
          <HighContrastTheme
            onApply={handleThemeChange}
            onCancel={() => setShowThemeCreator(false)}
          />
        ) : (
          <div className="terminal-demo">
            <div className="terminal-header">
              <span>Terminal</span>
              <div className="terminal-controls">
                <span>□</span>
                <span>-</span>
                <span>×</span>
              </div>
            </div>
            <div className="terminal-content">
              <div className="command-line">
                <span className="prompt">user@terminal:~$</span> echo "Current
                theme: {currentTheme.name}"
              </div>
              <div className="command-output">
                Current theme: {currentTheme.name}
              </div>
              <div className="command-line">
                <span className="prompt">user@terminal:~$</span> ls -la
              </div>
              <div className="command-output">
                drwxr-xr-x 2 user group 4096 Nov 10 12:34 .<br />
                drwxr-xr-x 10 user group 4096 Nov 10 12:30 ..
                <br />
                -rw-r--r-- 1 user group 1234 Nov 10 12:32 .config
                <br />
                -rw-r--r-- 1 user group 5678 Nov 10 12:33 README.md
              </div>
              <div className="command-line">
                <span className="prompt">user@terminal:~$</span>{" "}
                <span className="cursor">|</span>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Current Theme: {currentTheme.name} - {currentTheme.description}
        </p>
      </footer>
    </div>
  );
};

export default App;
