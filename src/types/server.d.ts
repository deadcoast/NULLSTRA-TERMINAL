declare module 'socket.io' {
  import { Server as HttpServer } from 'http';

  export interface ServerOptions {
    path?: string;
    serveClient?: boolean;
    pingInterval?: number;
    pingTimeout?: number;
    transports?: string[];
    adapter?: any;
    cors?: {
      origin?: string | string[] | boolean;
      methods?: string[];
      allowedHeaders?: string[];
      exposedHeaders?: string[];
      credentials?: boolean;
      maxAge?: number;
    };
  }

  export class Server {
    constructor(httpServer?: HttpServer, options?: ServerOptions);
    on(event: string, listener: Function): this;
    emit(event: string, ...args: any[]): boolean;
    close(callback?: (err?: Error) => void): void;
    of(nsp: string): Namespace;
  }

  export class Namespace {
    on(event: string, listener: Function): this;
    emit(event: string, ...args: any[]): boolean;
  }

  export class Socket {
    id: string;
    handshake: any;
    on(event: string, listener: Function): this;
    emit(event: string, ...args: any[]): boolean;
    join(room: string): void;
    leave(room: string): void;
    disconnect(close?: boolean): void;
  }

  export default Server;
}

declare module 'dotenv' {
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
