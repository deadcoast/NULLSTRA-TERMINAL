// TerminalPrompt component
const TerminalPrompt = () => {
  return (
    <div className="terminal-prompt">
      <span className="prompt-symbol">$</span>
      <input type="text" className="prompt-input" />
    </div>
  );
};

export default TerminalPrompt;
