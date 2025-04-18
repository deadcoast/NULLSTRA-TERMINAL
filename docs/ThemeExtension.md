# Theme Manager Extension Documentation

## Overview

The Theme Manager Extension enhances MidaTerminal with comprehensive theme management capabilities. It allows users to switch between predefined themes, create custom themes, edit theme properties, and import/export themes for sharing.

## Features

- Switch between built-in themes (dark, light, retro)
- Create custom themes based on existing ones
- Edit theme properties individually
- Export themes as JSON
- Import themes from JSON
- Smooth theme transitions

## Commands

The Theme Manager Extension adds the following commands to the terminal:

| Command                              | Description                                                         |
| ------------------------------------ | ------------------------------------------------------------------- |
| `theme list`                         | Display all available themes                                        |
| `theme set <id>`                     | Switch to the specified theme                                       |
| `theme info [id]`                    | Show detailed information about a theme (defaults to current theme) |
| `theme create <id> [name]`           | Create a new theme based on the current theme                       |
| `theme edit <id> <property> <value>` | Edit a specific property of a theme                                 |
| `theme delete <id>`                  | Delete a custom theme (built-in themes cannot be deleted)           |
| `theme export [id]`                  | Export theme as JSON (defaults to current theme)                    |
| `theme import <json>`                | Import a theme from JSON data                                       |

## Theme Properties

Themes include the following customizable properties:

| Property                         | Description                                                   |
| -------------------------------- | ------------------------------------------------------------- |
| `name`                           | Display name of the theme                                     |
| `background`                     | Background color (hex or CSS color value)                     |
| `foreground`                     | Text color (hex or CSS color value)                           |
| `cursor`                         | Cursor color (hex or CSS color value)                         |
| `selection`                      | Selection highlight color (hex or CSS color value with alpha) |
| `black`, `red`, `green`, etc.    | ANSI colors for terminal output                               |
| `brightBlack`, `brightRed`, etc. | Bright ANSI colors for terminal output                        |
| `font`                           | Font family for terminal text                                 |
| `fontSize`                       | Font size for terminal text (with units, e.g., "14px")        |

## Settings

The extension supports the following settings:

| Setting                    | Default    | Description                              |
| -------------------------- | ---------- | ---------------------------------------- |
| `Default theme`            | "dark"     | Theme applied when the terminal starts   |
| `Custom themes folder`     | "./themes" | Directory for custom theme files         |
| `Enable theme transitions` | true       | Enable smooth transitions between themes |
| `Transition speed`         | "0.3s"     | Duration of theme transition animations  |

## Usage Examples

### Switching Themes

```
# List available themes
theme list

# Switch to light theme
theme set light

# Get info about current theme
theme info
```

### Creating and Customizing Themes

```
# Create a new theme based on current theme
theme create mytheme "My Custom Theme"

# Edit theme properties
theme edit mytheme background #282c34
theme edit mytheme foreground #abb2bf
theme edit mytheme cursor #61afef

# Apply the custom theme
theme set mytheme
```

### Sharing Themes

```
# Export a theme to JSON
theme export mytheme

# Import a theme from JSON (paste the JSON after the command)
theme import {"name":"Solarized Dark","background":"#002b36","foreground":"#839496",...}
```

## Persistence

Custom themes are automatically saved to the browser's localStorage and will persist between sessions. The extension saves the current theme preference for future terminal sessions.

## Programmatic API

If you're developing extensions that interact with the theme system, you can access the theme manager through the extension API:

```javascript
// Get current theme
const currentTheme = terminal.getTheme();

// Set a theme
terminal.setTheme("dark");

// Register a theme change listener
terminal.on("theme-changed", (themeData) => {
  console.log("Theme changed to:", themeData.id);
});
```

## Compatibility

The Theme Manager Extension works with all modern browsers that support:

- CSS Variables
- localStorage
- Custom Events

## Troubleshooting

If themes are not saving between sessions:

- Make sure localStorage is enabled in your browser
- Check that you're not in private/incognito mode

If theme colors aren't applying correctly:

- Verify the theme property names match expected values
- Ensure color values use proper CSS syntax (#RRGGBB, rgb(), etc.)
