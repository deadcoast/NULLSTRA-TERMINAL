import * as React from "react";
const {   useCallback, useEffect, useRef, useState   } = React;
import { FixedSizeList as List, ListOnScrollProps } from "react-window";

import { CommandResult } from "../../hooks/useSocket";
import { TerminalMessage } from "../../utils/terminalCommands/types";

import MessageRenderer from "./MessageRenderer";

// Define a union type that can handle both the original TerminalMessage and the new CommandResult
type MessageType = TerminalMessage | CommandResult;

interface VirtualizedOutputProps {
  messages: MessageType[];
  onExecuteCommand?: (_command: string) => void;
  className?: string;
  suppressHydrationWarning?: boolean;
  height?: number;
  width?: string;
  containerRef?: React.RefObject<HTMLDivElement>;
}

// Use regular function component instead of forwardRef to avoid ref manipulation issues
const VirtualizedOutput: React.FC<VirtualizedOutputProps> = ({
  messages,
  onExecuteCommand,
  className = "",
  suppressHydrationWarning = false,
  height = 400,
  width = "100%",
  containerRef,
}) => {
  const listRef = useRef<List>(null);
  const localRef = useRef<HTMLDivElement>(null);
  const [estimatedItemHeight] = useState(20); // Default height estimation
  const [listHeight, setListHeight] = useState(height);
  const [autoScroll, setAutoScroll] = useState(true);
  const previousMessagesLength = useRef(messages.length);

  // Get the actual ref to use (external container or local)
  const ref = containerRef || localRef;

  // Calculate container height dynamically
  useEffect(() => {
    if (ref.current) {
      const newHeight = ref.current.clientHeight;
      if (newHeight > 0) {
        setListHeight(newHeight);
      }
    }
  }, [ref]);

  // Handle auto-scrolling when new messages are added
  useEffect(() => {
    if (
      autoScroll &&
      listRef.current &&
      messages.length > previousMessagesLength.current
    ) {
      listRef.current.scrollToItem(messages.length - 1, "end");
    }
    previousMessagesLength.current = messages.length;
  }, [messages, autoScroll]);

  // Item renderer for virtualized list
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const message = messages[index];

      return (
        <div
          style={style}
          suppressHydrationWarning={suppressHydrationWarning}
          className="mb-1 relative z-10"
        >
          <MessageRenderer
            message={message as TerminalMessage}
            onExecuteCommand={onExecuteCommand}
          />
        </div>
      );
    },
    [messages, onExecuteCommand, suppressHydrationWarning],
  );

  // Store scroll information for auto-scroll detection
  const scrollInfo = useRef({
    scrollOffset: 0,
    listHeight: 0,
    contentHeight: 0,
  });

  // Handle manual scrolling to detect when user scrolls up (to disable auto-scroll)
  const handleScroll = useCallback(
    ({ scrollOffset, scrollUpdateWasRequested }: ListOnScrollProps) => {
      // Only update auto-scroll when user is manually scrolling (not programmatic scrolls)
      if (!scrollUpdateWasRequested) {
        // Get total content height (itemCount * itemSize)
        const contentHeight = messages.length * estimatedItemHeight;
        const visibleHeight = listHeight;

        // Store scroll info for reference
        scrollInfo.current = {
          scrollOffset,
          listHeight: visibleHeight,
          contentHeight,
        };

        // If we're near the bottom, enable auto-scroll
        // If we're scrolled up, disable auto-scroll
        const isAtBottom = contentHeight - scrollOffset - visibleHeight < 50;
        setAutoScroll(isAtBottom);
      }
    },
    [messages.length, estimatedItemHeight, listHeight],
  );

  return (
    <div
      className={`terminal-output flex-grow overflow-hidden mb-1 text-xs leading-tight pr-1 ${className}`}
      ref={localRef}
      suppressHydrationWarning={suppressHydrationWarning}
    >
      <div className="crt-glow opacity-50 pointer-events-none absolute inset-0"></div>
      {Array.isArray(messages) && messages.length > 0 ? (
        <List
          ref={listRef}
          height={listHeight}
          width={width}
          itemCount={messages.length}
          itemSize={estimatedItemHeight}
          onScroll={handleScroll}
          className="scrollbar-thin"
        >
          {Row}
        </List>
      ) : (
        <div className="text-terminal-gray">No output to display</div>
      )}
    </div>
  );
};

export default React.memo(VirtualizedOutput);
