import * as React from "react";
const {   useEffect, useRef, useState   } = React;

import { CommandResult } from "../../hooks/useSocket";

import { SplitDirection } from "./SplitPane";

// Define tab colors for custom color coding
export const TAB_COLORS = {
  default: "border-lime text-lime",
  success: "border-green-400 text-green-400",
  error: "border-red-400 text-red-400",
  warning: "border-yellow-400 text-yellow-400",
  info: "border-blue-400 text-blue-400",
  purple: "border-purple-400 text-purple-400",
  cyan: "border-cyan-400 text-cyan-400",
  pink: "border-pink-400 text-pink-400",
};

export type TabColorKey = keyof typeof TAB_COLORS;

export interface TerminalTabData {
  id: string;
  name: string;
  ipAddress: string;
  initialMessages?: CommandResult[];
  color?: TabColorKey;
  split?: {
    enabled: boolean;
    direction: SplitDirection;
    secondaryIpAddress?: string;
  };
}

interface TerminalTabsProps {
  tabs: TerminalTabData[];
  activeTabId: string;
  maxTabs: number;
  onTabSelect: (id: string) => void;
  onTabClose: (id: string) => void;
  onTabCreate: () => void;
  onTabColorChange: (id: string, color: TabColorKey) => void;
  onTabRename: (id: string, name: string) => void;
  onReorderTabs: (newTabs: TerminalTabData[]) => void;
}

const TerminalTabs: React.FC<TerminalTabsProps> = ({
  tabs,
  activeTabId,
  maxTabs,
  onTabSelect,
  onTabClose,
  onTabCreate,
  onTabColorChange,
  onTabRename,
  onReorderTabs,
}) => {
  const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingTabName, setEditingTabName] = useState("");
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);
  const draggedNodeRef = useRef<HTMLDivElement | null>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Register keyboard shortcuts for tab navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Tab to cycle through tabs
      if (e.ctrlKey && e.key === "Tab") {
        e.preventDefault();
        const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);
        const nextTabIndex = (currentTabIndex + 1) % tabs.length;
        onTabSelect(tabs[nextTabIndex].id);
      }

      // Ctrl+Shift+Tab to cycle through tabs in reverse
      if (e.ctrlKey && e.shiftKey && e.key === "Tab") {
        e.preventDefault();
        const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTabId);
        const nextTabIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
        onTabSelect(tabs[nextTabIndex].id);
      }

      // Ctrl+T to create new tab
      if (e.ctrlKey && e.key === "t" && tabs.length < maxTabs) {
        e.preventDefault();
        onTabCreate();
      }

      // Ctrl+W to close current tab
      if (e.ctrlKey && e.key === "w" && tabs.length > 1) {
        e.preventDefault();
        onTabClose(activeTabId);
      }

      // Alt+1, Alt+2, etc. to select specific tabs
      if (e.altKey && !isNaN(parseInt(e.key))) {
        const tabIndex = parseInt(e.key) - 1;
        if (tabIndex >= 0 && tabIndex < tabs.length) {
          e.preventDefault();
          onTabSelect(tabs[tabIndex].id);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [tabs, activeTabId, maxTabs, onTabSelect, onTabClose, onTabCreate]);

  // Handle drag and drop functionality
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    tabId: string,
  ) => {
    e.dataTransfer.effectAllowed = "move";
    // Store a reference to the dragged node
    draggedNodeRef.current = e.currentTarget;
    setDraggedTabId(tabId);
    // Make a ghost image
    if (draggedNodeRef.current) {
      setTimeout(() => {
        if (draggedNodeRef.current) {
          draggedNodeRef.current.style.opacity = "0.4";
        }
      }, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    return false;
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    targetTabId: string,
  ) => {
    if (draggedTabId && draggedTabId !== targetTabId) {
      // Reorder tabs in UI
      const draggedIndex = tabs.findIndex((tab) => tab.id === draggedTabId);
      const targetIndex = tabs.findIndex((tab) => tab.id === targetTabId);
      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newTabs = [...tabs];
        const [draggedTab] = newTabs.splice(draggedIndex, 1);
        newTabs.splice(targetIndex, 0, draggedTab);
        onReorderTabs(newTabs);
      }
    }
  };

  const handleDragEnd = () => {
    if (draggedNodeRef.current) {
      draggedNodeRef.current.style.opacity = "1";
    }
    draggedNodeRef.current = null;
    setDraggedTabId(null);
  };

  // Double click to edit tab name
  const handleDoubleClick = (tabId: string, currentName: string) => {
    setEditingTabId(tabId);
    setEditingTabName(currentName);
  };

  const handleTabRename = () => {
    if (editingTabId && editingTabName.trim()) {
      onTabRename(editingTabId, editingTabName);
      setEditingTabId(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTabRename();
    } else if (e.key === "Escape") {
      setEditingTabId(null);
    }
  };

  return (
    <div
      ref={tabsRef}
      className="terminal-tabs flex bg-night border-b border-shocking-pink text-xs justify-between overflow-x-auto"
    >
      <div className="flex">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            draggable={true}
            onDragStart={(e) => handleDragStart(e, tab.id)}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, tab.id)}
            onDragEnd={handleDragEnd}
            className={`
              terminal-tab cursor-pointer py-1 px-3 mr-1 flex items-center
              ${
                tab.id === activeTabId
                  ? "bg-lime text-night font-bold"
                  : `bg-night ${tab.color ? TAB_COLORS[tab.color] : TAB_COLORS.default}`
              }
              ${draggedTabId === tab.id ? "opacity-40" : ""}
            `}
            onClick={() => onTabSelect(tab.id)}
            onDoubleClick={() => handleDoubleClick(tab.id, tab.name)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                onTabSelect(tab.id);
                e.preventDefault();
              }
            }}
            role="tab"
            tabIndex={0}
            aria-selected={tab.id === activeTabId}
          >
            <span className="mr-2 select-none">
              {tab.id === activeTabId ? "⚡" : "•"}
            </span>

            {editingTabId === tab.id ? (
              <input
                type="text"
                value={editingTabName}
                onChange={(e) => setEditingTabName(e.target.value)}
                onBlur={handleTabRename}
                onKeyDown={handleKeyPress}
                className="bg-night text-lime border border-lime px-1 w-24"
                autoFocus
              />
            ) : (
              <>
                <span>{tab.name}</span>

                {/* Tab Controls */}
                <div className="ml-2 flex items-center">
                  {/* Color picker button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowColorPicker(
                        showColorPicker === tab.id ? null : tab.id,
                      );
                    }}
                    className="mx-1 opacity-70 hover:opacity-100"
                    aria-label="Change tab color"
                    title="Change tab color"
                  >
                    <span className="w-2 h-2 inline-block rounded-full bg-current" />
                  </button>

                  {/* Close button */}
                  {tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTabClose(tab.id);
                      }}
                      className="opacity-70 hover:opacity-100"
                      aria-label={`Close ${tab.name}`}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Color picker dropdown */}
                {showColorPicker === tab.id && (
                  <div className="absolute mt-6 bg-night border border-lime p-1 z-50 rounded shadow-lg">
                    <div className="grid grid-cols-4 gap-1">
                      {Object.entries(TAB_COLORS).map(([color, classes]) => (
                        <button
                          key={color}
                          onClick={(e) => {
                            e.stopPropagation();
                            onTabColorChange(tab.id, color as TabColorKey);
                            setShowColorPicker(null);
                          }}
                          className={`w-5 h-5 rounded-full ${classes.replace("text", "bg").replace("-400", "-500")}`}
                          aria-label={`Set tab color to ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {/* Add Tab Button */}
        {tabs.length < maxTabs && (
          <button
            className="terminal-tab-add py-1 px-2 text-lime hover:text-white"
            onClick={onTabCreate}
            aria-label="Create new terminal (Ctrl+T)"
            title="Create new terminal (Ctrl+T)"
          >
            + New Terminal
          </button>
        )}
      </div>
    </div>
  );
};

export default TerminalTabs;
