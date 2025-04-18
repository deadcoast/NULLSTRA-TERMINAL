export interface ThemeType {
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

  // UI elements
  panelBackground: string;
  panelForeground: string;
  buttonBackground: string;
  buttonForeground: string;

  // Additional properties as needed
  isDark: boolean;
}

// Theme transition options
export interface ThemeTransitionOptions {
  enabled: boolean;
  duration: number;
  timingFunction: string;
}

// Theme manager settings
export interface ThemeManagerSettings {
  defaultTheme: string;
  customThemesFolder: string;
  themeTransition: ThemeTransitionOptions;
}
