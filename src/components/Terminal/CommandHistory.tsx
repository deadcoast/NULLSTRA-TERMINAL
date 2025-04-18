import * as React from "react";
const {   useCallback, useEffect, useRef, useState   } = React;

import useLocalStorage from "../../hooks/useLocalStorage";

export interface HistoryCommand {
  command: string;
  timestamp: number;
  category?: string;
  isFavorite?: boolean;
}

interface CommandHistoryProps {
  sessionId: string;
  onCommandSelect: (_command: string) => void;
  onCommandClear?: () => void;
}

// Command categories
const CATEGORIES = [
  { id: "all", name: "All Commands" },
  {
    id: "file",
    name: "File Operations",
    keywords: ["ls", "cd", "mkdir", "rm", "cp", "mv"],
  },
  {
    id: "network",
    name: "Network",
    keywords: ["ping", "curl", "wget", "ssh", "telnet", "netstat"],
  },
  {
    id: "system",
    name: "System",
    keywords: ["ps", "top", "kill", "sudo", "chmod", "chown"],
  },
  {
    id: "search",
    name: "Search",
    keywords: ["grep", "find", "locate", "which"],
  },
  { id: "favorites", name: "Favorites" },
];

// Auto-categorize command based on keywords
const categorizeCommand = (command: string): string => {
  const cmd = command.trim().split(" ")[0];
  for (const category of CATEGORIES) {
    if (
      category.id !== "all" &&
      category.id !== "favorites" &&
      category.keywords?.includes(cmd)
    ) {
      return category.id;
    }
  }
  return "other";
};

const CommandHistory: React.FC<CommandHistoryProps> = ({
  sessionId,
  onCommandSelect,
  onCommandClear,
}) => {
  // Load history from local storage
  const [commandHistory, setCommandHistory] = useLocalStorage<HistoryCommand[]>(
    `terminal-history-${sessionId}`,
    [],
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filter the command history based on search term and category
  const filteredHistory = commandHistory.filter((cmd) => {
    const matchesSearch =
      searchTerm === "" ||
      cmd.command.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      activeCategory === "all" ||
      (activeCategory === "favorites" && cmd.isFavorite) ||
      cmd.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort command history with favorites first, then by timestamp (most recent first)
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return b.timestamp - a.timestamp;
  });

  // Add command to history
  const _addCommand = useCallback(
    (command: string) => {
      if (!command.trim()) return;

      setCommandHistory((prev) => {
        // Check if command already exists in history
        const existingIndex = prev.findIndex((cmd) => cmd.command === command);
        const newHistory = [...prev];

        if (existingIndex !== -1) {
          // Update timestamp of existing command and move to top
          const existing = newHistory.splice(existingIndex, 1)[0];
          return [{ ...existing, timestamp: Date.now() }, ...newHistory];
        } else {
          // Add new command with auto-categorization
          return [
            {
              command,
              timestamp: Date.now(),
              category: categorizeCommand(command),
              isFavorite: false,
            },
            ...newHistory,
          ].slice(0, 200); // Limit history to 200 items
        }
      });
    },
    [setCommandHistory],
  );

  // Toggle favorite status
  const toggleFavorite = (command: string) => {
    setCommandHistory((prev) =>
      prev.map((cmd) =>
        cmd.command === command ? { ...cmd, isFavorite: !cmd.isFavorite } : cmd,
      ),
    );
  };

  // Clear command history
  const clearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear your command history?")
    ) {
      setCommandHistory([]);
      if (onCommandClear) onCommandClear();
    }
  };

  // Close the panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Register keyboard shortcut to open/close history panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+H to toggle history panel
      if (e.altKey && e.key === "h") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Focus the search input when panel opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Short delay to ensure DOM is ready
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 10);
    }
  }, [isOpen]);

  // Handle command selection via keyboard
  const handleCommandSelect = (command: string) => {
    onCommandSelect(command);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        className="history-toggle text-xs bg-night text-lime border border-lime px-2 py-1 rounded"
        onClick={() => setIsOpen(true)}
        title="Show Command History (Alt+H)"
        aria-label="Show Command History"
      >
        History
      </button>
    );
  }

  return (
    <div
      ref={historyRef}
      className="command-history bg-night border border-lime text-lime p-2 rounded absolute right-0 w-96 z-50 shadow-lg"
      style={{ maxHeight: "70vh", overflowY: "auto" }}
    >
      <div className="history-header flex justify-between items-center mb-2 border-b border-lime pb-2">
        <h3 className="text-sm font-bold">Command History</h3>
        <div className="flex space-x-2">
          <button
            className="text-xs opacity-80 hover:opacity-100"
            onClick={clearHistory}
            title="Clear History"
            aria-label="Clear command history"
          >
            Clear
          </button>
          <button
            className="text-xs opacity-80 hover:opacity-100"
            onClick={() => setIsOpen(false)}
            title="Close History (Esc)"
            aria-label="Close history panel"
          >
            Close
          </button>
        </div>
      </div>

      <div className="history-search mb-2">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search commands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-black border border-lime text-lime px-2 py-1 text-sm"
        />
      </div>

      <div className="history-categories flex overflow-x-auto mb-2 text-xs">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            className={`px-2 py-1 mr-1 whitespace-nowrap ${
              activeCategory === category.id
                ? "bg-lime text-night"
                : "bg-night text-lime border border-lime"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="history-list">
        {sortedHistory.length > 0 ? (
          sortedHistory.map((item, index) => (
            <div
              key={`${item.command}-${index}`}
              className="command-item flex justify-between items-center hover:bg-black p-1 rounded cursor-pointer group"
            >
              <button
                className="command-text flex-grow truncate mr-2 text-left"
                onClick={() => handleCommandSelect(item.command)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleCommandSelect(item.command);
                  }
                }}
                title={item.command}
                aria-label={`Run command: ${item.command}`}
              >
                <code className="text-sm">{item.command}</code>
              </button>
              <div className="command-actions flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className={`favorite-btn text-xs ${item.isFavorite ? "text-yellow-400" : "text-gray-400"}`}
                  onClick={() => toggleFavorite(item.command)}
                  title={
                    item.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                  aria-label={
                    item.isFavorite
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  ★
                </button>
                <button
                  className="run-btn text-xs"
                  onClick={() => handleCommandSelect(item.command)}
                  title="Run command"
                  aria-label="Run command"
                >
                  ▶
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400 text-sm">
            {searchTerm || activeCategory !== "all"
              ? "No matching commands in history"
              : "No command history yet"}
          </div>
        )}
      </div>
    </div>
  );
};

// Export component and addCommand utility
export { categorizeCommand, CommandHistory };
export default CommandHistory;
