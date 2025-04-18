import * as React from "react";
const {   createContext, useState   } = React;
import useContextSelector, {
  createSelectableContext,
} from "../hooks/useContextSelector";

// Define our terminal state context type
interface TerminalState {
  commandHistory: string[];
  output: string[];
  currentCommand: string;
  isRunning: boolean;
  theme: {
    background: string;
    foreground: string;
    accent: string;
  };
}

// Create the initial context value
const initialState: TerminalState = {
  commandHistory: [],
  output: [],
  currentCommand: "",
  isRunning: false,
  theme: {
    background: "#000",
    foreground: "#fff",
    accent: "#0f0",
  },
};

// Create the context
export const TerminalContext = createContext<TerminalState>(initialState);

// Create a selectable version of the context
export const SelectableTerminalContext =
  createSelectableContext(TerminalContext);

// Provider component with sample state updates
export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TerminalState>(initialState);

  // Sample function to update command (would cause re-renders in traditional approach)
  const updateCommand = (newCommand: string) => {
    setState((prev) => ({
      ...prev,
      currentCommand: newCommand,
    }));
  };

  // Sample function to toggle running state (would cause re-renders in traditional approach)
  const toggleRunning = () => {
    setState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  // Sample function to update theme (would cause re-renders in traditional approach)
  const updateTheme = (newTheme: Partial<TerminalState["theme"]>) => {
    setState((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...newTheme,
      },
    }));
  };

  return (
    <TerminalContext.Provider value={state}>
      <div>
        <button onClick={() => updateCommand("new command")}>
          Update Command
        </button>
        <button onClick={toggleRunning}>Toggle Running</button>
        <button
          onClick={() =>
            updateTheme({ background: Math.random() > 0.5 ? "#111" : "#000" })
          }
        >
          Update Theme
        </button>
        {children}
      </div>
    </TerminalContext.Provider>
  );
}

// Example component that only cares about current command
export function CommandInput() {
  // This component will only re-render when currentCommand changes
  const currentCommand = useContextSelector(
    TerminalContext,
    (state) => state.currentCommand,
  );

  console.log("CommandInput rendered");

  return <div>Current Command: {currentCommand}</div>;
}

// Example component that only cares about output
export function TerminalOutput() {
  // This component will only re-render when output changes
  const output = useContextSelector(TerminalContext, (state) => state.output);

  console.log("TerminalOutput rendered");

  return <div>Output Lines: {output.length}</div>;
}

// Example component that only cares about running state
export function RunningIndicator() {
  // This component will only re-render when isRunning changes
  const isRunning = useContextSelector(
    TerminalContext,
    (state) => state.isRunning,
  );

  console.log("RunningIndicator rendered");

  return <div>Status: {isRunning ? "Running" : "Idle"}</div>;
}

// Example component that only cares about theme
export function ThemeDisplay() {
  // This component will only re-render when theme changes
  const theme = useContextSelector(TerminalContext, (state) => state.theme);

  console.log("ThemeDisplay rendered");

  return (
    <div
      style={{
        backgroundColor: theme.background,
        color: theme.foreground,
        padding: "10px",
      }}
    >
      Theme Background: {theme.background}
    </div>
  );
}

// Main component that puts it all together
export default function ContextSelectorExample() {
  return (
    <TerminalProvider>
      <h3>Context Selector Example</h3>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}
      >
        <CommandInput />
        <RunningIndicator />
        <TerminalOutput />
        <ThemeDisplay />
      </div>
      <p>
        Check the console logs to see which components re-render when you click
        the buttons. Only the components that depend on the changed state will
        re-render.
      </p>
    </TerminalProvider>
  );
}
