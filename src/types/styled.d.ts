import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors?: {
      statusBarBackground?: string;
      statusBarForeground?: string;
      border?: string;
      promptColor?: string;
      textPrimary?: string;
      textMuted?: string;
      background?: string;
      foreground?: string;
      accent?: string;
      success?: string;
      warning?: string;
      error?: string;
    };
    spacing?: {
      xs?: string;
      sm?: string;
      md?: string;
      lg?: string;
      xl?: string;
    };
    fonts?: {
      mono?: string;
      sans?: string;
      fontSize?: string;
      lineHeight?: string;
    };
    isDark?: boolean;
    background?: string;
    text?: string;
    border?: string;
    backgroundLight?: string;
  }
}
