/**
 * Socket.IO Optimization Utilities
 *
 * This module provides utilities for optimizing Socket.IO connections
 * with data chunking, binary protocols, and pagination for large data transfers.
 */

import type { Socket } from "socket.io-client";

/**
 * Options for the optimized socket
 */
export interface SocketOptimizerOptions {
  /** Enable binary protocol for appropriate data */
  enableBinaryProtocol?: boolean;
  /** Page size for paginated data */
  pageSize?: number;
  /** Debounce time for rapid messages (ms) */
  debounceTime?: number;
  /** Batch size for message batching */
  batchSize?: number;
}

/**
 * Default options for socket optimizer
 */
const DEFAULT_OPTIONS: SocketOptimizerOptions = {
  enableBinaryProtocol: true,
  pageSize: 100,
  debounceTime: 50,
  batchSize: 10,
};

/**
 * Page information for paginated data
 */
export interface PageInfo {
  page: number;
  totalPages: number;
  totalItems: number;
  hasMore: boolean;
}

/**
 * SocketIO message batcher to reduce network overhead
 */
export class MessageBatcher {
  private socket: Socket;
  private batchSize: number;
  private debounceTime: number;
  private batches: Record<string, any[]> = {};
  private timers: Record<string, NodeJS.Timeout> = {};

  /**
   * Create a new message batcher
   */
  constructor(socket: Socket, batchSize = 10, debounceTime = 50) {
    this.socket = socket;
    this.batchSize = batchSize;
    this.debounceTime = debounceTime;
  }

  /**
   * Add a message to a batch queue
   */
  public add(event: string, data: any): void {
    // Initialize batch if needed
    if (!this.batches[event]) {
      this.batches[event] = [];
    }

    // Add to batch
    this.batches[event].push(data);

    // Clear existing timer
    if (this.timers[event]) {
      clearTimeout(this.timers[event]);
    }

    // If batch is full, send immediately
    if (this.batches[event].length >= this.batchSize) {
      this.flush(event);
      return;
    }

    // Otherwise, set debounce timer
    this.timers[event] = setTimeout(() => {
      this.flush(event);
    }, this.debounceTime);
  }

  /**
   * Flush a specific event batch
   */
  public flush(event: string): void {
    if (!this.batches[event] || this.batches[event].length === 0) {
      return;
    }

    // Send batched messages
    this.socket.emit(`batch:${event}`, this.batches[event]);

    // Reset batch
    this.batches[event] = [];

    // Clear timer
    if (this.timers[event]) {
      clearTimeout(this.timers[event]);
      delete this.timers[event];
    }
  }

  /**
   * Flush all batches
   */
  public flushAll(): void {
    for (const event in this.batches) {
      this.flush(event);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    for (const event in this.timers) {
      if (this.timers[event]) {
        clearTimeout(this.timers[event]);
      }
    }
    this.batches = {};
    this.timers = {};
  }

  /**
   * Set up a batch listener
   */
  public setupBatchListener<T>(
    event: string,
    callback: (data: T) => void,
  ): void {
    this.socket.on(`batch:${event}`, (...args: unknown[]) => {
      const batchData = args[0] as T[];
      for (const item of batchData) {
        callback(item);
      }
    });
  }
}

/**
 * Paginated data handler for large datasets
 */
export class PaginatedDataHandler<T = any> {
  private socket: Socket;
  private eventName: string;
  private pageSize: number;

  /**
   * Create a new paginated data handler
   */
  constructor(socket: Socket, eventName: string, pageSize = 100) {
    this.socket = socket;
    this.eventName = eventName;
    this.pageSize = pageSize;
  }

  /**
   * Send data with pagination
   */
  public sendPaginated(data: T[]): void {
    if (!data || data.length === 0) {
      this.socket.emit(this.eventName, { data: [], complete: true });
      return;
    }

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / this.pageSize);

    // Send data in pages
    for (let page = 0; page < totalPages; page++) {
      const start = page * this.pageSize;
      const end = Math.min(start + this.pageSize, totalItems);
      const pageData = data.slice(start, end);

      this.socket.emit(`page:${this.eventName}`, {
        data: pageData,
        pageInfo: {
          page,
          totalPages,
          totalItems,
          hasMore: page < totalPages - 1,
          isLastPage: page === totalPages - 1,
        },
      });
    }
  }

  /**
   * Listen for paginated data
   */
  public onPaginated(
    callback: (data: T[], pageInfo: PageInfo) => void,
    onComplete?: (allData: T[]) => void,
  ): void {
    const allData: T[] = [];
    const receivedPages = new Set<number>();
    let totalExpectedPages = -1;

    this.socket.on(`page:${this.eventName}`, (...args: unknown[]) => {
      const payload = args[0] as { data: T[]; pageInfo: PageInfo };
      const { data, pageInfo } = payload;
      const { page, totalPages } = pageInfo;

      // Store page data
      allData.push(...data);
      receivedPages.add(page);
      totalExpectedPages = totalPages;

      // Call the callback with the current page
      callback(data, pageInfo);

      // Check if all pages have been received
      if (receivedPages.size === totalExpectedPages && onComplete) {
        onComplete(allData);
      }
    });
  }
}

/**
 * Socket.IO optimization utilities
 */
export const SocketOptimizers = {
  /**
   * Create a message batcher
   */
  createBatcher(
    socket: Socket,
    batchSize?: number,
    debounceTime?: number,
  ): MessageBatcher {
    return new MessageBatcher(
      socket,
      batchSize || DEFAULT_OPTIONS.batchSize,
      debounceTime || DEFAULT_OPTIONS.debounceTime,
    );
  },

  /**
   * Create a paginated data handler
   */
  createPaginator<T>(
    socket: Socket,
    eventName: string,
    pageSize?: number,
  ): PaginatedDataHandler<T> {
    return new PaginatedDataHandler<T>(
      socket,
      eventName,
      pageSize || DEFAULT_OPTIONS.pageSize,
    );
  },

  /**
   * Setup handlers for binary data
   */
  setupBinaryHandlers(socket: Socket, events: string[]): void {
    for (const event of events) {
      socket.on(`binary:${event}`, (...args: unknown[]) => {
        const data = args[0] as ArrayBuffer | Blob;
        // Process binary data (implementation depends on specific use case)
        socket.emit(event, data);
      });
    }
  },
};

export default SocketOptimizers;
