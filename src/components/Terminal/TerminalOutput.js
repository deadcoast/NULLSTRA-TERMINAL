// TerminalOutput component
const TerminalOutput = ({ lines = [] }) => {
  return (
    <div className="terminal-output">
      {lines.map((line, index) => (
        <div key={index} className="output-line">
          {line}
        </div>
      ))}
    </div>
  );
};

export default TerminalOutput;
