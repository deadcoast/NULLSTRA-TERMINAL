import * as React from "react";
const {   useCallback   } = React;

import TerminalPrompt from "./TerminalPrompt";

interface TerminalInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (command: string) => void;
  onClear: () => void;
  onKeyNavigation: (direction: "up" | "down") => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  cursorStyle?: "blink" | "steady" | "fade";
}

const TerminalInput: React.FC<TerminalInputProps> = ({
  value,
  onChange,
  onSubmit,
  onClear,
  onKeyNavigation,
  disabled = false,
  inputRef,
  cursorStyle = "fade",
}) => {
  // Special command handling
  const handleCommandSubmit = useCallback(
    (command: string) => {
      if (!command.trim()) {
        return;
      }

      onSubmit(command);
    },
    [onSubmit],
  );

  return (
    <TerminalPrompt
      value={value}
      onChange={onChange}
      onSubmit={handleCommandSubmit}
      onClear={onClear}
      onKeyNavigation={onKeyNavigation}
      disabled={disabled}
      ref={inputRef}
      cursorStyle={cursorStyle}
    />
  );
};

export default React.memo(TerminalInput);
