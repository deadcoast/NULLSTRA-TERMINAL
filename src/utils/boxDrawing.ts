/**
 * Box Drawing Utilities
 * Contains box-drawing characters and helper functions for creating terminal UI frames
 */

// Box-drawing characters collection for terminal frames
export const BOX_CHARS = {
  // Single Line
  TL: "┌", // Top Left
  TR: "┐", // Top Right
  BL: "└", // Bottom Left
  BR: "┘", // Bottom Right
  HZ: "─", // Horizontal
  VT: "│", // Vertical
  LT: "├", // Left Tee
  RT: "┤", // Right Tee
  TT: "┬", // Top Tee
  BT: "┴", // Bottom Tee
  // Double Line (Used in Button/Line Numbers)
  DVT: "║", // Double Vertical
  DTL: "╔", // Double Top Left
  DTR: "╗", // Double Top Right
  DBL: "╚", // Double Bottom Left
  DBR: "╝", // Double Bottom Right
  // Mixed Single/Double (Used in Button/Line Numbers)
  LTD: "╠", // VT-Double HZ Left Tee
  RTD: "╣", // VT-Double HZ Right Tee
  DHLT: "╦", // Double HZ-VT Top Tee
  DHBT: "╩", // Double HZ-VT Bottom Tee
  // Mixed Double/Single
  DLT: "╟", // Double VT-HZ Left Tee
  DRT: "╢", // Double VT-HZ Right Tee
  TTD: "╤", // Top Tee Double Vertical
  BTD: "╧", // Bottom Tee Double Vertical
};

/**
 * Cache store for horizontal line calculations
 * Key format: `${width}-${leftChar}-${middleChar}-${rightChar}`
 */
const horizontalLineCache = new Map<string, string>();

/**
 * Cache store for content line calculations
 * Key format: `${content}-${width}-${leftChar}-${rightChar}-${padding}`
 */
const contentLineCache = new Map<string, string>();

/**
 * Cache store for padded line calculations
 * Key format: `${line}-${width}-${rightChar}`
 */
const paddedLineCache = new Map<string, string>();

/**
 * Cache size limits to prevent memory leaks
 */
const CACHE_LIMITS = {
  horizontalLine: 500,
  contentLine: 500,
  paddedLine: 500,
};

/**
 * Adds an item to a cache Map with size limit enforcement
 */
function addToCache<K, V>(
  cache: Map<K, V>,
  key: K,
  value: V,
  limit: number,
): void {
  // If we're at the limit, remove the oldest entry (first in the map)
  if (cache.size >= limit) {
    const keys = Array.from(cache.keys());
    if (keys.length > 0) {
      cache.delete(keys[0]);
    }
  }

  // Add the new item
  cache.set(key, value);
}

/**
 * Creates a horizontal line with given width and characters
 * @param width - Total width of the line
 * @param leftChar - Left edge character
 * @param middleChar - Repeating middle character
 * @param rightChar - Right edge character
 * @returns Formatted horizontal line
 */
export function createHorizontalLine(
  width: number,
  leftChar: string = BOX_CHARS.LT,
  middleChar: string = BOX_CHARS.HZ,
  rightChar: string = BOX_CHARS.RT,
): string {
  // Create cache key
  const cacheKey = `${width}-${leftChar}-${middleChar}-${rightChar}`;

  // Check cache first
  if (horizontalLineCache.has(cacheKey)) {
    return horizontalLineCache.get(cacheKey)!;
  }

  // Calculate line
  const result = leftChar + middleChar.repeat(width - 2) + rightChar;

  // Cache the result
  addToCache(
    horizontalLineCache,
    cacheKey,
    result,
    CACHE_LIMITS.horizontalLine,
  );

  return result;
}

/**
 * Creates a content line with text between vertical borders
 * @param content - The text content for the line
 * @param width - Total width of the line
 * @param leftChar - Left border character
 * @param rightChar - Right border character
 * @param padding - Optional padding to add before and after content
 * @returns Formatted content line
 */
export function createContentLine(
  content: string,
  width: number,
  leftChar: string = BOX_CHARS.VT,
  rightChar: string = BOX_CHARS.VT,
  padding: number = 1,
): string {
  // Create cache key
  const cacheKey = `${content}-${width}-${leftChar}-${rightChar}-${padding}`;

  // Check cache first
  if (contentLineCache.has(cacheKey)) {
    return contentLineCache.get(cacheKey)!;
  }

  // Calculate padded content
  const paddingStr = " ".repeat(padding);
  const innerWidth = width - leftChar.length - rightChar.length - padding * 2;
  const paddedContent = content.padEnd(innerWidth, " ");
  const result = leftChar + paddingStr + paddedContent + paddingStr + rightChar;

  // Cache the result
  addToCache(contentLineCache, cacheKey, result, CACHE_LIMITS.contentLine);

  return result;
}

/**
 * Pads a line to a specified width with optional right character
 * @param line - The line to pad
 * @param width - Total width of the line
 * @param rightChar - Character to place at the end
 * @returns Padded line
 */
export function padLine(
  line: string,
  width: number,
  rightChar: string = BOX_CHARS.VT,
): string {
  // Create cache key
  const cacheKey = `${line}-${width}-${rightChar}`;

  // Check cache first
  if (paddedLineCache.has(cacheKey)) {
    return paddedLineCache.get(cacheKey)!;
  }

  // Calculate padded line
  const result = line.padEnd(width - rightChar.length, " ") + rightChar;

  // Cache the result
  addToCache(paddedLineCache, cacheKey, result, CACHE_LIMITS.paddedLine);

  return result;
}

/**
 * Adds a leading prefix to a line
 * @param line - The line to prefix
 * @param prefix - The prefix string
 * @returns Prefixed line
 */
export function prefixLine(line: string, prefix: string = "  "): string {
  return prefix + line;
}

/**
 * Clear all caches - useful for testing or specific reset scenarios
 */
export function clearBoxDrawingCaches(): void {
  horizontalLineCache.clear();
  contentLineCache.clear();
  paddedLineCache.clear();
}

/**
 * Get cache statistics - useful for debugging and monitoring
 */
export function getBoxDrawingCacheStats(): {
  horizontalLineCount: number;
  contentLineCount: number;
  paddedLineCount: number;
} {
  return {
    horizontalLineCount: horizontalLineCache.size,
    contentLineCount: contentLineCache.size,
    paddedLineCount: paddedLineCache.size,
  };
}

export default {
  BOX_CHARS,
  createHorizontalLine,
  createContentLine,
  padLine,
  prefixLine,
  clearBoxDrawingCaches,
  getBoxDrawingCacheStats,
};
