declare module "socket.io" {
  import { Server as HttpServer } from "http";

  export interface ServerOptions {
    path?: string;
    serveClient?: boolean;
    pingInterval?: number;
    pingTimeout?: number;
    transports?: string[];
    adapter?: unknown;
    cors?: {
      origin?: string | string[] | boolean;
      methods?: string[];
      allowedHeaders?: string[];
      exposedHeaders?: string[];
      credentials?: boolean;
      maxAge?: number;
    };
  }

  export interface SocketEventMap {
    connection: (socket: Socket) => void;
    [event: string]: (...args: unknown[]) => void;
  }

  export interface SocketClientEventMap {
    authenticate: (token: string) => void;
    execute_command: (data: {
      command: string;
      args: string[];
      sessionId?: string;
    }) => void;
    get_command_history: (data: { sessionId?: string }) => void;
    disconnect: () => void;
    [event: string]: (...args: unknown[]) => void;
  }

  export class Server {
    constructor(httpServer?: HttpServer, options?: ServerOptions);
    on<Ev extends keyof SocketEventMap>(
      event: Ev,
      listener: SocketEventMap[Ev],
    ): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): boolean;
    close(callback?: (err?: Error) => void): void;
    of(nsp: string): Namespace;
  }

  export class Namespace {
    on<Ev extends keyof SocketEventMap>(
      event: Ev,
      listener: SocketEventMap[Ev],
    ): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): boolean;
  }

  export class Socket {
    id: string;
    handshake: Record<string, unknown>;
    on<Ev extends keyof SocketClientEventMap>(
      event: Ev,
      listener: SocketClientEventMap[Ev],
    ): this;
    on(event: string, listener: (...args: unknown[]) => void): this;
    emit(event: string, ...args: unknown[]): boolean;
    join(room: string): void;
    leave(room: string): void;
    disconnect(close?: boolean): void;
  }

  export default Server;
}

declare module "dotenv" {
  export interface DotenvConfigOptions {
    path?: string;
    encoding?: string;
    debug?: boolean;
    override?: boolean;
  }

  export interface DotenvConfigOutput {
    parsed?: { [key: string]: string };
    error?: Error;
  }

  export function config(options?: DotenvConfigOptions): DotenvConfigOutput;
  export function parse(src: string | Buffer): { [key: string]: string };
}
