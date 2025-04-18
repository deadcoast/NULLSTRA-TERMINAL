/**
 * Theme Manager Extension - Allows users to customize and switch between terminal themes
 */

import { Extension } from "../Extension";

export class ThemeManagerExtension extends Extension {
  constructor(terminal) {
    super(terminal);

    this.name = "theme-manager";
    this.description = "Manage and customize terminal themes";

    // Theme-related settings
    this.settings = {
      defaultTheme: "dark",
      customThemesFolder: "themes",
      enableTransitions: true,
      transitionSpeed: 300, // ms
    };

    // Theme registry with predefined themes
    this.themes = {
      dark: {
        name: "Dark",
        description: "Default dark theme",
        background: "#1E1E1E",
        foreground: "#D4D4D4",
        primary: "#569CD6",
        secondary: "#4EC9B0",
        accent: "#C586C0",
        error: "#F44747",
        success: "#6A9955",
        warning: "#CE9178",
        info: "#9CDCFE",
        selection: "#264F78",
        cursor: "#AEAFAD",
        border: "#444444",
        panelBackground: "#252526",
        panelForeground: "#CCCCCC",
        buttonBackground: "#0E639C",
        buttonForeground: "#FFFFFF",
        isDark: true,
      },
      light: {
        name: "Light",
        description: "Clean light theme",
        background: "#FFFFFF",
        foreground: "#000000",
        primary: "#0000FF",
        secondary: "#008000",
        accent: "#800080",
        error: "#FF0000",
        success: "#008000",
        warning: "#FFA500",
        info: "#0000FF",
        selection: "#ADD6FF",
        cursor: "#000000",
        border: "#D4D4D4",
        panelBackground: "#F3F3F3",
        panelForeground: "#333333",
        buttonBackground: "#007ACC",
        buttonForeground: "#FFFFFF",
        isDark: false,
      },
      retro: {
        name: "Retro",
        description: "Old-school terminal feel",
        background: "#000000",
        foreground: "#33FF33",
        primary: "#00FF00",
        secondary: "#00BBBB",
        accent: "#FFFF00",
        error: "#FF0000",
        success: "#00FF00",
        warning: "#FFFF00",
        info: "#0000FF",
        selection: "#005500",
        cursor: "#33FF33",
        border: "#33FF33",
        panelBackground: "#001100",
        panelForeground: "#33FF33",
        buttonBackground: "#003300",
        buttonForeground: "#33FF33",
        isDark: true,
      },
    };

    // Commands
    this.commands = [
      {
        name: "theme",
        description: "Manage terminal themes",
        usage: "theme [list|set|info|create|edit|delete|export|import]",
        callback: this.handleThemeCommand.bind(this),
      },
    ];

    // Active theme (default to settings.defaultTheme)
    this.activeTheme = null;

    // Custom themes loaded from storage
    this.customThemes = {};
  }

  // Initialize the extension
  async init() {
    // Load custom themes from storage
    await this.loadCustomThemes();

    // Apply the default theme
    const defaultTheme = this.settings.defaultTheme;
    if (
      defaultTheme &&
      (this.themes[defaultTheme] || this.customThemes[defaultTheme])
    ) {
      this.applyTheme(defaultTheme);
    } else {
      this.applyTheme("dark"); // Fallback to dark theme
    }

    this.terminal.log("Theme manager initialized");

    return true;
  }

  // Load custom themes from local storage
  async loadCustomThemes() {
    try {
      const stored = localStorage.getItem("terminal_custom_themes");
      if (stored) {
        this.customThemes = JSON.parse(stored);
        this.terminal.log(
          `Loaded ${Object.keys(this.customThemes).length} custom themes`,
        );
      }
    } catch (error) {
      this.terminal.log(
        `Error loading custom themes: ${error.message}`,
        "error",
      );
    }
  }

  // Save custom themes to local storage
  async saveCustomThemes() {
    try {
      localStorage.setItem(
        "terminal_custom_themes",
        JSON.stringify(this.customThemes),
      );
    } catch (error) {
      this.terminal.log(
        `Error saving custom themes: ${error.message}`,
        "error",
      );
    }
  }

  // Apply a theme
  applyTheme(themeName) {
    // Find theme in predefined or custom themes
    const theme = this.themes[themeName] || this.customThemes[themeName];

    if (!theme) {
      this.terminal.log(`Theme '${themeName}' not found`, "error");
      return false;
    }

    // Apply transition if enabled
    if (this.settings.enableTransitions) {
      document.documentElement.style.transition = `background-color ${this.settings.transitionSpeed}ms, color ${this.settings.transitionSpeed}ms`;
      setTimeout(() => {
        document.documentElement.style.transition = "";
      }, this.settings.transitionSpeed);
    }

    // Apply theme properties to CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      if (
        typeof value === "string" &&
        key !== "name" &&
        key !== "description"
      ) {
        document.documentElement.style.setProperty(`--theme-${key}`, value);
      }
    });

    // Set active theme
    this.activeTheme = themeName;

    // Update body class for light/dark mode
    if (theme.isDark) {
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    } else {
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }

    this.terminal.log(`Theme '${theme.name}' applied`);

    // Emit theme change event
    const event = new CustomEvent("themeChanged", {
      detail: { themeName, theme },
    });
    document.dispatchEvent(event);

    return true;
  }

  // Handle theme command
  handleThemeCommand(args, flags) {
    const subcommand = args[0] || "list";

    switch (subcommand) {
      case "list":
        return this.listThemes();
      case "set":
        return this.setTheme(args[1]);
      case "info":
        return this.showThemeInfo(args[1]);
      case "create":
        return this.createTheme(args[1]);
      case "edit":
        return this.editTheme(args[1]);
      case "delete":
        return this.deleteTheme(args[1]);
      case "export":
        return this.exportTheme(args[1]);
      case "import":
        return this.importTheme(args[1]);
      default:
        this.terminal.log(`Unknown subcommand: ${subcommand}`, "error");
        return false;
    }
  }

  // List all available themes
  listThemes() {
    const allThemes = {
      ...this.themes,
      ...this.customThemes,
    };

    this.terminal.log("Available themes:");

    // Get current theme for highlighting
    const currentTheme = this.activeTheme;

    // Display predefined themes first
    Object.entries(allThemes).forEach(([id, theme]) => {
      const isActive = id === currentTheme ? " [ACTIVE]" : "";
      const isCustom = Object.prototype.hasOwnProperty.call(
        this.customThemes,
        id,
      )
        ? " (custom)"
        : "";

      this.terminal.log(
        `- ${theme.name}${isActive}${isCustom}: ${theme.description || "No description"}`,
      );
    });

    return true;
  }

  // Set the active theme
  setTheme(themeName) {
    if (!themeName) {
      this.terminal.log("Please specify a theme name", "error");
      return false;
    }

    return this.applyTheme(themeName);
  }

  // Show detailed information about a theme
  showThemeInfo(themeName) {
    if (!themeName) {
      if (this.activeTheme) {
        themeName = this.activeTheme;
        this.terminal.log(`Showing info for current theme: ${themeName}`);
      } else {
        this.terminal.log("Please specify a theme name", "error");
        return false;
      }
    }

    const theme = this.themes[themeName] || this.customThemes[themeName];

    if (!theme) {
      this.terminal.log(`Theme '${themeName}' not found`, "error");
      return false;
    }

    this.terminal.log(`Theme: ${theme.name}`);
    this.terminal.log(`Description: ${theme.description || "No description"}`);
    this.terminal.log(`Dark mode: ${theme.isDark ? "Yes" : "No"}`);
    this.terminal.log("Colors:");

    // Show color properties with preview
    Object.entries(theme).forEach(([key, value]) => {
      if (
        typeof value === "string" &&
        key !== "name" &&
        key !== "description" &&
        key !== "isDark"
      ) {
        this.terminal.log(`  - ${key}: ${value}`);
      }
    });

    return true;
  }

  // Create a new custom theme
  createTheme(themeName) {
    if (!themeName) {
      this.terminal.log("Please specify a theme name", "error");
      return false;
    }

    // Check if theme already exists
    if (this.themes[themeName] || this.customThemes[themeName]) {
      this.terminal.log(`Theme '${themeName}' already exists`, "error");
      return false;
    }

    // Create an editor interface for the theme
    this.terminal.log(`Creating new theme: ${themeName}`);

    // Start with a copy of the current theme as a base
    const baseTheme = this.activeTheme
      ? this.themes[this.activeTheme] || this.customThemes[this.activeTheme]
      : this.themes["dark"];

    // Create a new theme object
    const newTheme = {
      ...JSON.parse(JSON.stringify(baseTheme)),
      name: themeName,
      description: `Custom theme based on ${baseTheme.name}`,
    };

    // Add to custom themes
    this.customThemes[themeName] = newTheme;

    // Save to storage
    this.saveCustomThemes();

    this.terminal.log(
      `Theme '${themeName}' created! Use 'theme edit ${themeName}' to customize it.`,
    );

    return true;
  }

  // Edit an existing theme
  editTheme(themeName) {
    if (!themeName) {
      this.terminal.log("Please specify a theme name", "error");
      return false;
    }

    // Only allow editing custom themes
    if (!this.customThemes[themeName]) {
      if (this.themes[themeName]) {
        this.terminal.log(
          `Cannot edit built-in theme '${themeName}'. Create a copy first.`,
          "error",
        );
        return false;
      } else {
        this.terminal.log(`Theme '${themeName}' not found`, "error");
        return false;
      }
    }

    this.terminal.log(`Editing theme: ${themeName}`);

    // TODO: Implement proper theme editor UI
    // For now, just show the current values
    this.showThemeInfo(themeName);

    return true;
  }

  // Delete a custom theme
  deleteTheme(themeName) {
    if (!themeName) {
      this.terminal.log("Please specify a theme name", "error");
      return false;
    }

    // Only allow deleting custom themes
    if (!this.customThemes[themeName]) {
      if (this.themes[themeName]) {
        this.terminal.log(
          `Cannot delete built-in theme '${themeName}'`,
          "error",
        );
        return false;
      } else {
        this.terminal.log(`Theme '${themeName}' not found`, "error");
        return false;
      }
    }

    // Check if trying to delete active theme
    if (this.activeTheme === themeName) {
      this.terminal.log(
        `Cannot delete active theme. Switch to another theme first.`,
        "error",
      );
      return false;
    }

    // Delete the theme
    delete this.customThemes[themeName];

    // Save to storage
    this.saveCustomThemes();

    this.terminal.log(`Theme '${themeName}' deleted`);

    return true;
  }

  // Export a theme to JSON
  exportTheme(themeName) {
    if (!themeName) {
      this.terminal.log("Please specify a theme name", "error");
      return false;
    }

    const theme = this.themes[themeName] || this.customThemes[themeName];

    if (!theme) {
      this.terminal.log(`Theme '${themeName}' not found`, "error");
      return false;
    }

    const themeJSON = JSON.stringify(theme, null, 2);

    // In a real implementation, this would open a save dialog
    // For this example, we'll output to the terminal
    this.terminal.log("Theme export:");
    this.terminal.log(themeJSON);

    return true;
  }

  // Import a theme from JSON
  importTheme(themeJSON) {
    if (!themeJSON) {
      this.terminal.log("Please provide theme JSON data", "error");
      return false;
    }

    try {
      const themeData = JSON.parse(themeJSON);

      // Validate theme data
      if (!themeData.name) {
        this.terminal.log("Invalid theme data: missing name property", "error");
        return false;
      }

      // Add to custom themes
      this.customThemes[themeData.name.toLowerCase()] = themeData;

      // Save to storage
      this.saveCustomThemes();

      this.terminal.log(`Theme '${themeData.name}' imported successfully`);

      return true;
    } catch (error) {
      this.terminal.log(`Error importing theme: ${error.message}`, "error");
      return false;
    }
  }
}
