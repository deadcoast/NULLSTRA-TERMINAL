import { useMemo } from "react";

// LRU Cache for memoizing formatted text
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private readonly capacity: number;

  constructor(capacity: number) {
    this.cache = new Map<K, V>();
    this.capacity = capacity;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Get the value and refresh its position in the cache
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value!);
    return value;
  }

  put(key: K, value: V): void {
    // If key exists, refresh its position
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    // If cache is full, remove oldest entry (first entry in Map)
    else if (this.cache.size >= this.capacity) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }
    this.cache.set(key, value);
  }
}

// Create a global memoization cache with 100 entries
const formattingCache = new LRUCache<string, string>(100);

/**
 * Format terminal output with color highlighting
 * This function is memoized for better performance
 */
export function formatTerminalOutput(text: string): string {
  // Check cache first
  const cachedResult = formattingCache.get(text);
  if (cachedResult) {
    return cachedResult;
  }

  // Expensive formatting operations
  const formatted = text
    // Highlight commands
    .replace(
      /^(\$|\>)\s+(.*)/gm,
      '<span class="text-terminal-command">$1 $2</span>',
    )
    // Highlight file paths
    .replace(
      /(\/([\w\-.]+\/)+[\w\-.]+)/g,
      '<span class="text-terminal-path">$1</span>',
    )
    // Highlight URLs
    .replace(
      /(https?:\/\/[^\s]+)/g,
      '<span class="text-terminal-url">$1</span>',
    )
    // Highlight numbers
    .replace(
      /\b(\d+(\.\d+)?)\b/g,
      '<span class="text-terminal-number">$1</span>',
    );

  // Cache the result
  formattingCache.put(text, formatted);

  return formatted;
}

/**
 * React hook for memoized terminal output formatting
 */
export function useFormattedText(text: string): string {
  return useMemo(() => formatTerminalOutput(text), [text]);
}

/**
 * Parse and format ANSI color codes in terminal output
 * Memoized for better performance
 */
export function parseAnsiColors(text: string): string {
  // Check cache first
  const cachedResult = formattingCache.get(`ansi:${text}`);
  if (cachedResult) {
    return cachedResult;
  }

  // ANSI color code mapping to CSS classes
  const ansiToClass: Record<string, string> = {
    "30": "text-black",
    "31": "text-red-500",
    "32": "text-green-500",
    "33": "text-yellow-500",
    "34": "text-blue-500",
    "35": "text-purple-500",
    "36": "text-cyan-500",
    "37": "text-white",
  };

  // Replace ANSI color codes with styled spans
  const formatted = text.replace(
    /\u001b\[(\d+)m(.*?)(\u001b\[0m|\u001b\[39m)/g,
    (_, code, content) => {
      const className = ansiToClass[code] || "";
      return `<span class="${className}">${content}</span>`;
    },
  );

  // Cache the result
  formattingCache.put(`ansi:${text}`, formatted);

  return formatted;
}

/**
 * React hook for memoized ANSI color parsing
 */
export function useAnsiParsedText(text: string): string {
  return useMemo(() => parseAnsiColors(text), [text]);
}
