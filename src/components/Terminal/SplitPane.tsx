import type { ReactNode } from "react";
import * as React from "react";
const { useEffect, useRef, useState } = React;

export type SplitDirection = "horizontal" | "vertical";

export interface SplitPaneProps {
  direction: SplitDirection;
  children: [ReactNode, ReactNode]; // Exactly two children are required
  defaultSizes?: [number, number]; // Default sizes in percentages
  minSize?: number; // Minimum size in pixels
  className?: string;
  syncScroll?: boolean; // Whether to sync scrolling between panes
}

const SplitPane: React.FC<SplitPaneProps> = ({
  direction,
  children,
  defaultSizes = [50, 50],
  minSize = 100,
  className = "",
  syncScroll = false,
}) => {
  const [sizes, setSizes] = useState<[number, number]>(defaultSizes);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLButtonElement>(null);
  const pane1Ref = useRef<HTMLDivElement>(null);
  const pane2Ref = useRef<HTMLDivElement>(null);
  const startPosRef = useRef<number>(0);
  const initialSizesRef = useRef<[number, number]>(defaultSizes);

  // Handle scroll synchronization if enabled
  useEffect(() => {
    if (!syncScroll || !pane1Ref.current || !pane2Ref.current) return;

    const pane1 = pane1Ref.current;
    const pane2 = pane2Ref.current;

    const handleScroll = (e: Event) => {
      const source = e.target as HTMLElement;
      const target = source === pane1 ? pane2 : pane1;

      if (direction === "horizontal") {
        target.scrollTop = source.scrollTop;
      } else {
        target.scrollLeft = source.scrollLeft;
      }
    };

    pane1.addEventListener("scroll", handleScroll);
    pane2.addEventListener("scroll", handleScroll);

    return () => {
      pane1.removeEventListener("scroll", handleScroll);
      pane2.removeEventListener("scroll", handleScroll);
    };
  }, [syncScroll, direction]);

  // Start resizing when mouse down on divider
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    setIsResizing(true);
    startPosRef.current = direction === "horizontal" ? e.clientX : e.clientY;
    initialSizesRef.current = sizes;

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // Handle mouse movement during resize
  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerSize =
      direction === "horizontal" ? containerRect.width : containerRect.height;
    const currentPos = direction === "horizontal" ? e.clientX : e.clientY;
    const startPos = startPosRef.current;
    const initialSizes = initialSizesRef.current;

    // Calculate delta movement as percentage of container size
    const deltaPercentage = ((currentPos - startPos) / containerSize) * 100;

    // Calculate new sizes ensuring they don't go below minSize
    const containerSizePx =
      direction === "horizontal" ? containerRect.width : containerRect.height;
    const minSizePercentage = (minSize / containerSizePx) * 100;

    let newSize1 = initialSizes[0] + deltaPercentage;
    let newSize2 = initialSizes[1] - deltaPercentage;

    // Enforce minimum sizes
    if (newSize1 < minSizePercentage) {
      newSize1 = minSizePercentage;
      newSize2 = 100 - minSizePercentage;
    } else if (newSize2 < minSizePercentage) {
      newSize2 = minSizePercentage;
      newSize1 = 100 - minSizePercentage;
    }

    setSizes([newSize1, newSize2]);
  };

  // Cleanup event listeners on mouse up
  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Handle keyboard resizing for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key))
      return;

    e.preventDefault();
    const step = 2; // Percentage step for keyboard adjustment
    const currentSizes = [...sizes] as [number, number];

    if (direction === "horizontal") {
      if (e.key === "ArrowLeft") {
        currentSizes[0] = Math.max(currentSizes[0] - step, minSize);
        currentSizes[1] = 100 - currentSizes[0];
      } else if (e.key === "ArrowRight") {
        currentSizes[0] = Math.min(currentSizes[0] + step, 100 - minSize);
        currentSizes[1] = 100 - currentSizes[0];
      }
    } else if (e.key === "ArrowUp") {
      currentSizes[0] = Math.max(currentSizes[0] - step, minSize);
      currentSizes[1] = 100 - currentSizes[0];
    } else if (e.key === "ArrowDown") {
      currentSizes[0] = Math.min(currentSizes[0] + step, 100 - minSize);
      currentSizes[1] = 100 - currentSizes[0];
    }

    setSizes(currentSizes);
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: direction === "horizontal" ? "row" : "column",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "relative",
  };

  const dividerStyle: React.CSSProperties = {
    background: "rgba(120, 255, 180, 0.3)",
    [direction === "horizontal" ? "width" : "height"]: "4px",
    cursor: direction === "horizontal" ? "col-resize" : "row-resize",
    position: "relative",
    flexShrink: 0,
    zIndex: 10,
    userSelect: "none",
    padding: 0,
    border: "none",
    margin: 0,
  };

  const pane1Style: React.CSSProperties = {
    [direction === "horizontal" ? "width" : "height"]: `${sizes[0]}%`,
    overflow: "auto",
  };

  const pane2Style: React.CSSProperties = {
    [direction === "horizontal" ? "width" : "height"]: `${sizes[1]}%`,
    overflow: "auto",
  };

  return (
    <div
      ref={containerRef}
      className={`split-pane ${className}`}
      style={containerStyle}
    >
      <div ref={pane1Ref} className="split-pane-first" style={pane1Style}>
        {children[0]}
      </div>
      <button
        ref={dividerRef}
        className="split-pane-divider"
        style={dividerStyle}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        aria-label={`${
          direction === "horizontal" ? "Horizontal" : "Vertical"
        } resize handle. Use arrow keys to resize.`}
        type="button"
        title={`Drag to resize ${
          direction === "horizontal" ? "horizontally" : "vertically"
        }`}
      >
        <span className="sr-only">
          Resize panes ({sizes[0].toFixed(0)}% - {sizes[1].toFixed(0)}%)
        </span>
      </button>
      <div ref={pane2Ref} className="split-pane-second" style={pane2Style}>
        {children[1]}
      </div>
    </div>
  );
};

export default SplitPane;
