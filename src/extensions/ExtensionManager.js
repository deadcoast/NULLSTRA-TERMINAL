/**
 * Terminal Extension Manager - Provides extension capabilities for MidaTerminal
 */

class ExtensionManager {
  constructor(terminal) {
    this.terminal = terminal;
    this.extensions = {};
    this.registeredHooks = {
      beforeCommand: [],
      afterCommand: [],
      onInit: [],
      onPrompt: [],
      onOutput: [],
      onError: [],
      onClear: [],
      onThemeChange: [],
      onResize: [],
    };
    this.sandbox = null;
    this.settings = {
      allowNetwork: false,
      allowStorage: true,
      allowDOMAccess: false,
      allowFileSystem: false,
    };
  }

  /**
   * Initialize extension manager
   */
  initialize() {
    this._createSandbox();
    this._loadInstalledExtensions();
    this._triggerHook("onInit");
  }

  /**
   * Register an extension
   */
  registerExtension(extension) {
    if (!extension || !extension.id || !extension.name) {
      throw new Error("Invalid extension format");
    }

    // Check if extension already exists
    if (this.extensions[extension.id]) {
      console.warn(
        `Extension '${extension.id}' is already registered. Uninstalling previous version.`,
      );
      this.uninstallExtension(extension.id);
    }

    // Copy extension data
    const newExtension = {
      id: extension.id,
      name: extension.name,
      version: extension.version || "1.0.0",
      author: extension.author || "Anonymous",
      description: extension.description || "",
      enabled: false,
      hooks: extension.hooks || {},
      settings: extension.settings || {},
      commands: extension.commands || {},
      api: extension.api || {},
      _instance: null,
    };

    // Store extension
    this.extensions[extension.id] = newExtension;

    // If extension has onInit hook, enable immediately
    if (extension.hooks && extension.hooks.onInit) {
      this.enableExtension(extension.id);
    }

    return newExtension;
  }

  /**
   * Enable an extension
   */
  enableExtension(extensionId) {
    const extension = this.extensions[extensionId];
    if (!extension) {
      return false;
    }

    // If already enabled, do nothing
    if (extension.enabled) {
      return true;
    }

    try {
      // Initialize extension in sandbox
      if (extension.initialize) {
        extension._instance = this._runInSandbox(
          extensionId,
          extension.initialize,
        );
      }

      // Register hooks
      if (extension.hooks) {
        for (const [hookName, hookFn] of Object.entries(extension.hooks)) {
          if (typeof hookFn === "function" && this.registeredHooks[hookName]) {
            this.registeredHooks[hookName].push({
              id: extensionId,
              fn: hookFn,
            });
          }
        }
      }

      // Register commands
      if (extension.commands) {
        for (const [cmdName, cmdFn] of Object.entries(extension.commands)) {
          if (typeof cmdFn === "function") {
            this.terminal.registerCommand(
              cmdName,
              (args, terminal) => {
                return this._runInSandbox(extensionId, () =>
                  cmdFn(args, terminal),
                );
              },
              { source: `extension:${extensionId}` },
            );
          }
        }
      }

      // Mark as enabled
      extension.enabled = true;
      this._saveEnabledExtensions();
      return true;
    } catch (e) {
      console.error(`Failed to enable extension '${extensionId}':`, e);
      return false;
    }
  }

  /**
   * Disable an extension
   */
  disableExtension(extensionId) {
    const extension = this.extensions[extensionId];
    if (!extension || !extension.enabled) {
      return false;
    }

    try {
      // Call shutdown hook if exists
      if (extension.hooks && typeof extension.hooks.onShutdown === "function") {
        this._runInSandbox(extensionId, extension.hooks.onShutdown);
      }

      // Remove all hooks
      for (const hookName of Object.keys(this.registeredHooks)) {
        this.registeredHooks[hookName] = this.registeredHooks[hookName].filter(
          (hook) => hook.id !== extensionId,
        );
      }

      // Remove commands
      if (extension.commands) {
        for (const cmdName of Object.keys(extension.commands)) {
          this.terminal.unregisterCommand(cmdName);
        }
      }

      // Mark as disabled
      extension.enabled = false;
      this._saveEnabledExtensions();
      return true;
    } catch (e) {
      console.error(`Failed to disable extension '${extensionId}':`, e);
      return false;
    }
  }

  /**
   * Uninstall an extension
   */
  uninstallExtension(extensionId) {
    // Disable extension first
    this.disableExtension(extensionId);

    // Remove from extensions list
    if (this.extensions[extensionId]) {
      delete this.extensions[extensionId];
      this._saveInstalledExtensions();
      return true;
    }

    return false;
  }

  /**
   * Install extension from JSON
   */
  installExtension(extensionData) {
    try {
      // Parse JSON if string
      const data =
        typeof extensionData === "string"
          ? JSON.parse(extensionData)
          : extensionData;

      // Validate extension data
      if (!this._validateExtension(data)) {
        throw new Error("Invalid extension format");
      }

      // Register and enable extension
      const extension = this.registerExtension(data);
      this.enableExtension(extension.id);
      this._saveInstalledExtensions();

      return extension;
    } catch (e) {
      console.error("Failed to install extension:", e);
      return null;
    }
  }

  /**
   * Trigger a specific hook
   */
  triggerHook(hookName, ...args) {
    return this._triggerHook(hookName, ...args);
  }

  /**
   * Get all registered extensions
   */
  getExtensions() {
    return Object.values(this.extensions);
  }

  /**
   * Get extension by ID
   */
  getExtension(extensionId) {
    return this.extensions[extensionId] || null;
  }

  /**
   * Set extension settings
   */
  setExtensionSettings(extensionId, settings) {
    const extension = this.extensions[extensionId];
    if (!extension) {
      return false;
    }

    extension.settings = {
      ...extension.settings,
      ...settings,
    };

    this._saveInstalledExtensions();
    return true;
  }

  /**
   * Create UI for extension manager
   */
  createExtensionManagerUI(container) {
    if (!container) {
      return false;
    }

    // Create manager container
    const managerEl = document.createElement("div");
    managerEl.className = "extension-manager";

    // Create UI
    managerEl.innerHTML = `
      <div class="extension-header">
        <h2>Extension Manager</h2>
        <div class="extension-actions">
          <button class="install-extension-btn">Install Extension</button>
          <button class="refresh-extensions-btn">Refresh</button>
        </div>
      </div>
      <div class="extension-list">
        ${this._generateExtensionList()}
      </div>
    `;

    // Add styles
    const style = document.createElement("style");
    style.textContent = `
      .extension-manager {
        font-family: system-ui, sans-serif;
        padding: 20px;
        max-width: 900px;
        margin: 0 auto;
      }
      .extension-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .extension-header h2 {
        margin: 0;
        font-size: 1.8rem;
      }
      .extension-actions {
        display: flex;
        gap: 10px;
      }
      .extension-actions button {
        padding: 10px 16px;
        border-radius: 4px;
        border: none;
        background: #3498db;
        color: white;
        cursor: pointer;
        font-size: 14px;
      }
      .extension-actions button:hover {
        background: #2980b9;
      }
      .extension-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .extension-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
      }
      .extension-item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: #f5f5f5;
        border-bottom: 1px solid #ddd;
      }
      .extension-name {
        font-weight: bold;
        font-size: 1.1rem;
        margin: 0;
      }
      .extension-version {
        color: #666;
        margin-left: 8px;
        font-size: 0.9rem;
      }
      .extension-toggle {
        position: relative;
        display: inline-block;
        width: 46px;
        height: 24px;
      }
      .extension-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      .extension-toggle-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
        border-radius: 24px;
      }
      .extension-toggle-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
      .extension-toggle input:checked + .extension-toggle-slider {
        background-color: #2ecc71;
      }
      .extension-toggle input:checked + .extension-toggle-slider:before {
        transform: translateX(22px);
      }
      .extension-details {
        padding: 16px;
      }
      .extension-description {
        margin-top: 0;
        margin-bottom: 12px;
        color: #333;
      }
      .extension-author {
        margin: 0;
        color: #666;
        font-size: 0.9rem;
      }
      .extension-controls {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }
      .extension-controls button {
        padding: 6px 12px;
        border-radius: 4px;
        border: none;
        background: #f1f1f1;
        color: #333;
        cursor: pointer;
      }
      .extension-controls button:hover {
        background: #e1e1e1;
      }
      .extension-controls .uninstall-btn {
        background: #e74c3c;
        color: white;
      }
      .extension-controls .uninstall-btn:hover {
        background: #c0392b;
      }
      .extension-settings {
        margin-top: 12px;
        border-top: 1px solid #eee;
        padding-top: 12px;
      }
      .extension-settings h4 {
        margin-top: 0;
        margin-bottom: 8px;
      }
      .extension-setting {
        margin-bottom: 8px;
      }
      .extension-setting label {
        display: block;
        margin-bottom: 4px;
        font-weight: bold;
      }
      .extension-setting input[type="text"],
      .extension-setting input[type="number"],
      .extension-setting select {
        width: 100%;
        padding: 6px 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .extension-setting input[type="checkbox"] {
        margin-right: 8px;
      }
    `;
    document.head.appendChild(style);

    // Add to container
    container.appendChild(managerEl);

    // Set up event handlers
    this._setupManagerEvents(managerEl);

    return true;
  }

  /**
   * Generate extension list HTML for UI
   */
  _generateExtensionList() {
    let html = "";
    const extensions = this.getExtensions();

    if (extensions.length === 0) {
      return '<div class="no-extensions">No extensions installed. Click "Install Extension" to get started.</div>';
    }

    for (const extension of extensions) {
      html += `
        <div class="extension-item" data-extension-id="${extension.id}">
          <div class="extension-item-header">
            <div class="extension-title">
              <span class="extension-name">${extension.name}</span>
              <span class="extension-version">v${extension.version}</span>
            </div>
            <label class="extension-toggle">
              <input type="checkbox" class="extension-toggle-input" ${extension.enabled ? "checked" : ""}>
              <span class="extension-toggle-slider"></span>
            </label>
          </div>
          <div class="extension-details">
            <p class="extension-description">${extension.description || "No description provided."}</p>
            <p class="extension-author">By ${extension.author || "Unknown"}</p>
            
            ${this._generateExtensionSettings(extension)}
            
            <div class="extension-controls">
              <button class="settings-btn">Settings</button>
              <button class="uninstall-btn">Uninstall</button>
            </div>
          </div>
        </div>
      `;
    }

    return html;
  }

  /**
   * Generate extension settings HTML for UI
   */
  _generateExtensionSettings(extension) {
    // If no settings defined, return empty
    if (!extension.settings || Object.keys(extension.settings).length === 0) {
      return "";
    }

    let html = `
      <div class="extension-settings" style="display: none;">
        <h4>Settings</h4>
    `;

    for (const [key, value] of Object.entries(extension.settings)) {
      const settingId = `ext-${extension.id}-setting-${key}`;
      const valueType = typeof value;

      if (valueType === "boolean") {
        html += `
          <div class="extension-setting">
            <label>
              <input type="checkbox" id="${settingId}" 
                data-setting-key="${key}" 
                ${value ? "checked" : ""}>
              ${key}
            </label>
          </div>
        `;
      } else if (valueType === "number") {
        html += `
          <div class="extension-setting">
            <label for="${settingId}">${key}</label>
            <input type="number" id="${settingId}" 
              data-setting-key="${key}" 
              value="${value}">
          </div>
        `;
      } else if (Array.isArray(value)) {
        // Treat arrays as select options
        html += `
          <div class="extension-setting">
            <label for="${settingId}">${key}</label>
            <select id="${settingId}" data-setting-key="${key}">
              ${value.map((opt) => `<option value="${opt}">${opt}</option>`).join("")}
            </select>
          </div>
        `;
      } else {
        // Default to text input
        html += `
          <div class="extension-setting">
            <label for="${settingId}">${key}</label>
            <input type="text" id="${settingId}" 
              data-setting-key="${key}" 
              value="${value}">
          </div>
        `;
      }
    }

    html += `
      <button class="save-settings-btn">Save Settings</button>
    </div>`;

    return html;
  }

  /**
   * Set up manager UI event handlers
   */
  _setupManagerEvents(managerEl) {
    // Install extension button
    const installBtn = managerEl.querySelector(".install-extension-btn");
    installBtn.addEventListener("click", () => {
      // Create file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";

      input.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const extensionData = JSON.parse(event.target.result);
            const installedExt = this.installExtension(extensionData);

            if (installedExt) {
              alert(`Extension "${installedExt.name}" installed successfully`);

              // Refresh extension list
              managerEl.querySelector(".extension-list").innerHTML =
                this._generateExtensionList();
              this._setupExtensionItemEvents(managerEl);
            }
          } catch (err) {
            alert(`Error installing extension: ${err.message}`);
          }
        };
        reader.readAsText(file);
      });

      input.click();
    });

    // Refresh button
    const refreshBtn = managerEl.querySelector(".refresh-extensions-btn");
    refreshBtn.addEventListener("click", () => {
      managerEl.querySelector(".extension-list").innerHTML =
        this._generateExtensionList();
      this._setupExtensionItemEvents(managerEl);
    });

    // Set up extension item events
    this._setupExtensionItemEvents(managerEl);
  }

  /**
   * Set up extension item event handlers
   */
  _setupExtensionItemEvents(managerEl) {
    const extensionItems = managerEl.querySelectorAll(".extension-item");

    extensionItems.forEach((item) => {
      const extensionId = item.getAttribute("data-extension-id");

      // Toggle switch
      const toggleInput = item.querySelector(".extension-toggle-input");
      toggleInput.addEventListener("change", (e) => {
        if (e.target.checked) {
          if (this.enableExtension(extensionId)) {
            console.log(`Extension ${extensionId} enabled`);
          } else {
            e.target.checked = false;
            alert(`Failed to enable extension ${extensionId}`);
          }
        } else {
          if (this.disableExtension(extensionId)) {
            console.log(`Extension ${extensionId} disabled`);
          } else {
            e.target.checked = true;
            alert(`Failed to disable extension ${extensionId}`);
          }
        }
      });

      // Settings button
      const settingsBtn = item.querySelector(".settings-btn");
      const settingsPanel = item.querySelector(".extension-settings");

      if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener("click", () => {
          const isVisible = settingsPanel.style.display !== "none";
          settingsPanel.style.display = isVisible ? "none" : "block";
          settingsBtn.textContent = isVisible ? "Settings" : "Hide Settings";
        });
      }

      // Save settings button
      const saveSettingsBtn = item.querySelector(".save-settings-btn");
      if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener("click", () => {
          const extension = this.getExtension(extensionId);
          if (!extension) return;

          const newSettings = {};
          const inputs = item.querySelectorAll("[data-setting-key]");

          inputs.forEach((input) => {
            const key = input.getAttribute("data-setting-key");
            let value;

            if (input.type === "checkbox") {
              value = input.checked;
            } else if (input.type === "number") {
              value = parseFloat(input.value);
            } else if (input.tagName === "SELECT") {
              value = input.value;
            } else {
              value = input.value;
            }

            newSettings[key] = value;
          });

          this.setExtensionSettings(extensionId, newSettings);
          alert("Settings saved");
        });
      }

      // Uninstall button
      const uninstallBtn = item.querySelector(".uninstall-btn");
      uninstallBtn.addEventListener("click", () => {
        const extensionName = this.getExtension(extensionId).name;
        if (confirm(`Are you sure you want to uninstall "${extensionName}"?`)) {
          if (this.uninstallExtension(extensionId)) {
            item.remove();
            if (managerEl.querySelectorAll(".extension-item").length === 0) {
              managerEl.querySelector(".extension-list").innerHTML =
                '<div class="no-extensions">No extensions installed. Click "Install Extension" to get started.</div>';
            }
          } else {
            alert(`Failed to uninstall extension ${extensionId}`);
          }
        }
      });
    });
  }

  /**
   * Validate extension format
   */
  _validateExtension(data) {
    if (!data || typeof data !== "object") return false;
    if (!data.id || !data.name) return false;

    // Basic validation - can be extended
    return true;
  }

  /**
   * Save installed extensions to localStorage
   */
  _saveInstalledExtensions() {
    try {
      const extensionsData = Object.values(this.extensions).map((ext) => ({
        id: ext.id,
        name: ext.name,
        version: ext.version,
        author: ext.author,
        description: ext.description,
        settings: ext.settings,
      }));

      localStorage.setItem(
        "mida_terminal_extensions",
        JSON.stringify(extensionsData),
      );
    } catch (e) {
      console.warn("Could not save extensions data", e);
    }
  }

  /**
   * Save enabled extensions to localStorage
   */
  _saveEnabledExtensions() {
    try {
      const enabledExtensions = Object.values(this.extensions)
        .filter((ext) => ext.enabled)
        .map((ext) => ext.id);

      localStorage.setItem(
        "mida_terminal_enabled_extensions",
        JSON.stringify(enabledExtensions),
      );
    } catch (e) {
      console.warn("Could not save enabled extensions", e);
    }
  }

  /**
   * Load installed extensions from localStorage
   */
  _loadInstalledExtensions() {
    try {
      // Load installed extensions
      const extensionsData = localStorage.getItem("mida_terminal_extensions");
      if (extensionsData) {
        const extensions = JSON.parse(extensionsData);
        extensions.forEach((ext) => {
          this.registerExtension(ext);
        });
      }

      // Load enabled extensions
      const enabledData = localStorage.getItem(
        "mida_terminal_enabled_extensions",
      );
      if (enabledData) {
        const enabledIds = JSON.parse(enabledData);
        enabledIds.forEach((id) => {
          this.enableExtension(id);
        });
      }
    } catch (e) {
      console.warn("Could not load extensions", e);
    }
  }

  /**
   * Create a sandboxed environment for extensions
   */
  _createSandbox() {
    // Create a sandboxed context
    this.sandbox = {
      terminal: {
        // Limited terminal API
        write: (text) => this.terminal.write(text),
        writeLine: (text) => this.terminal.writeLine(text),
        clear: () => this.terminal.clear(),
        getHistory: () => this.terminal.getHistory(),
        setPrompt: (prompt) => this.terminal.setPrompt(prompt),
        getPrompt: () => this.terminal.getPrompt(),
      },
      console: {
        log: (...args) => console.log("[Extension]", ...args),
        warn: (...args) => console.warn("[Extension]", ...args),
        error: (...args) => console.error("[Extension]", ...args),
      },
    };

    // Add conditional APIs based on settings
    if (this.settings.allowStorage) {
      this.sandbox.storage = {
        get: (key) => {
          try {
            const data = localStorage.getItem(`ext_${key}`);
            return data ? JSON.parse(data) : null;
          } catch (e) {
            return null;
          }
        },
        set: (key, value) => {
          try {
            localStorage.setItem(`ext_${key}`, JSON.stringify(value));
            return true;
          } catch (e) {
            return false;
          }
        },
        remove: (key) => {
          try {
            localStorage.removeItem(`ext_${key}`);
            return true;
          } catch (e) {
            return false;
          }
        },
      };
    }

    if (this.settings.allowDOMAccess) {
      this.sandbox.dom = {
        createElement: (tag) => document.createElement(tag),
        getElement: (selector) => document.querySelector(selector),
        getElements: (selector) => document.querySelectorAll(selector),
      };
    }

    return this.sandbox;
  }

  /**
   * Run code in sandbox
   */
  _runInSandbox(extensionId, fn, ...args) {
    try {
      // Create context for specific extension
      const context = {
        ...this.sandbox,
        // Extension-specific APIs
        extension: {
          id: extensionId,
          getSettings: () => {
            const ext = this.getExtension(extensionId);
            return ext ? ext.settings : {};
          },
        },
      };

      // Execute in context
      return fn.apply(context, args);
    } catch (e) {
      console.error(`Error in extension ${extensionId}:`, e);
      return null;
    }
  }

  /**
   * Internal method to trigger hooks
   */
  _triggerHook(hookName, ...args) {
    if (!this.registeredHooks[hookName]) {
      return;
    }

    const results = [];
    for (const hook of this.registeredHooks[hookName]) {
      try {
        const result = this._runInSandbox(hook.id, hook.fn, ...args);
        if (result !== undefined) {
          results.push(result);
        }
      } catch (e) {
        console.error(`Error in ${hookName} hook of extension ${hook.id}:`, e);
      }
    }

    return results;
  }

  /**
   * Create an example extension
   */
  createExampleExtension() {
    return {
      id: "example-extension",
      name: "Example Extension",
      version: "1.0.0",
      author: "MidaTerminal",
      description: "A simple example extension showing capabilities",
      settings: {
        "Show welcome message": true,
        "Highlight color": "#FF5722",
        "Max history items": 100,
      },
      initialize: function () {
        // Will run when extension is enabled
        this.console.log("Example extension initialized!");

        if (this.extension.getSettings()["Show welcome message"]) {
          this.terminal.writeLine("Example extension loaded successfully!");
        }

        // Return an instance that can be stored
        return {
          name: this.extension.id,
          highlightColor: this.extension.getSettings()["Highlight color"],
        };
      },
      hooks: {
        onInit: function () {
          this.console.log("Terminal initialized");
        },
        beforeCommand: function (command, args) {
          this.console.log("About to execute:", command, args);
          return { command, args }; // Can modify command
        },
        afterCommand: function (command, result) {
          this.console.log("Command executed:", command, "Result:", result);
        },
      },
      commands: {
        example: function (args, terminal) {
          terminal.writeLine("Example command executed!");
          terminal.writeLine("Arguments: " + args.join(", "));
          return "Example command completed";
        },
        highlight: function (args, terminal) {
          const color = this.extension.getSettings()["Highlight color"];
          terminal.writeLine(
            `<span style="color: ${color}">${args.join(" ")}</span>`,
          );
        },
      },
    };
  }
}

export default ExtensionManager;
