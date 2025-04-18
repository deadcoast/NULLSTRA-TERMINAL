// Fix Express Response and Request type issues

declare global {
  namespace Express {
    interface Request {
      body: any;
      headers: {
        [key: string]: string | string[] | undefined;
        authorization?: string;
      };
      user?: {
        userId: string;
        sessionId: string;
      };
    }

    interface Response {
      status(code: number): Response;
      json(body: any): Response;
      send(body: any): Response;
    }
  }
}

declare module "express-serve-static-core" {
  interface Request {
    body: any;
    headers: {
      [key: string]: string | string[] | undefined;
      authorization?: string;
    };
    user?: {
      userId: string;
      sessionId: string;
    };
  }

  interface Response {
    status(code: number): Response;
    json(body: any): Response;
    send(body: any): Response;
  }
}

import * as http from "http";
import { Server } from "http";

declare module "express" {
  export interface Application {
    listen(port: number, hostname?: string, callback?: () => void): Server;
    get(path: string, ...handlers: any[]): this;
    post(path: string, ...handlers: any[]): this;
    put(path: string, ...handlers: any[]): this;
    delete(path: string, ...handlers: any[]): this;
    use(...handlers: any[]): this;
    set(setting: string, value: any): this;
    disable(setting: string): this;
    enable(setting: string): this;
    use(
      path: string,
      handler: RequestHandler | ErrorRequestHandler,
    ): Application;
    use(handler: RequestHandler | ErrorRequestHandler): Application;
    get(path: string, ...handlers: RequestHandler[]): Application;
    post(path: string, ...handlers: RequestHandler[]): Application;
    put(path: string, ...handlers: RequestHandler[]): Application;
    delete(path: string, ...handlers: RequestHandler[]): Application;
    listen(port: number, callback?: () => void): http.Server;
    [key: string]: any;
  }

  export function express(): Application;
  export function static(root: string, options?: any): RequestHandler;
  export function json(options?: any): RequestHandler;
  export function urlencoded(options?: any): RequestHandler;
  export default function (): Application;
}

declare module "express" {
  import * as events from "events";
  import * as http from "http";

  export interface Request extends http.IncomingMessage {
    body: any;
    params: Record<string, string>;
    query: Record<string, string>;
    headers: Record<string, string | string[] | undefined>;
    user?: any;
  }

  export interface Response extends http.ServerResponse {
    status(code: number): Response;
    json(data: any): Response;
    send(body: any): Response;
    sendFile(path: string): Response;
    render(view: string, locals?: any): Response;
    redirect(url: string): Response;
  }

  export type NextFunction = (err?: any) => void;

  export type RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  export type ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;

  export interface Application extends events.EventEmitter {
    use(
      path: string | RequestHandler,
      ...handlers: RequestHandler[]
    ): Application;
    get(path: string, ...handlers: RequestHandler[]): Application;
    post(path: string, ...handlers: RequestHandler[]): Application;
    put(path: string, ...handlers: RequestHandler[]): Application;
    delete(path: string, ...handlers: RequestHandler[]): Application;
    listen(port: number, callback?: () => void): http.Server;
  }

  // Export namespace with middleware
  namespace express {
    export function json(): RequestHandler;
    export function urlencoded(options: { extended: boolean }): RequestHandler;
    export function static(root: string, options?: any): RequestHandler;
    export function Router(): any;
  }

  // Export the main express function
  function express(): Application;
  export = express;
}

export {};
