/**
 * 1. Add keyboard navigation support for selecting suggestions using arrow keys.
2. Implement a debounce function to optimize rendering of suggestions based on user input.
3. Allow for customizable suggestion item rendering to enhance flexibility.
 */
import React from 'react';

interface SuggestionListProps {
  suggestions: string[];
  activeSuggestion: number;
  onSelect: (index: number) => void;
  isCommand?: boolean;
}

const SuggestionList: React.FC<SuggestionListProps> = ({
  suggestions,
  activeSuggestion,
  onSelect,
  isCommand = true,
}) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="suggestion-list absolute left-0 right-0 z-10 mt-1 bg-terminal-black border border-terminal-green rounded overflow-hidden max-h-40 overflow-y-auto">
      <ul className="py-1">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className={`
              px-3 py-1 text-xs cursor-pointer
              ${index === activeSuggestion ? 'bg-terminal-green text-terminal-black' : 'text-terminal-white'}
              ${isCommand ? 'font-bold' : ''}
              hover:bg-terminal-green hover:text-terminal-black
            `}
            onClick={() => onSelect(index)}
          >
            {/* Show icon based on type */}
            <span className="mr-2">
              {isCommand ? '▶' : suggestion.endsWith('/') ? '📁' : '📄'}
            </span>
            {suggestion}

            {/* Display command description if available */}
            {isCommand && index === activeSuggestion && (
              <span className="ml-2 opacity-70 font-normal">
                {/* Command description would go here */}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuggestionList;
