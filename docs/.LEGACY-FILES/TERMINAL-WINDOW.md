```tsx
import { useEffect, useRef, useState } from 'react';

const Terminal = () => {
  const [lines, setLines] = useState([
    '  ┌───────┬─────────────────────────────────────────────────────────────────┐',
    '  │ CLEye │ > ALWAYS_WATCHING                                               │',
    '  ├───────┴─────────────────────────────────────────────────────────────────│',
    '  ├─╦──────────────╗                                                        │',
    '  │ ║   NULLSTRA   ║                                                        │',
    '  │ ╠──────────────╝                                                        │',
    '  │ ║                                                                       │',
    '  │1╠─  {                                                                   │',
    '  │2╠─  "name": "USER_43127",                                               │',
    '  │3╠─  "IP": "192.168.1.100",                                              │',
    '  │4╠─  "path": "C:/chrome/chrome.exe",                                     │',
    '  │5╠─  "enabled_tracking": true                                            │',
    '  │6╠─  }                                                                   │',
    '  ├─╝                                                                       │',
    '  └─────────────────────────────────────────────────────────────────────────┘',
    '', // Add an empty line for spacing
    '[ID-317#I1] [INIT] System startup sequence initiated...',
    '[ID-317#W2] [WARN] Running pre-boot diagnostics...',
    '[ID-317#A3] [OK] Check completed with minor discrepancies (J-1WGX). Integrity check passed.',
    // Add more initial lines if needed
  ]);
  const [input, setInput] = useState('');
  const terminalInputRef = useRef<HTMLInputElement>(null); // Type the input ref
  const terminalOutputRef = useRef<HTMLDivElement>(null); // Type the output ref

  // Focus input on mount and on click anywhere in the terminal
  useEffect(() => {
    terminalInputRef.current?.focus();
  }, []);

  const focusInput = () => {
    terminalInputRef.current?.focus();
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop =
        terminalOutputRef.current.scrollHeight;
    }
  }, [lines]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleInputSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const command = input.trim();
      // Use magenta-shadow for user input line
      const userLine = `<span class="text-magenta magenta-shadow">[USER@cybersys ~]$&nbsp;${command.replace(
        / /g,
        '&nbsp;'
      )}</span>`;
      let newLines = [...lines, userLine];

      // --- Basic Command Handling (Placeholder) ---
      if (command === 'help') {
        newLines.push(
          '[SYS] Available commands: help, clear, sysinfo, ls [folder]'
        );
      } else if (command === 'clear') {
        newLines = [];
      } else if (command === 'sysinfo') {
        newLines.push('[SYS]&nbsp;CYBERSYS Model 470B');
        newLines.push('[SYS]&nbsp;OS: NULLSTRA-UNIX 2389.04.1 LTS');
        newLines.push('[SYS]&nbsp;Kernel: 15.92.R-NULLSTRA-secure');
        newLines.push('[SYS]&nbsp;Uptime: 4588 Days, 17 Hours, 19 Minutes');
      } else if (command.startsWith('ls')) {
        newLines.push('[SYS]&nbsp;Listing directory...');
        newLines.push(
          'Command_History&nbsp;&nbsp;Diagnostics&nbsp;&nbsp;Legislation&nbsp;&nbsp;User_Notes'
        );
      } else if (command) {
        newLines.push(`[ERR]&nbsp;Command not recognized: ${command}`);
      }
      // -------------------------------------------

      setLines(newLines);
      setInput('');
      event.preventDefault();
    }
  };

  return (
    // Add onClick to focus input when clicking anywhere
    <div
      className="terminal-container font-fraktion-mono bg-black text-lime lime-shadow w-full h-full p-2 flex flex-col overflow-hidden"
      onClick={focusInput}
    >
      {/* Header */}
      <div className="terminal-header pb-1 mb-1 text-xs flex justify-between whitespace-nowrap">
        <span>
          Opening Connection to Servez 0.4.5-46 ......................
        </span>
        <span>8142.s5.09.1387</span>
        <span className="ml-4">&lt;831.461.60231.14.vt920&gt;</span>
      </div>

      {/* Output Area */}
      <div
        ref={terminalOutputRef}
        className="terminal-output flex-grow overflow-y-auto mb-1 text-xs leading-tight pr-1"
      >
        {lines.map((line, index) => (
          // Use <pre> tag to preserve whitespace accurately
          <pre key={index} className="m-0 p-0">
            {line}
          </pre>
        ))}
      </div>

      {/* Input Area */}
      <div className="terminal-input flex items-center text-xs flex-shrink-0">
        <span className="text-magenta magenta-shadow">
          [USER@cybersys ~]$&nbsp;
        </span>
        <input
          ref={terminalInputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputSubmit}
          className="bg-transparent border-none outline-none text-lime flex-grow focus:ring-0 p-0 m-0"
          autoComplete="off" // Prevent browser autocomplete
          spellCheck="false" // Disable spellcheck
        />
        {/* Add a pseudo-element target for the CSS caret */}
        <span className="caret-pseudo"></span>
      </div>

      {/* Footer (Example - adjust content as needed) */}
      <div className="terminal-footer border-t border-green-700 pt-1 mt-1 text-xs flex justify-end whitespace-nowrap">
        <span>&lt;831.461.60231.14.vt920&gt;</span>
      </div>
    </div>
  );
};

export default Terminal;
```
