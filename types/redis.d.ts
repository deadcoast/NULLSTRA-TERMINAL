declare module "redis" {
  export interface RedisClient {
    on(event: string, callback: Function): this;
    quit(): void;
    isReady: boolean;
    connect(): Promise<void>;
    get(
      key: string,
      callback?: (err: Error | null, reply: string | null) => void,
    ): Promise<string | null>;
    set(
      key: string,
      value: string,
      callback?: (err: Error | null, reply: string) => void,
    ): Promise<string>;
    set(
      key: string,
      value: string,
      mode: string,
      duration: number,
      callback?: (err: Error | null, reply: string) => void,
    ): Promise<string>;
    del(
      key: string,
      callback?: (err: Error | null, reply: number) => void,
    ): Promise<number>;
    exists(
      key: string,
      callback?: (err: Error | null, reply: number) => void,
    ): Promise<number>;
    lRange(key: string, start: number, end: number): Promise<string[]>;
    lPush(key: string, value: string): Promise<number>;
    lTrim(key: string, start: number, end: number): Promise<string>;
    expire(key: string, seconds: number): Promise<number>;
  }

  export interface RedisClientOptions {
    url?: string;
    socket?: {
      host?: string;
      port?: number;
      connectTimeout?: number;
    };
    password?: string;
    database?: number;
  }

  export type RedisClientType = RedisClient;

  export function createClient(options?: RedisClientOptions): RedisClientType;
}

export {};
