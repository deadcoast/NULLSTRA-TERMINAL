import * as React from "react";
const {   useEffect, useRef, useState   } = React;
import styled from "styled-components";

interface CommandPromptProps {
  prompt?: string;
  placeholder?: string;
  onSubmit?: (command: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
  history?: string[];
  disabled?: boolean;
  className?: string;
}

const PromptContainer = styled.div`
  display: flex;
  align-items: baseline;
  width: 100%;
  font-family: "Menlo", "Monaco", "Courier New", monospace;
  padding: 4px 0;
`;

const PromptLabel = styled.span`
  color: ${({ theme }) => theme.colors?.promptColor || "#36c2dd"};
  margin-right: 8px;
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors?.textPrimary || "#ddd"};
  font-family: inherit;
  font-size: inherit;
  padding: 0;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors?.textMuted || "#888"};
    opacity: 0.7;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const CommandPrompt: React.FC<CommandPromptProps> = ({
  prompt = ">",
  placeholder = "Type a command...",
  onSubmit,
  onKeyPress,
  autoFocus = true,
  history = [],
  disabled = false,
  className,
}) => {
  const [command, setCommand] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Execute command on Enter
    if (e.key === "Enter" && command.trim() && onSubmit) {
      onSubmit(command);
      setCommand("");
      setHistoryIndex(-1);
    }

    // Navigate command history
    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const newIndex =
        historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setCommand(history[history.length - 1 - newIndex] || "");
    }

    if (e.key === "ArrowDown" && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCommand(newIndex >= 0 ? history[history.length - 1 - newIndex] : "");
    }

    // Pass the event to the parent component if needed
    if (onKeyPress) {
      onKeyPress(e);
    }
  };

  return (
    <PromptContainer className={className}>
      <PromptLabel>{prompt}</PromptLabel>
      <Input
        ref={inputRef}
        type="text"
        value={command}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        aria-label="Command input"
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
      />
    </PromptContainer>
  );
};

export default CommandPrompt;
