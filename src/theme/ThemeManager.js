/**
 * Terminal Theme Manager - Provides comprehensive theme management for MidaTerminal
 */

class ThemeManager {
  constructor() {
    this.themes = {};
    this.activeTheme = null;
    this.defaultTheme = {
      id: "default",
      name: "Default",
      author: "MidaTerminal",
      version: "1.0.0",
      description: "Default terminal theme",
      variables: {
        // Colors
        "background-color": "#1E1E1E",
        "foreground-color": "#FFFFFF",
        "cursor-color": "#FFFFFF",
        "selection-color": "rgba(255, 255, 255, 0.3)",
        black: "#000000",
        red: "#E74C3C",
        green: "#2ECC71",
        yellow: "#F1C40F",
        blue: "#3498DB",
        magenta: "#9B59B6",
        cyan: "#1ABC9C",
        white: "#ECEFF1",
        "bright-black": "#7F8C8D",
        "bright-red": "#FF5252",
        "bright-green": "#5CF19E",
        "bright-yellow": "#FFD740",
        "bright-blue": "#40C4FF",
        "bright-magenta": "#CE93D8",
        "bright-cyan": "#80DEEA",
        "bright-white": "#FFFFFF",

        // Typography
        "font-family": 'Menlo, Monaco, "Courier New", monospace',
        "font-size": "14px",
        "font-weight": "normal",
        "line-height": "1.5",

        // UI Elements
        "prompt-color": "#3498DB",
        "command-color": "#FFFFFF",
        "error-color": "#E74C3C",
        "success-color": "#2ECC71",
        "info-color": "#3498DB",
        "warning-color": "#F39C12",

        // Padding & Spacing
        padding: "12px",
        "prompt-padding": "5px",
        "border-radius": "4px",

        // Scrollbar
        "scrollbar-width": "10px",
        "scrollbar-track-color": "rgba(0, 0, 0, 0.1)",
        "scrollbar-thumb-color": "rgba(255, 255, 255, 0.2)",

        // Effects
        "text-shadow": "none",
        "cursor-blink-rate": "1.2s",
        "transition-speed": "0.2s",
      },
    };

    this.initialize();
  }

  /**
   * Initialize theme system
   */
  initialize() {
    // Register default theme
    this.registerTheme(this.defaultTheme);

    // Load dark theme
    const darkTheme = {
      id: "dark",
      name: "Dark",
      author: "MidaTerminal",
      version: "1.0.0",
      description: "Dark terminal theme",
      variables: {
        ...this.defaultTheme.variables,
        "background-color": "#121212",
        "foreground-color": "#E0E0E0",
        "prompt-color": "#BB86FC",
      },
    };
    this.registerTheme(darkTheme);

    // Load light theme
    const lightTheme = {
      id: "light",
      name: "Light",
      author: "MidaTerminal",
      version: "1.0.0",
      description: "Light terminal theme",
      variables: {
        ...this.defaultTheme.variables,
        "background-color": "#FFFFFF",
        "foreground-color": "#121212",
        "cursor-color": "#121212",
        black: "#424242",
        "prompt-color": "#6200EE",
      },
    };
    this.registerTheme(lightTheme);

    // Set default theme as active
    this.setTheme("default");

    // Load saved theme from localStorage if available
    this.loadSavedTheme();
  }

  /**
   * Register a new theme
   */
  registerTheme(theme) {
    if (!theme.id || !theme.name || !theme.variables) {
      throw new Error("Invalid theme format");
    }

    // Merge with default theme to ensure all variables are set
    const mergedTheme = {
      ...theme,
      variables: {
        ...this.defaultTheme.variables,
        ...theme.variables,
      },
    };

    this.themes[theme.id] = mergedTheme;
    return mergedTheme;
  }

  /**
   * Get a theme by ID
   */
  getTheme(themeId) {
    return this.themes[themeId] || null;
  }

  /**
   * Set active theme by ID
   */
  setTheme(themeId) {
    const theme = this.getTheme(themeId);
    if (!theme) {
      console.error(`Theme '${themeId}' not found`);
      return false;
    }

    this.activeTheme = theme;
    this.applyTheme(theme);

    // Save to localStorage
    try {
      localStorage.setItem("mida_terminal_theme", themeId);
    } catch (e) {
      console.warn("Could not save theme preference", e);
    }

    return true;
  }

  /**
   * Apply theme to DOM
   */
  applyTheme(theme) {
    if (!theme) {
      theme = this.activeTheme;
    }

    if (!theme) {
      return false;
    }

    // Create CSS variables from theme
    let cssVars = "";
    for (const [key, value] of Object.entries(theme.variables)) {
      cssVars += `--terminal-${key}: ${value};\n`;
    }

    // Apply CSS variables
    const styleId = "mida-terminal-theme";
    let styleEl = document.getElementById(styleId);

    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `:root {\n${cssVars}}`;

    // Apply direct styles to terminal elements
    this.applyElementStyles();

    return true;
  }

  /**
   * Apply styles to terminal elements
   */
  applyElementStyles() {
    // Find terminal containers and apply styles
    const terminalElements = document.querySelectorAll(".mida-terminal");

    terminalElements.forEach((el) => {
      // Apply CSS variables as inline styles for older browsers
      el.style.backgroundColor = "var(--terminal-background-color)";
      el.style.color = "var(--terminal-foreground-color)";
      el.style.fontFamily = "var(--terminal-font-family)";
      el.style.fontSize = "var(--terminal-font-size)";
      el.style.lineHeight = "var(--terminal-line-height)";
      el.style.padding = "var(--terminal-padding)";
      el.style.borderRadius = "var(--terminal-border-radius)";

      // Apply scrollbar styles
      el.style.scrollbarWidth = "var(--terminal-scrollbar-width)";
      el.style.scrollbarColor =
        "var(--terminal-scrollbar-thumb-color) var(--terminal-scrollbar-track-color)";

      // Apply to cursor element if it exists
      const cursor = el.querySelector(".terminal-cursor");
      if (cursor) {
        cursor.style.backgroundColor = "var(--terminal-cursor-color)";
        cursor.style.animation = `blink var(--terminal-cursor-blink-rate) infinite steps(1)`;
      }

      // Apply to prompt if it exists
      const prompt = el.querySelector(".terminal-prompt");
      if (prompt) {
        prompt.style.color = "var(--terminal-prompt-color)";
        prompt.style.padding = "var(--terminal-prompt-padding)";
      }
    });
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    try {
      const savedThemeId = localStorage.getItem("mida_terminal_theme");
      if (savedThemeId && this.themes[savedThemeId]) {
        this.setTheme(savedThemeId);
      }
    } catch (e) {
      console.warn("Could not load saved theme", e);
    }
  }

  /**
   * Get active theme
   */
  getActiveTheme() {
    return this.activeTheme;
  }

  /**
   * Get all registered themes
   */
  getAllThemes() {
    return Object.values(this.themes);
  }

  /**
   * Create new theme
   */
  createTheme(themeData) {
    if (!themeData.id || !themeData.name) {
      throw new Error("Theme must have an ID and name");
    }

    // Generate a unique ID if it already exists
    if (this.themes[themeData.id]) {
      const baseId = themeData.id;
      let counter = 1;
      while (this.themes[`${baseId}_${counter}`]) {
        counter++;
      }
      themeData.id = `${baseId}_${counter}`;
    }

    return this.registerTheme(themeData);
  }

  /**
   * Delete theme
   */
  deleteTheme(themeId) {
    // Don't allow deleting default theme
    if (themeId === "default") {
      console.error("Cannot delete default theme");
      return false;
    }

    // Switch to default theme if active theme is being deleted
    if (this.activeTheme && this.activeTheme.id === themeId) {
      this.setTheme("default");
    }

    // Delete theme
    if (this.themes[themeId]) {
      delete this.themes[themeId];
      return true;
    }

    return false;
  }

  /**
   * Export theme to JSON
   */
  exportTheme(themeId) {
    const theme = this.getTheme(themeId || this.activeTheme.id);
    if (!theme) {
      return null;
    }

    return JSON.stringify(theme, null, 2);
  }

  /**
   * Import theme from JSON
   */
  importTheme(themeJson) {
    try {
      const themeData =
        typeof themeJson === "string" ? JSON.parse(themeJson) : themeJson;

      return this.registerTheme(themeData);
    } catch (e) {
      console.error("Failed to import theme", e);
      return null;
    }
  }

  /**
   * Create theme editor UI
   */
  createThemeEditor(container, theme = null) {
    if (!container) {
      return false;
    }

    const themeToEdit = theme || this.activeTheme;
    if (!themeToEdit) {
      return false;
    }

    // Create editor container
    const editorEl = document.createElement("div");
    editorEl.className = "theme-editor";

    // Create editor UI
    editorEl.innerHTML = `
      <div class="theme-editor-header">
        <h2>Edit Theme: ${themeToEdit.name}</h2>
        <div class="theme-actions">
          <button class="save-theme-btn">Save</button>
          <button class="export-theme-btn">Export</button>
          <button class="close-editor-btn">Close</button>
        </div>
      </div>
      <div class="theme-metadata">
        <div class="form-group">
          <label for="theme-name">Name</label>
          <input type="text" id="theme-name" value="${themeToEdit.name}">
        </div>
        <div class="form-group">
          <label for="theme-author">Author</label>
          <input type="text" id="theme-author" value="${
            themeToEdit.author || ""
          }">
        </div>
        <div class="form-group">
          <label for="theme-description">Description</label>
          <textarea id="theme-description">${
            themeToEdit.description || ""
          }</textarea>
        </div>
      </div>
      <div class="theme-variables">
        <h3>Theme Variables</h3>
        <div class="variables-grid">
          ${this._generateVariableInputs(themeToEdit.variables)}
        </div>
      </div>
      <div class="theme-preview">
        <h3>Preview</h3>
        <div class="preview-terminal">
          <div class="preview-line">
            <span class="preview-prompt">user@host:~$</span>
            <span class="preview-command">echo "Hello, World!"</span>
          </div>
          <div class="preview-output">Hello, World!</div>
          <div class="preview-line">
            <span class="preview-prompt">user@host:~$</span>
            <span class="preview-cursor"></span>
          </div>
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .theme-editor {
        font-family: system-ui, sans-serif;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 20px;
        max-width: 800px;
        margin: 0 auto;
      }
      .theme-editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      .theme-editor-header h2 {
        margin: 0;
        font-size: 1.5rem;
      }
      .theme-actions {
        display: flex;
        gap: 8px;
      }
      .theme-actions button {
        padding: 8px 12px;
        border-radius: 4px;
        border: none;
        background: #3498db;
        color: white;
        cursor: pointer;
      }
      .theme-actions button:hover {
        background: #2980b9;
      }
      .theme-actions .close-editor-btn {
        background: #e74c3c;
      }
      .theme-actions .close-editor-btn:hover {
        background: #c0392b;
      }
      .form-group {
        margin-bottom: 15px;
      }
      .form-group label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      .form-group input, .form-group textarea {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .variables-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
      }
      .variable-item {
        margin-bottom: 10px;
      }
      .variable-item label {
        display: block;
        margin-bottom: 5px;
        font-size: 0.9rem;
      }
      .color-input {
        display: flex;
        align-items: center;
      }
      .color-input input[type="color"] {
        width: 40px;
        height: 40px;
        border: none;
        padding: 0;
        margin-right: 8px;
      }
      .color-input input[type="text"] {
        flex: 1;
      }
      .preview-terminal {
        background: var(--terminal-background-color, #1E1E1E);
        color: var(--terminal-foreground-color, #FFFFFF);
        font-family: var(--terminal-font-family, monospace);
        font-size: var(--terminal-font-size, 14px);
        line-height: var(--terminal-line-height, 1.5);
        padding: var(--terminal-padding, 12px);
        border-radius: var(--terminal-border-radius, 4px);
        margin-top: 15px;
      }
      .preview-prompt {
        color: var(--terminal-prompt-color, #3498DB);
        padding-right: 8px;
      }
      .preview-command {
        color: var(--terminal-command-color, #FFFFFF);
      }
      .preview-cursor {
        display: inline-block;
        width: 8px;
        height: 16px;
        background: var(--terminal-cursor-color, #FFFFFF);
        animation: blink var(--terminal-cursor-blink-rate, 1.2s) infinite steps(1);
      }
      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    // Add to container
    container.appendChild(editorEl);

    // Set up event handlers
    this._setupThemeEditorEvents(editorEl, themeToEdit);

    // Update preview
    this._updateThemePreview(editorEl, themeToEdit.variables);

    return true;
  }

  /**
   * Generate variable inputs for theme editor
   */
  _generateVariableInputs(variables) {
    let html = "";

    for (const [key, value] of Object.entries(variables)) {
      const isColor =
        key.includes("color") &&
        (value.startsWith("#") || value.startsWith("rgb"));

      if (isColor) {
        html += `
          <div class="variable-item">
            <label for="var-${key}">${key}</label>
            <div class="color-input">
              <input type="color" id="var-color-${key}" value="${value}" data-var="${key}">
              <input type="text" id="var-${key}" value="${value}" data-var="${key}">
            </div>
          </div>
        `;
      } else {
        html += `
          <div class="variable-item">
            <label for="var-${key}">${key}</label>
            <input type="text" id="var-${key}" value="${value}" data-var="${key}">
          </div>
        `;
      }
    }

    return html;
  }

  /**
   * Set up theme editor event handlers
   */
  _setupThemeEditorEvents(editorEl, theme) {
    // Close button
    const closeBtn = editorEl.querySelector(".close-editor-btn");
    closeBtn.addEventListener("click", () => {
      editorEl.remove();
    });

    // Save button
    const saveBtn = editorEl.querySelector(".save-theme-btn");
    saveBtn.addEventListener("click", () => {
      const updatedTheme = this._getThemeFromEditor(editorEl, theme);
      this.registerTheme(updatedTheme);
      this.setTheme(updatedTheme.id);
      alert(`Theme "${updatedTheme.name}" saved`);
    });

    // Export button
    const exportBtn = editorEl.querySelector(".export-theme-btn");
    exportBtn.addEventListener("click", () => {
      const updatedTheme = this._getThemeFromEditor(editorEl, theme);
      const themeJson = JSON.stringify(updatedTheme, null, 2);

      // Trigger download
      const blob = new Blob([themeJson], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${updatedTheme.id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Input change handlers for live preview
    const inputs = editorEl.querySelectorAll("input[data-var]");
    inputs.forEach((input) => {
      input.addEventListener("input", (e) => {
        const varName = e.target.getAttribute("data-var");
        const { value } = e.target;

        // Update corresponding color input if this is a text input for a color
        if (input.type === "text" && varName.includes("color")) {
          const colorInput = editorEl.querySelector(
            `input[type="color"][data-var="${varName}"]`,
          );
          if (colorInput && value.startsWith("#")) {
            colorInput.value = value;
          }
        }

        // Update corresponding text input if this is a color picker
        if (input.type === "color") {
          const textInput = editorEl.querySelector(
            `input[type="text"][data-var="${varName}"]`,
          );
          if (textInput) {
            textInput.value = value;
          }
        }

        // Get current variables from all inputs
        const currentVars = this._getVariablesFromEditor(editorEl);

        // Update preview
        this._updateThemePreview(editorEl, currentVars);
      });
    });
  }

  /**
   * Get theme data from editor
   */
  _getThemeFromEditor(editorEl, originalTheme) {
    const name = editorEl.querySelector("#theme-name").value;
    const author = editorEl.querySelector("#theme-author").value;
    const description = editorEl.querySelector("#theme-description").value;

    const variables = this._getVariablesFromEditor(editorEl);

    return {
      id: originalTheme.id,
      name,
      author,
      description,
      version: originalTheme.version || "1.0.0",
      variables,
    };
  }

  /**
   * Get variables from editor inputs
   */
  _getVariablesFromEditor(editorEl) {
    const variables = {};
    const inputs = editorEl.querySelectorAll('input[type="text"][data-var]');

    inputs.forEach((input) => {
      const varName = input.getAttribute("data-var");
      variables[varName] = input.value;
    });

    return variables;
  }

  /**
   * Update theme preview in editor
   */
  _updateThemePreview(editorEl, variables) {
    const previewEl = editorEl.querySelector(".preview-terminal");

    // Apply variables to preview
    for (const [key, value] of Object.entries(variables)) {
      previewEl.style.setProperty(`--terminal-${key}`, value);
    }
  }

  /**
   * Create theme marketplace UI
   */
  createThemeMarketplace(container) {
    if (!container) {
      return false;
    }

    // Create marketplace container
    const marketplaceEl = document.createElement("div");
    marketplaceEl.className = "theme-marketplace";

    // Create marketplace UI
    marketplaceEl.innerHTML = `
      <div class="marketplace-header">
        <h2>Theme Marketplace</h2>
        <div class="marketplace-actions">
          <button class="create-theme-btn">Create New Theme</button>
          <button class="import-theme-btn">Import Theme</button>
        </div>
      </div>
      <div class="marketplace-themes">
        <div class="themes-grid">
          ${this._generateThemeCards()}
        </div>
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .theme-marketplace {
        font-family: system-ui, sans-serif;
        padding: 20px;
        max-width: 1000px;
        margin: 0 auto;
      }
      .marketplace-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .marketplace-header h2 {
        margin: 0;
        font-size: 1.8rem;
      }
      .marketplace-actions {
        display: flex;
        gap: 10px;
      }
      .marketplace-actions button {
        padding: 10px 16px;
        border-radius: 4px;
        border: none;
        background: #3498db;
        color: white;
        cursor: pointer;
        font-size: 14px;
      }
      .marketplace-actions button:hover {
        background: #2980b9;
      }
      .themes-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
      }
      .theme-card {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: transform 0.2s, box-shadow 0.2s;
      }
      .theme-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.15);
      }
      .theme-preview {
        height: 150px;
        padding: 15px;
        font-family: monospace;
        position: relative;
      }
      .theme-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.2s;
      }
      .theme-card:hover .theme-overlay {
        opacity: 1;
      }
      .theme-overlay-buttons {
        display: flex;
        gap: 10px;
      }
      .theme-overlay-buttons button {
        padding: 8px 12px;
        border-radius: 4px;
        border: none;
        background: white;
        color: #333;
        cursor: pointer;
        font-weight: bold;
      }
      .theme-info {
        padding: 15px;
        background: white;
      }
      .theme-name {
        font-size: 1.2rem;
        font-weight: bold;
        margin: 0 0 5px 0;
      }
      .theme-author {
        color: #666;
        font-size: 0.9rem;
        margin: 0;
      }
      .theme-description {
        margin-top: 8px;
        font-size: 0.9rem;
        color: #333;
      }
    `;
    document.head.appendChild(style);

    // Add to container
    container.appendChild(marketplaceEl);

    // Set up event handlers
    this._setupMarketplaceEvents(marketplaceEl);

    return true;
  }

  /**
   * Generate theme cards for marketplace
   */
  _generateThemeCards() {
    let html = "";

    for (const theme of Object.values(this.themes)) {
      // Create preview styles
      const previewStyles = {
        background: theme.variables["background-color"],
        color: theme.variables["foreground-color"],
        fontFamily: theme.variables["font-family"],
      };

      const styleStr = Object.entries(previewStyles)
        .map(([key, value]) => `${key}: ${value}`)
        .join("; ");

      const isActive = this.activeTheme && this.activeTheme.id === theme.id;

      html += `
        <div class="theme-card" data-theme-id="${theme.id}">
          <div class="theme-preview" style="${styleStr}">
            <div class="preview-content">
              <span style="color: ${
                theme.variables["prompt-color"]
              }">user@host:~$</span> echo "Hello"
              <br>Hello
              <br><span style="color: ${
                theme.variables["prompt-color"]
              }">user@host:~$</span> <span class="cursor" style="background: ${
        theme.variables["cursor-color"]
      }; display: inline-block; width: 8px; height: 14px;"></span>
            </div>
            <div class="theme-overlay">
              <div class="theme-overlay-buttons">
                <button class="apply-theme-btn">${
                  isActive ? "Active" : "Apply"
                }</button>
                <button class="edit-theme-btn">Edit</button>
                ${
                  theme.id !== "default"
                    ? '<button class="delete-theme-btn">Delete</button>'
                    : ""
                }
              </div>
            </div>
          </div>
          <div class="theme-info">
            <h3 class="theme-name">${theme.name}</h3>
            <p class="theme-author">By ${theme.author || "Unknown"}</p>
            <p class="theme-description">${theme.description || ""}</p>
          </div>
        </div>
      `;
    }

    return html;
  }

  /**
   * Set up marketplace event handlers
   */
  _setupMarketplaceEvents(marketplaceEl) {
    // Create theme button
    const createBtn = marketplaceEl.querySelector(".create-theme-btn");
    createBtn.addEventListener("click", () => {
      const newTheme = {
        id: `theme_${Date.now()}`,
        name: "New Theme",
        author: "",
        description: "",
        variables: { ...this.defaultTheme.variables },
      };

      const newThemeObj = this.registerTheme(newTheme);

      // Open editor for new theme
      const editorContainer = document.createElement("div");
      editorContainer.className = "theme-editor-container";
      document.body.appendChild(editorContainer);

      this.createThemeEditor(editorContainer, newThemeObj);
    });

    // Import theme button
    const importBtn = marketplaceEl.querySelector(".import-theme-btn");
    importBtn.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const themeData = JSON.parse(event.target.result);
            const importedTheme = this.importTheme(themeData);

            if (importedTheme) {
              alert(`Theme "${importedTheme.name}" imported successfully`);

              // Refresh marketplace
              marketplaceEl.querySelector(".themes-grid").innerHTML =
                this._generateThemeCards();
              this._setupThemeCardEvents(marketplaceEl);
            }
          } catch (err) {
            alert(`Error importing theme: ${err.message}`);
          }
        };
        reader.readAsText(file);
      });

      input.click();
    });

    // Theme card buttons
    this._setupThemeCardEvents(marketplaceEl);
  }

  /**
   * Set up theme card event handlers
   */
  _setupThemeCardEvents(marketplaceEl) {
    const themeCards = marketplaceEl.querySelectorAll(".theme-card");

    themeCards.forEach((card) => {
      const themeId = card.getAttribute("data-theme-id");

      // Apply theme button
      const applyBtn = card.querySelector(".apply-theme-btn");
      applyBtn.addEventListener("click", () => {
        this.setTheme(themeId);

        // Update button text for all cards
        marketplaceEl.querySelectorAll(".apply-theme-btn").forEach((btn) => {
          btn.textContent = "Apply";
        });
        applyBtn.textContent = "Active";
      });

      // Edit theme button
      const editBtn = card.querySelector(".edit-theme-btn");
      editBtn.addEventListener("click", () => {
        const theme = this.getTheme(themeId);

        // Open editor
        const editorContainer = document.createElement("div");
        editorContainer.className = "theme-editor-container";
        document.body.appendChild(editorContainer);

        this.createThemeEditor(editorContainer, theme);
      });

      // Delete theme button
      const deleteBtn = card.querySelector(".delete-theme-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          if (
            confirm(
              `Are you sure you want to delete the theme "${
                this.getTheme(themeId).name
              }"?`,
            )
          ) {
            this.deleteTheme(themeId);
            card.remove();
          }
        });
      }
    });
  }
}

// Export the theme manager
export default ThemeManager;
