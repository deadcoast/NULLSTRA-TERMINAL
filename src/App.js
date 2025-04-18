import React from "react";
// This import should trigger our ESLint rule since it imports directly from the component file
import TerminalOutput from "./components/Terminal/TerminalOutput";
import TerminalPrompt from "./components/Terminal/TerminalPrompt";

function App() {
  return (
    <div className="app">
      <TerminalPrompt />
      <TerminalOutput
        lines={["Welcome to the terminal", "Type a command to begin"]}
      />
    </div>
  );
}

export default App;
