import * as React from "react";
const {   useEffect, useRef, useState   } = React;
import { createPortal } from "react-dom";
import { createFocusTrap } from "../../utils/accessibility";

export interface ShortcutCategory {
  name: string;
  shortcuts: Shortcut[];
}

export interface Shortcut {
  keys: string[];
  description: string;
  category: string;
}

const DEFAULT_SHORTCUTS: ShortcutCategory[] = [
  {
    name: "Terminal Navigation",
    shortcuts: [
      {
        keys: ["Tab"],
        description: "Move focus to next interactive element",
        category: "navigation",
      },
      {
        keys: ["Shift", "Tab"],
        description: "Move focus to previous interactive element",
        category: "navigation",
      },
      {
        keys: ["Ctrl", "Tab"],
        description: "Switch to next terminal tab",
        category: "navigation",
      },
      {
        keys: ["Ctrl", "Shift", "Tab"],
        description: "Switch to previous terminal tab",
        category: "navigation",
      },
      {
        keys: ["Alt", "1-9"],
        description: "Switch to specific terminal tab",
        category: "navigation",
      },
    ],
  },
  {
    name: "Tab Management",
    shortcuts: [
      {
        keys: ["Ctrl", "T"],
        description: "Create new terminal tab",
        category: "tabs",
      },
      {
        keys: ["Ctrl", "W"],
        description: "Close current terminal tab",
        category: "tabs",
      },
      {
        keys: ["Alt", "Shift", "H"],
        description: "Split terminal horizontally",
        category: "tabs",
      },
      {
        keys: ["Alt", "Shift", "V"],
        description: "Split terminal vertically",
        category: "tabs",
      },
    ],
  },
  {
    name: "Command History",
    shortcuts: [
      {
        keys: ["Alt", "H"],
        description: "Show command history",
        category: "history",
      },
      {
        keys: ["↑"],
        description: "Navigate to previous command",
        category: "history",
      },
      {
        keys: ["↓"],
        description: "Navigate to next command",
        category: "history",
      },
      {
        keys: ["Ctrl", "R"],
        description: "Search command history",
        category: "history",
      },
    ],
  },
  {
    name: "Text Selection",
    shortcuts: [
      {
        keys: ["Alt", "R"],
        description: "Toggle selection mode (normal/rectangular/smart)",
        category: "selection",
      },
      {
        keys: ["Alt", "C"],
        description: "Copy selected text",
        category: "selection",
      },
    ],
  },
  {
    name: "Accessibility",
    shortcuts: [
      {
        keys: ["Ctrl", "/"],
        description: "Show keyboard shortcuts",
        category: "accessibility",
      },
      {
        keys: ["Alt", "A"],
        description: "Open accessibility settings",
        category: "accessibility",
      },
      {
        keys: ["Escape"],
        description: "Close any open dialog or menu",
        category: "accessibility",
      },
    ],
  },
];

interface KeyboardShortcutsProps {
  customShortcuts?: ShortcutCategory[];
  isOpen?: boolean;
  onClose: () => void;
}

const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
  customShortcuts,
  isOpen = false,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const shortcuts = customShortcuts || DEFAULT_SHORTCUTS;

  // Get all categories
  const categories = shortcuts.map((cat) => cat.name);

  // Handle search filtering
  const filteredShortcuts = shortcuts
    .map((category) => {
      // If a category is selected and it's not this one, return empty
      if (activeCategory && activeCategory !== category.name) {
        return { ...category, shortcuts: [] };
      }

      // Filter shortcuts by search term
      const filtered = category.shortcuts.filter(
        (shortcut) =>
          searchTerm === "" ||
          shortcut.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          shortcut.keys.some((key) =>
            key.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );

      return { ...category, shortcuts: filtered };
    })
    .filter((category) => category.shortcuts.length > 0);

  // Focus trap for accessibility
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const focusTrap = createFocusTrap(modalRef.current);
    focusTrap.activate();

    return () => {
      focusTrap.deactivate();
    };
  }, [isOpen]);

  // Register keyboard shortcut to show/hide
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+/ to toggle keyboard shortcuts
      if (e.ctrlKey && e.key === "/") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }

      // Close on Escape
      if (isOpen && e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-dialog-title"
    >
      <div
        ref={modalRef}
        className="bg-night border-2 border-lime text-lime rounded-lg w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        <div className="shortcuts-header border-b border-lime p-4 flex justify-between items-center sticky top-0 bg-night z-10">
          <h2 id="shortcuts-dialog-title" className="text-xl font-bold">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className="text-lime hover:text-white"
            aria-label="Close keyboard shortcuts"
          >
            ✕
          </button>
        </div>

        <div className="shortcuts-search border-b border-lime p-4 bg-night sticky top-16 z-10">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search shortcuts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black text-lime border border-lime px-3 py-2 rounded"
                aria-label="Search keyboard shortcuts"
              />
            </div>
            <div className="category-filters flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveCategory(null)}
                className={`text-xs px-2 py-1 rounded ${
                  activeCategory === null
                    ? "bg-lime text-night"
                    : "bg-night text-lime border border-lime"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() =>
                    setActiveCategory(
                      category === activeCategory ? null : category,
                    )
                  }
                  className={`text-xs px-2 py-1 rounded whitespace-nowrap ${
                    activeCategory === category
                      ? "bg-lime text-night"
                      : "bg-night text-lime border border-lime"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="shortcuts-content p-4 overflow-auto flex-grow">
          {filteredShortcuts.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              No shortcuts found matching your search.
            </div>
          ) : (
            filteredShortcuts.map((category) => (
              <div key={category.name} className="category-section mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-lime border-opacity-30 pb-1">
                  {category.name}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
                  {category.shortcuts.map((shortcut, index) => (
                    <div
                      key={index}
                      className="shortcut-item flex items-center py-1"
                    >
                      <div className="shortcut-keys flex mr-3">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="bg-black border border-lime text-lime px-2 py-1 rounded text-xs font-mono">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="mx-1 text-gray-400">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <div className="shortcut-description text-sm">
                        {shortcut.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="shortcuts-footer border-t border-lime p-4 bg-night flex justify-between items-center">
          <div className="text-xs text-gray-400">
            Press{" "}
            <kbd className="bg-black border border-lime text-lime px-2 py-1 rounded text-xs font-mono mx-1">
              Ctrl
            </kbd>
            +
            <kbd className="bg-black border border-lime text-lime px-2 py-1 rounded text-xs font-mono mx-1">
              /
            </kbd>{" "}
            anywhere to toggle this dialog
          </div>
          <button
            onClick={onClose}
            className="bg-lime text-night px-4 py-2 rounded font-medium hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default KeyboardShortcuts;
