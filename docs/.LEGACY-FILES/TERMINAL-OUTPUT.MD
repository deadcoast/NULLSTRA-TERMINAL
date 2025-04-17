```tsx
import React, { useEffect, useRef } from "react";
import { TerminalMessage } from "../../utils/terminalCommands/index";
import TypeWriter from "../UI/TypeWriter";
import "../../styles/terminal.css"; // Adjust path if needed

interface TerminalOutputProps {
  messages: TerminalMessage[];
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
}

const TerminalOutput: React.FC<TerminalOutputProps> = ({ messages }) => {
  children,
  className = "",
  autoScroll = true,
}) => {
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (outputRef.current) {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
      }, [messages]);

  const getMessageClass = (type: string): string => {
    switch (type) {
      case 'error': return 'msg-error';
      case 'warning': return 'msg-warning';
      case 'success': return 'msg-success';
      case 'info':
      default: return 'msg-info';
    }
  };

  const formatTimestamp = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };
  }, [children, autoScroll]);
    <div className="terminal-output" ref={outputRef}>
      {messages.map((message, index) => {
        // Check if this is a file listing message
        const isFileListing = message.content.includes('contains the following files:');
        // Check if this is a terminal header message
        const isTerminalHeader = message.prefix === 'TERMINAL';

        return (
          <div key={index} className={`mb-1 ${isTerminalHeader ? 'text-terminal-magenta' : ''}`}>
            {message.prefix && (
              <span className={`px-1 py-0.5 font-bold ${isTerminalHeader ? 'bg-terminal-magenta text-terminal-black' : ''}`}>
                {message.prefix}
              </span>
            )}

            {message.timestamp && (
              <span className="text-terminal-cyan text-opacity-70 mr-2">
                {message.timestamp}
              </span>
            )}

            <span className={getMessageClass(message.type)}>
              {message.animated ? (
                <TypeWriter text={message.content} delay={30} />
              ) : (
                message.content
              )}
            </span>

            {/* Render file listings in a special way */}
            {isFileListing && message.files && (
              <div className="pl-4 mt-1 flex flex-wrap gap-2">
                {message.files.map((file: string, fileIndex: number) => (
                  <span
                    key={fileIndex}
                    className="text-terminal-magenta"
                  >
                    {file}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TerminalOutput;
```
