import React, { useEffect, useRef, useState } from "react";

interface AdvancedInputProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  autoComplete?: boolean;
  suggestions?: string[];
  history?: string[];
  className?: string;
}

const AdvancedInput: React.FC<AdvancedInputProps> = ({
  value = "",
  onChange,
  onSubmit,
  placeholder = "Type a command...",
  autoFocus = true,
  autoComplete = true,
  suggestions = [],
  history = [],
  className = "",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Handle value changes from props
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter suggestions based on current input
  const filteredSuggestions = autoComplete
    ? suggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(inputValue.toLowerCase()),
      )
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(true);

    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle history navigation (up/down arrows)
    if (e.key === "ArrowUp" && history.length > 0) {
      e.preventDefault();
      const newIndex =
        historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(newIndex);
      setInputValue(history[newIndex] || "");
    } else if (e.key === "ArrowDown" && historyIndex >= 0) {
      e.preventDefault();
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setInputValue(newIndex >= 0 ? history[newIndex] : "");
    }

    // Handle tab completion
    else if (
      e.key === "Tab" &&
      autoComplete &&
      filteredSuggestions.length > 0
    ) {
      e.preventDefault();
      setInputValue(filteredSuggestions[0]);
      setShowSuggestions(false);
    }

    // Handle command submission
    else if (e.key === "Enter" && onSubmit) {
      e.preventDefault();
      onSubmit(inputValue);
      setInputValue("");
      setHistoryIndex(-1);
      setShowSuggestions(false);
    }

    // Hide suggestions on escape
    else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`advanced-input ${className}`}>
      <div className="input-container">
        <span className="prompt">$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="terminal-input"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="suggestions">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              className="suggestion-item"
              onClick={() => {
                setInputValue(suggestion);
                setShowSuggestions(false);
                inputRef.current?.focus();
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvancedInput;
