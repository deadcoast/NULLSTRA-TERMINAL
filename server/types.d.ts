// Express namespace
declare namespace Express {
  export interface Request {
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

  export interface Response {
    status(code: number): Response;
    json(body: any): Response;
    send(body: any): Response;
  }
}

// Express module
declare module "express" {
  import * as http from "http";

  export interface Application {
    use: any;
    get: any;
    post: any;
    listen(port: number, callback?: () => void): http.Server;
  }

  export interface RequestHandler {
    (
      req: Express.Request,
      res: Express.Response,
      next: (err?: any) => void,
    ): void;
  }

  namespace express {
    export function json(): RequestHandler;
    export function urlencoded(options?: any): RequestHandler;
    export function static(path: string): RequestHandler;
  }

  function express(): Application;
  export = express;
}

// CORS module
declare module "cors" {
  function cors(options?: any): any;
  export = cors;
}

// JWT module
declare module "jsonwebtoken" {
  export function sign(
    payload: any,
    secretOrPrivateKey: string,
    options?: any,
  ): string;
  export function verify(token: string, secretOrPublicKey: string): any;
}

// Express-serve-static-core
declare module "express-serve-static-core" {
  export interface Request {
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

  export interface Response {
    status(code: number): Response;
    json(body: any): Response;
    send(body: any): Response;
  }

  export type NextFunction = (err?: any) => void;
}
